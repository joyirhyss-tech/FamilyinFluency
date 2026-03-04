#!/usr/bin/env python3
"""
Generate high-quality audio for all stories and vocabulary using Edge TTS.
Uses Microsoft's neural voices for natural, fluid speech.

Voices:
  Spanish (MX): es-MX-DaliaNeural (warm female)
  Japanese:     ja-JP-NanamiNeural (clear female)
  Korean:       ko-KR-SunHiNeural (clear female)
"""

import asyncio
import os
import re
import json
import hashlib
import sys

try:
    import edge_tts
except ImportError:
    print("edge-tts not installed. Run: pip3 install edge-tts")
    sys.exit(1)

# Config
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(PROJECT_ROOT, "public", "audio")
DATA_DIR = os.path.join(PROJECT_ROOT, "src", "data")

VOICES = {
    "es": "es-MX-DaliaNeural",
    "ja": "ja-JP-NanamiNeural",
    "ko": "ko-KR-SunHiNeural",
}

# Slower rate for story narration (clear & easy to follow)
STORY_RATE = "-25%"
# Normal rate for vocab words
VOCAB_RATE = "-15%"

LANG_FILES = {
    "es": "stories-spanish.js",
    "ja": "stories-japanese.js",
    "ko": "stories-korean.js",
}


def extract_stories_from_js(filepath):
    """Extract story text and vocab from JS story data files using regex."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    stories = []

    # Extract story IDs
    story_ids = re.findall(r'id:\s*"([^"]+)"', content)

    # Extract page texts (all text: "..." fields)
    page_texts = re.findall(r'text:\s*"((?:[^"\\]|\\.)*)"', content)

    # Extract vocab words (all word: "..." fields)
    vocab_words = re.findall(r'word:\s*"((?:[^"\\]|\\.)*)"', content)

    # Unescape JS string escapes
    def unescape(s):
        return s.replace('\\"', '"').replace("\\'", "'").replace("\\n", "\n")

    page_texts = [unescape(t) for t in page_texts]
    vocab_words = [unescape(w) for w in vocab_words]

    return story_ids, page_texts, vocab_words


def safe_filename(text, max_len=40):
    """Create a safe filename from text."""
    # Use a hash for uniqueness
    h = hashlib.md5(text.encode()).hexdigest()[:8]
    # Clean the text for readability
    clean = re.sub(r'[^\w\s-]', '', text[:max_len]).strip()
    clean = re.sub(r'\s+', '_', clean)
    if clean:
        return f"{clean}_{h}"
    return h


async def generate_audio(text, voice, rate, output_path, timing_path=None):
    """Generate audio file using Edge TTS, optionally capturing word timing."""
    audio_exists = os.path.exists(output_path)
    timing_exists = timing_path and os.path.exists(timing_path)

    # If both exist, skip entirely
    if audio_exists and (not timing_path or timing_exists):
        return False

    try:
        communicate = edge_tts.Communicate(text, voice, rate=rate)

        if timing_path and not timing_exists:
            # Stream mode: capture audio + word boundaries
            word_events = []
            audio_chunks = []

            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_chunks.append(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    word_events.append({
                        "offset": chunk["offset"] / 10_000_000,  # 100-ns ticks → seconds
                        "duration": chunk["duration"] / 10_000_000,
                        "text": chunk["text"],
                    })

            # Write audio if needed
            if not audio_exists:
                with open(output_path, "wb") as f:
                    for c in audio_chunks:
                        f.write(c)

            # Write timing JSON
            with open(timing_path, "w", encoding="utf-8") as f:
                json.dump(word_events, f, ensure_ascii=False)

            return True
        else:
            # Simple mode: just save audio
            if not audio_exists:
                await communicate.save(output_path)
                return True
            return False
    except Exception as e:
        print(f"  ERROR generating {output_path}: {e}")
        return False


async def generate_lang_audio(lang_code, js_filename):
    """Generate all audio for a language."""
    filepath = os.path.join(DATA_DIR, js_filename)
    if not os.path.exists(filepath):
        print(f"  Skipping {lang_code}: {js_filename} not found")
        return

    voice = VOICES[lang_code]
    story_ids, page_texts, vocab_words = extract_stories_from_js(filepath)

    # Remove duplicates from vocab while preserving order
    seen_vocab = set()
    unique_vocab = []
    for w in vocab_words:
        if w not in seen_vocab:
            seen_vocab.add(w)
            unique_vocab.append(w)

    print(f"\n{'='*60}")
    print(f"  {lang_code.upper()}: {len(page_texts)} story pages, {len(unique_vocab)} unique vocab words")
    print(f"  Voice: {voice}")
    print(f"{'='*60}")

    # Generate story page audio
    stories_dir = os.path.join(AUDIO_DIR, lang_code, "stories")
    os.makedirs(stories_dir, exist_ok=True)

    # Figure out which story each page belongs to
    # We know each story has ~12 pages, but let's be precise
    # Re-read the file and split by story ID
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Split content by story blocks
    story_blocks = re.split(r'id:\s*"', content)[1:]  # Skip before first ID

    page_counter = 0
    for block_idx, block in enumerate(story_blocks):
        story_id = block.split('"')[0]
        # Count pages in this block
        block_pages = re.findall(r'text:\s*"((?:[^"\\]|\\.)*)"', block)

        for page_num, page_text in enumerate(block_pages):
            page_text = page_text.replace('\\"', '"').replace("\\'", "'").replace("\\n", "\n")
            output_file = os.path.join(stories_dir, f"{story_id}-page-{page_num+1:02d}.mp3")
            timing_file = os.path.join(stories_dir, f"{story_id}-page-{page_num+1:02d}.timing.json")

            generated = await generate_audio(page_text, voice, STORY_RATE, output_file, timing_file)
            status = "GENERATED" if generated else "EXISTS"
            print(f"  [{status}] {story_id} page {page_num+1}")
            page_counter += 1

    print(f"\n  Story pages: {page_counter}")

    # Generate vocab audio
    vocab_dir = os.path.join(AUDIO_DIR, lang_code, "vocab")
    os.makedirs(vocab_dir, exist_ok=True)

    # Create a manifest mapping word -> filename
    manifest = {}

    for i, word in enumerate(unique_vocab):
        filename = safe_filename(word) + ".mp3"
        output_file = os.path.join(vocab_dir, filename)

        generated = await generate_audio(word, voice, VOCAB_RATE, output_file)
        manifest[word] = filename

        if (i + 1) % 20 == 0 or i == len(unique_vocab) - 1:
            print(f"  Vocab: {i+1}/{len(unique_vocab)} words...")

    # Save manifest
    manifest_path = os.path.join(AUDIO_DIR, lang_code, "vocab-manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"  Vocab manifest saved: {manifest_path}")
    print(f"  Total: {page_counter} story pages + {len(unique_vocab)} vocab words")


async def main():
    print("=" * 60)
    print("  FLUENCY AUDIO GENERATOR")
    print("  Using Microsoft Edge TTS Neural Voices")
    print("=" * 60)

    for lang_code, js_file in LANG_FILES.items():
        await generate_lang_audio(lang_code, js_file)

    print("\n" + "=" * 60)
    print("  DONE! All audio generated.")
    print(f"  Audio files: {AUDIO_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    if "--timing-only" in sys.argv:
        # Delete existing timing files to force regeneration
        import glob
        for lang_code in VOICES:
            pattern = os.path.join(AUDIO_DIR, lang_code, "stories", "*.timing.json")
            for f in glob.glob(pattern):
                os.remove(f)
        print("Cleared existing timing files. Regenerating...")
    asyncio.run(main())
