export const JAPANESE_STORIES = [
  // ─────────────────────────────────────────────
  // Story 1: おおきなかぶ (The Enormous Turnip)
  // ─────────────────────────────────────────────
  {
    id: "ja-story-1",
    title: "おおきなかぶ",
    titleEn: "The Enormous Turnip",
    level: 0,
    coverColor: "#2c5f8a",
    coverIcon: "turnip",
    description: "Everyone pulls together to harvest a giant turnip. Ultra-simple and repetitive.",
    pages: [
      {
        text: "むかしむかし、おじいさんが いました。おじいさんは はたけに かぶの たねを まきました。「おおきく なあれ、おおきく なあれ。」",
        translation: "Once upon a time, there was an old man. The old man planted turnip seeds in the field. \"Grow big, grow big.\"",
        vocab: [
          { word: "おじいさん", meaning: "grandfather / old man" },
          { word: "はたけ", meaning: "field / garden" },
          { word: "かぶ", meaning: "turnip" },
          { word: "たね", meaning: "seed" },
        ]
      },
      {
        text: "かぶは どんどん おおきく なりました。それは とても とても おおきな かぶに なりました。おじいさんは びっくりしました。",
        translation: "The turnip grew bigger and bigger. It became a very, very big turnip. The old man was surprised.",
        vocab: [
          { word: "どんどん", meaning: "steadily / more and more" },
          { word: "おおきな", meaning: "big / large" },
          { word: "びっくり", meaning: "surprised" },
        ]
      },
      {
        text: "おじいさんは かぶを ぬこうと しました。「うんとこしょ、どっこいしょ！」でも、かぶは ぬけません。",
        translation: "The old man tried to pull out the turnip. \"Heave-ho, heave-ho!\" But the turnip wouldn't come out.",
        vocab: [
          { word: "ぬく", meaning: "to pull out" },
          { word: "うんとこしょ", meaning: "heave-ho (pulling sound)" },
          { word: "どっこいしょ", meaning: "heave-ho (effort sound)" },
        ]
      },
      {
        text: "おじいさんは おばあさんを よびました。「おばあさん、てつだって ください！」おばあさんが きました。",
        translation: "The old man called the old woman. \"Old woman, please help me!\" The old woman came.",
        vocab: [
          { word: "おばあさん", meaning: "grandmother / old woman" },
          { word: "よぶ", meaning: "to call" },
          { word: "てつだう", meaning: "to help" },
        ]
      },
      {
        text: "おばあさんが おじいさんを ひっぱって、おじいさんが かぶを ひっぱりました。「うんとこしょ、どっこいしょ！」でも、かぶは ぬけません。",
        translation: "The old woman pulled the old man, and the old man pulled the turnip. \"Heave-ho, heave-ho!\" But the turnip wouldn't come out.",
        vocab: [
          { word: "ひっぱる", meaning: "to pull" },
          { word: "でも", meaning: "but / however" },
        ]
      },
      {
        text: "おばあさんは まごむすめを よびました。「まごちゃん、てつだって ください！」まごむすめが きました。",
        translation: "The old woman called the granddaughter. \"Granddaughter, please help!\" The granddaughter came.",
        vocab: [
          { word: "まごむすめ", meaning: "granddaughter" },
          { word: "きました", meaning: "came (past tense of come)" },
        ]
      },
      {
        text: "まごむすめが おばあさんを ひっぱって、おばあさんが おじいさんを ひっぱって、おじいさんが かぶを ひっぱりました。「うんとこしょ、どっこいしょ！」でも、かぶは ぬけません。",
        translation: "The granddaughter pulled the old woman, the old woman pulled the old man, and the old man pulled the turnip. \"Heave-ho, heave-ho!\" But the turnip wouldn't come out.",
        vocab: [
          { word: "ひっぱって", meaning: "pulling (te-form)" },
          { word: "ぬけません", meaning: "won't come out" },
        ]
      },
      {
        text: "まごむすめは いぬを よびました。「いぬさん、てつだって ください！」いぬが きました。いぬが まごむすめを ひっぱりました。",
        translation: "The granddaughter called the dog. \"Dog, please help!\" The dog came. The dog pulled the granddaughter.",
        vocab: [
          { word: "いぬ", meaning: "dog" },
          { word: "さん", meaning: "Mr./Ms. (polite suffix)" },
        ]
      },
      {
        text: "みんなで ひっぱりました。「うんとこしょ、どっこいしょ！」でも、まだ かぶは ぬけません。いぬは ねこを よびました。",
        translation: "Everyone pulled together. \"Heave-ho, heave-ho!\" But still, the turnip wouldn't come out. The dog called the cat.",
        vocab: [
          { word: "みんな", meaning: "everyone" },
          { word: "まだ", meaning: "still / not yet" },
          { word: "ねこ", meaning: "cat" },
        ]
      },
      {
        text: "ねこが いぬを ひっぱって、いぬが まごむすめを ひっぱって、まごむすめが おばあさんを ひっぱりました。「うんとこしょ、どっこいしょ！」でも、かぶは ぬけません。",
        translation: "The cat pulled the dog, the dog pulled the granddaughter, the granddaughter pulled the old woman. \"Heave-ho, heave-ho!\" But the turnip wouldn't come out.",
        vocab: [
          { word: "ねこ", meaning: "cat" },
          { word: "ひっぱって", meaning: "pulled (and then...)" },
        ]
      },
      {
        text: "ねこは ねずみを よびました。「ねずみさん、おねがい！」ちいさな ねずみが きました。ねずみが ねこを ひっぱりました。",
        translation: "The cat called the mouse. \"Mouse, please!\" A small mouse came. The mouse pulled the cat.",
        vocab: [
          { word: "ねずみ", meaning: "mouse" },
          { word: "ちいさな", meaning: "small / little" },
          { word: "おねがい", meaning: "please (request)" },
        ]
      },
      {
        text: "みんなで いっしょに ひっぱりました。「うんとこしょ、どっこいしょ！」とうとう、おおきな かぶは ぬけました！みんなは とても うれしかったです。",
        translation: "Everyone pulled together. \"Heave-ho, heave-ho!\" Finally, the enormous turnip came out! Everyone was very happy.",
        vocab: [
          { word: "いっしょに", meaning: "together" },
          { word: "とうとう", meaning: "finally / at last" },
          { word: "ぬけました", meaning: "came out (past tense)" },
          { word: "うれしい", meaning: "happy / glad" },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────
  // Story 2: かさじぞう (The Jizo Hats)
  // ─────────────────────────────────────────────
  {
    id: "ja-story-2",
    title: "かさじぞう",
    titleEn: "The Jizo Hats",
    level: 1,
    coverColor: "#6b4c8a",
    coverIcon: "hat",
    description: "A kind old man gives his hats to stone Jizo statues in the snow. Simple past tense.",
    pages: [
      {
        text: "むかしむかし、まずしい おじいさんと おばあさんが いました。もうすぐ おしょうがつです。でも、おもちを かう おかねが ありません。",
        translation: "Once upon a time, there were a poor old man and old woman. New Year was coming soon. But they had no money to buy rice cakes.",
        vocab: [
          { word: "まずしい", meaning: "poor" },
          { word: "おしょうがつ", meaning: "New Year" },
          { word: "おもち", meaning: "rice cake" },
          { word: "おかね", meaning: "money" },
        ]
      },
      {
        text: "おじいさんは かさを つくりました。「まちで この かさを うりましょう。」おばあさんは いいました。「きを つけて いって ください。」",
        translation: "The old man made some hats. \"Let's sell these hats in town.\" The old woman said, \"Please be careful.\"",
        vocab: [
          { word: "かさ", meaning: "hat / umbrella" },
          { word: "つくる", meaning: "to make" },
          { word: "まち", meaning: "town" },
          { word: "うる", meaning: "to sell" },
        ]
      },
      {
        text: "おじいさんは かさを もって まちに いきました。ゆきが たくさん ふっていました。とても さむい ひでした。",
        translation: "The old man carried the hats and went to town. A lot of snow was falling. It was a very cold day.",
        vocab: [
          { word: "もつ", meaning: "to carry / to hold" },
          { word: "ゆき", meaning: "snow" },
          { word: "ふる", meaning: "to fall (rain/snow)" },
          { word: "さむい", meaning: "cold" },
        ]
      },
      {
        text: "まちで おじいさんは 「かさは いかがですか！」と いいました。でも、だれも かさを かいませんでした。おじいさんは かなしく なりました。",
        translation: "In town, the old man called out, \"How about a hat?\" But nobody bought a hat. The old man became sad.",
        vocab: [
          { word: "いかが", meaning: "how about / would you like" },
          { word: "だれも", meaning: "nobody" },
          { word: "かう", meaning: "to buy" },
          { word: "かなしい", meaning: "sad" },
        ]
      },
      {
        text: "おじいさんは いえに かえりました。みちの よこに ろくつの おじぞうさまが たっていました。おじぞうさまの あたまに ゆきが つもっていました。",
        translation: "The old man went back home. On the side of the road, six Jizo statues were standing. Snow had piled up on the Jizo statues' heads.",
        vocab: [
          { word: "みち", meaning: "road / path" },
          { word: "おじぞうさま", meaning: "Jizo statue (guardian deity)" },
          { word: "あたま", meaning: "head" },
          { word: "つもる", meaning: "to pile up" },
        ]
      },
      {
        text: "「おじぞうさま、さむいでしょう。」おじいさんは おじぞうさまの あたまの ゆきを はらいました。そして、かさを おじぞうさまに かぶせました。",
        translation: "\"Jizo statues, you must be cold.\" The old man brushed the snow off the Jizo statues' heads. Then, he placed the hats on the Jizo statues.",
        vocab: [
          { word: "さむい", meaning: "cold" },
          { word: "はらう", meaning: "to brush off / to sweep" },
          { word: "かぶせる", meaning: "to put on (someone's head)" },
        ]
      },
      {
        text: "かさは いつつ ありました。でも おじぞうさまは ろくつです。おじいさんは じぶんの てぬぐいを さいごの おじぞうさまに かぶせました。",
        translation: "There were five hats. But there were six Jizo statues. The old man placed his own hand towel on the last Jizo statue.",
        vocab: [
          { word: "じぶん", meaning: "oneself / one's own" },
          { word: "てぬぐい", meaning: "hand towel / cloth" },
          { word: "さいご", meaning: "last / final" },
        ]
      },
      {
        text: "おじいさんは いえに かえりました。おばあさんに はなしました。「かさは うれませんでした。でも、おじぞうさまに あげました。」",
        translation: "The old man returned home. He told the old woman. \"The hats didn't sell. But I gave them to the Jizo statues.\"",
        vocab: [
          { word: "かえる", meaning: "to return / to go home" },
          { word: "はなす", meaning: "to tell / to talk" },
          { word: "あげる", meaning: "to give" },
        ]
      },
      {
        text: "おばあさんは にっこり わらいました。「それは いい ことを しましたね。」ふたりは おゆを のんで ねました。",
        translation: "The old woman smiled warmly. \"That was a good thing you did.\" The two drank hot water and went to sleep.",
        vocab: [
          { word: "わらう", meaning: "to smile / to laugh" },
          { word: "いい こと", meaning: "a good thing / good deed" },
          { word: "ねる", meaning: "to sleep / to go to bed" },
        ]
      },
      {
        text: "そのよる、そとから おおきな おとが しました。「ずしーん、ずしーん。」おじいさんと おばあさんは おきました。",
        translation: "That night, a loud sound came from outside. \"Thud, thud.\" The old man and old woman woke up.",
        vocab: [
          { word: "よる", meaning: "night" },
          { word: "そと", meaning: "outside" },
          { word: "おと", meaning: "sound / noise" },
          { word: "おきる", meaning: "to wake up" },
        ]
      },
      {
        text: "とを あけると、そとに たくさんの おこめや やさいや おもちが ありました。おじぞうさまが はこんで くれたのです。ゆきの うえに おおきな あしあとが ありました。",
        translation: "When they opened the door, outside there was a lot of rice, vegetables, and rice cakes. The Jizo statues had carried them there. There were big footprints in the snow.",
        vocab: [
          { word: "おこめ", meaning: "rice (uncooked)" },
          { word: "やさい", meaning: "vegetables" },
          { word: "はこぶ", meaning: "to carry / to deliver" },
          { word: "あしあと", meaning: "footprints" },
        ]
      },
      {
        text: "おじいさんと おばあさんは とても よろこびました。「おじぞうさま、ありがとうございます！」ふたりは しあわせな おしょうがつを すごしました。",
        translation: "The old man and old woman were overjoyed. \"Thank you so much, Jizo statues!\" The two spent a happy New Year.",
        vocab: [
          { word: "よろこぶ", meaning: "to be delighted / to rejoice" },
          { word: "しあわせな", meaning: "happy / fortunate" },
          { word: "すごす", meaning: "to spend (time)" },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────
  // Story 3: ももたろう (Momotaro / Peach Boy)
  // ─────────────────────────────────────────────
  {
    id: "ja-story-3",
    title: "ももたろう",
    titleEn: "Peach Boy",
    level: 2,
    coverColor: "#e8956a",
    coverIcon: "peach",
    description: "A boy born from a peach goes to fight demons with animal friends. Classic adventure tale.",
    pages: [
      {
        text: "むかしむかし、おじいさんと おばあさんが いました。おじいさんは 山へ しばかりに、おばあさんは 川へ せんたくに いきました。",
        translation: "Once upon a time, there were an old man and an old woman. The old man went to the mountains to gather firewood, and the old woman went to the river to do laundry.",
        vocab: [
          { word: "山（やま）", meaning: "mountain" },
          { word: "しばかり", meaning: "gathering firewood" },
          { word: "川（かわ）", meaning: "river" },
          { word: "せんたく", meaning: "laundry" },
        ]
      },
      {
        text: "おばあさんが 川で せんたくを していると、大きな ももが どんぶらこ、どんぶらこと ながれて きました。「まあ、なんて 大きな ももでしょう！」",
        translation: "While the old woman was doing laundry at the river, a big peach came floating down the river, bobbing along. \"My, what a big peach!\"",
        vocab: [
          { word: "もも", meaning: "peach" },
          { word: "大きな（おおきな）", meaning: "big / large" },
          { word: "ながれる", meaning: "to flow / to float along" },
          { word: "どんぶらこ", meaning: "bobbing (onomatopoeia)" },
        ]
      },
      {
        text: "おばあさんは ももを いえに もって かえりました。おじいさんと いっしょに ももを きると、中から 元気な おとこのこが でて きました。",
        translation: "The old woman brought the peach home. When she and the old man cut the peach open, a lively baby boy came out from inside.",
        vocab: [
          { word: "きる", meaning: "to cut" },
          { word: "中（なか）", meaning: "inside" },
          { word: "元気な（げんきな）", meaning: "energetic / lively" },
          { word: "おとこのこ", meaning: "boy" },
        ]
      },
      {
        text: "ふたりは おとこのこを 「ももたろう」と なづけました。ももたろうは まいにち たくさん ごはんを たべて、大きく つよく なりました。",
        translation: "The two named the boy \"Momotaro.\" Momotaro ate a lot of rice every day and grew big and strong.",
        vocab: [
          { word: "なづける", meaning: "to name" },
          { word: "まいにち", meaning: "every day" },
          { word: "ごはん", meaning: "rice / meal" },
          { word: "つよい", meaning: "strong" },
        ]
      },
      {
        text: "ある日、ももたろうは いいました。「おにが しまで わるい ことを しています。ぼくが おにを たいじしに いきます。」おばあさんは きびだんごを つくって くれました。",
        translation: "One day, Momotaro said, \"Demons are doing bad things on their island. I will go defeat the demons.\" The old woman made kibidango (millet dumplings) for him.",
        vocab: [
          { word: "おに", meaning: "demon / ogre" },
          { word: "しま", meaning: "island" },
          { word: "たいじする", meaning: "to defeat / to exterminate" },
          { word: "きびだんご", meaning: "millet dumpling" },
        ]
      },
      {
        text: "みちを あるいて いると、いぬが きました。「ももたろうさん、どこへ いきますか。」「おにがしまへ おにたいじに いきます。」「きびだんごを ひとつ ください。おともします。」",
        translation: "As he walked along the road, a dog came. \"Momotaro, where are you going?\" \"I'm going to Demon Island to defeat demons.\" \"Please give me one kibidango. I'll come with you.\"",
        vocab: [
          { word: "いぬ", meaning: "dog" },
          { word: "どこ", meaning: "where" },
          { word: "おとも", meaning: "companion / accompanying" },
          { word: "ひとつ", meaning: "one (counter)" },
        ]
      },
      {
        text: "つぎに、さるに あいました。「ももたろうさん、きびだんごを ひとつ ください。ぼくも おともします。」さるも なかまに なりました。",
        translation: "Next, he met a monkey. \"Momotaro, please give me one kibidango. I'll come with you too.\" The monkey also became a companion.",
        vocab: [
          { word: "さる", meaning: "monkey" },
          { word: "つぎに", meaning: "next" },
          { word: "なかま", meaning: "companion / friend" },
          { word: "あう", meaning: "to meet" },
        ]
      },
      {
        text: "さいごに、きじが きました。「ももたろうさん、わたしも つれていって ください。」ももたろうは きじにも きびだんごを あげました。",
        translation: "Lastly, a pheasant came. \"Momotaro, please take me with you too.\" Momotaro gave a kibidango to the pheasant as well.",
        vocab: [
          { word: "きじ", meaning: "pheasant" },
          { word: "つれていく", meaning: "to take along" },
          { word: "さいごに", meaning: "lastly / finally" },
          { word: "わたし", meaning: "I / me" },
        ]
      },
      {
        text: "ももたろうと なかまたちは ふねに のって おにがしまに つきました。大きな もんが ありました。「おにたち、でて こい！」と ももたろうは さけびました。",
        translation: "Momotaro and his companions rode a boat and arrived at Demon Island. There was a big gate. \"Demons, come out!\" Momotaro shouted.",
        vocab: [
          { word: "ふね", meaning: "boat / ship" },
          { word: "のる", meaning: "to ride" },
          { word: "つく", meaning: "to arrive" },
          { word: "さけぶ", meaning: "to shout" },
        ]
      },
      {
        text: "たたかいが はじまりました。いぬは おにの あしに かみつきました。さるは おにの かおを ひっかきました。きじは おにの 目を つつきました。",
        translation: "The battle began. The dog bit the demons' legs. The monkey scratched the demons' faces. The pheasant pecked the demons' eyes.",
        vocab: [
          { word: "たたかい", meaning: "battle / fight" },
          { word: "かみつく", meaning: "to bite" },
          { word: "ひっかく", meaning: "to scratch" },
          { word: "目（め）", meaning: "eye" },
        ]
      },
      {
        text: "おにの おやぶんが でて きました。ももたろうは おやぶんと たたかいました。ももたろうは とても つよかったです。おやぶんは まけました。「もう わるい ことは しません！」",
        translation: "The demon boss came out. Momotaro fought the boss. Momotaro was very strong. The boss lost. \"We won't do bad things anymore!\"",
        vocab: [
          { word: "おやぶん", meaning: "boss / leader" },
          { word: "たたかう", meaning: "to fight" },
          { word: "まける", meaning: "to lose / to be defeated" },
          { word: "もう", meaning: "anymore / no longer" },
        ]
      },
      {
        text: "おにたちは たからものを かえしました。ももたろうは たからものを もって むらに かえりました。おじいさんと おばあさんは とても よろこびました。みんな しあわせに くらしました。",
        translation: "The demons returned the treasure. Momotaro brought the treasure back to the village. The old man and old woman were overjoyed. Everyone lived happily.",
        vocab: [
          { word: "たからもの", meaning: "treasure" },
          { word: "かえす", meaning: "to return (something)" },
          { word: "むら", meaning: "village" },
          { word: "くらす", meaning: "to live / to make a living" },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────
  // Story 4: うさぎとかめ (Tortoise and Hare)
  // ─────────────────────────────────────────────
  {
    id: "ja-story-4",
    title: "うさぎとかめ",
    titleEn: "The Tortoise and the Hare",
    level: 1,
    coverColor: "#4a9e6b",
    coverIcon: "rabbit",
    description: "A hare brags about being fast but loses to a steady tortoise. Simple moral lesson.",
    pages: [
      {
        text: "むかしむかし、はやい うさぎと おそい かめが いました。うさぎは いつも じまんしていました。「ぼくは せかいで いちばん はやいんだ！」",
        translation: "Once upon a time, there were a fast hare and a slow tortoise. The hare was always bragging. \"I'm the fastest in the world!\"",
        vocab: [
          { word: "うさぎ", meaning: "hare / rabbit" },
          { word: "かめ", meaning: "tortoise / turtle" },
          { word: "はやい", meaning: "fast" },
          { word: "じまん", meaning: "bragging / boasting" },
        ]
      },
      {
        text: "ある日、うさぎは かめに いいました。「かめさん、きみは ほんとうに おそいね。」かめは しずかに こたえました。「そうかもしれません。でも、あきらめません。」",
        translation: "One day, the hare said to the tortoise. \"Tortoise, you are really slow.\" The tortoise answered quietly. \"That may be so. But I never give up.\"",
        vocab: [
          { word: "おそい", meaning: "slow" },
          { word: "しずかに", meaning: "quietly" },
          { word: "こたえる", meaning: "to answer / to reply" },
          { word: "あきらめる", meaning: "to give up" },
        ]
      },
      {
        text: "かめは いいました。「うさぎさん、きょうそうしませんか。」うさぎは わらいました。「きょうそう？ ぼくと？ おもしろい！ いいよ、やろう！」",
        translation: "The tortoise said, \"Hare, shall we have a race?\" The hare laughed. \"A race? With me? How funny! Sure, let's do it!\"",
        vocab: [
          { word: "きょうそう", meaning: "race / competition" },
          { word: "わらう", meaning: "to laugh" },
          { word: "おもしろい", meaning: "funny / interesting" },
        ]
      },
      {
        text: "もりの どうぶつたちが あつまりました。きつねが いいました。「あの 山の うえが ゴールです。よーい、どん！」きょうそうが はじまりました。",
        translation: "The forest animals gathered. The fox said, \"The top of that mountain is the goal. Ready, go!\" The race began.",
        vocab: [
          { word: "どうぶつ", meaning: "animal" },
          { word: "あつまる", meaning: "to gather" },
          { word: "きつね", meaning: "fox" },
          { word: "ゴール", meaning: "goal / finish line" },
        ]
      },
      {
        text: "うさぎは ぴゅーっと はしりました。あっという まに かめは みえなく なりました。うさぎは ふりかえりました。かめは ずっと うしろです。",
        translation: "The hare ran with a whoosh. In the blink of an eye, the tortoise was out of sight. The hare looked back. The tortoise was far behind.",
        vocab: [
          { word: "はしる", meaning: "to run" },
          { word: "あっというまに", meaning: "in the blink of an eye" },
          { word: "ふりかえる", meaning: "to look back" },
          { word: "うしろ", meaning: "behind" },
        ]
      },
      {
        text: "「かめは おそすぎる。すこし ひるねしよう。」うさぎは 大きな 木の したで よこに なりました。かぜが きもちよくて、うさぎは ぐうぐう ねてしまいました。",
        translation: "\"The tortoise is way too slow. I'll take a little nap.\" The hare lay down under a big tree. The breeze felt nice, and the hare fell fast asleep.",
        vocab: [
          { word: "ひるね", meaning: "nap / afternoon sleep" },
          { word: "木（き）", meaning: "tree" },
          { word: "した", meaning: "under / below" },
          { word: "かぜ", meaning: "wind / breeze" },
        ]
      },
      {
        text: "そのあいだ、かめは ゆっくり ゆっくり あるきつづけました。「いっぽ、いっぽ、すすめば いい。」かめは やすみませんでした。",
        translation: "Meanwhile, the tortoise kept walking slowly, slowly. \"One step, one step, just keep going.\" The tortoise did not rest.",
        vocab: [
          { word: "ゆっくり", meaning: "slowly" },
          { word: "あるく", meaning: "to walk" },
          { word: "いっぽ", meaning: "one step" },
          { word: "やすむ", meaning: "to rest" },
        ]
      },
      {
        text: "かめは ねている うさぎの よこを とおりました。かめは とまりませんでした。しずかに、ゆっくり、山を のぼりつづけました。",
        translation: "The tortoise passed by the sleeping hare. The tortoise did not stop. Quietly, slowly, it kept climbing the mountain.",
        vocab: [
          { word: "とおる", meaning: "to pass by" },
          { word: "とまる", meaning: "to stop" },
          { word: "のぼる", meaning: "to climb" },
        ]
      },
      {
        text: "うさぎが 目を さましました。「あ！ たいへん！ どのくらい ねて いたんだろう。」うさぎは あわてて はしりだしました。",
        translation: "The hare opened its eyes. \"Oh! This is bad! How long was I sleeping?\" The hare started running in a panic.",
        vocab: [
          { word: "目をさます", meaning: "to wake up / to open one's eyes" },
          { word: "たいへん", meaning: "terrible / oh no" },
          { word: "あわてる", meaning: "to panic / to hurry" },
        ]
      },
      {
        text: "うさぎは 山の うえを みました。かめが もう ゴールの すぐ ちかくに いました。うさぎは いっしょうけんめい はしりました。でも、もう おそかったです。",
        translation: "The hare looked at the top of the mountain. The tortoise was already close to the goal. The hare ran with all its might. But it was already too late.",
        vocab: [
          { word: "ちかく", meaning: "near / close" },
          { word: "いっしょうけんめい", meaning: "with all one's might" },
          { word: "もう", meaning: "already" },
          { word: "おそい", meaning: "too late" },
        ]
      },
      {
        text: "かめは ゴールに つきました！「やったー！」どうぶつたちは かめに はくしゅしました。かめは にっこり わらいました。",
        translation: "The tortoise reached the goal! \"Hooray!\" The animals applauded the tortoise. The tortoise smiled warmly.",
        vocab: [
          { word: "つく", meaning: "to arrive / to reach" },
          { word: "はくしゅ", meaning: "applause / clapping" },
          { word: "にっこり", meaning: "with a warm smile" },
        ]
      },
      {
        text: "うさぎは はずかしそうに いいました。「ごめんなさい、かめさん。ぼくが まちがって いました。」かめは いいました。「ゆっくりでも、あきらめなければ、かならず ゴールできます。」",
        translation: "The hare said, looking ashamed, \"I'm sorry, Tortoise. I was wrong.\" The tortoise said, \"Even if you are slow, if you don't give up, you can always reach the goal.\"",
        vocab: [
          { word: "はずかしい", meaning: "ashamed / embarrassed" },
          { word: "まちがう", meaning: "to be wrong / to make a mistake" },
          { word: "かならず", meaning: "surely / without fail" },
          { word: "あきらめなければ", meaning: "if you don't give up" },
        ]
      },
    ]
  },
];
