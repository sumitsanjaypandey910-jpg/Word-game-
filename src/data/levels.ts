import { WordLevel, SentenceLevel, StickerBadge } from '../types';

export const WORD_LEVELS: WordLevel[] = [
  {
    id: 1,
    title: 'Pet Pals',
    category: 'Friendly Pets',
    themeEmoji: '🐾',
    description: 'Find our cozy animal companions on the farm and at home!',
    boardLetters: [
      ['C', 'A', 'T', 'F'],
      ['O', 'W', 'P', 'O'],
      ['D', 'O', 'I', 'X'],
      ['B', 'U', 'G', 'S']
    ],
    targets: [
      { id: 'w1_cat', word: 'CAT', clueEmoji: '🐱', hint: 'Purrs and loves warm naps', found: false, fact: 'Cats can jump up to 6 times their height!' },
      { id: 'w1_dog', word: 'DOG', clueEmoji: '🐶', hint: 'Mans best friend that wags its tail', found: false, fact: 'Dogs have an amazing sense of smell!' },
      { id: 'w1_pig', word: 'PIG', clueEmoji: '🐷', hint: 'Loves mud and says oink-oink', found: false, fact: 'Pigs are super smart and can learn tricks!' },
      { id: 'w1_cow', word: 'COW', clueEmoji: '🐮', hint: 'Gives us fresh white milk', found: false, fact: 'Cows have best friends and get sad when separated!' },
      { id: 'w1_fox', word: 'FOX', clueEmoji: '🦊', hint: 'Clever woodland explorer with a bushy tail', found: false, fact: 'Foxes use Earth’s magnetic field to hunt!' }
    ]
  },
  {
    id: 2,
    title: 'Yummy Treats',
    category: 'Delicious Food',
    themeEmoji: '🍎',
    description: 'Trace tasty snacks and kitchen favorites!',
    boardLetters: [
      ['C', 'A', 'K', 'E', 'S'],
      ['A', 'P', 'P', 'L', 'E'],
      ['M', 'I', 'L', 'K', 'Y'],
      ['B', 'R', 'E', 'A', 'D'],
      ['P', 'I', 'E', 'M', 'U']
    ],
    targets: [
      { id: 'w2_cake', word: 'CAKE', clueEmoji: '🎂', hint: 'Sweet birthday treat with frosting', found: false, fact: 'The largest cake ever made weighed over 100,000 pounds!' },
      { id: 'w2_apple', word: 'APPLE', clueEmoji: '🍎', hint: 'Crisp round red fruit from an orchard', found: false, fact: 'Apples float in water because they are 25% air!' },
      { id: 'w2_milk', word: 'MILK', clueEmoji: '🥛', hint: 'Healthy drink that builds strong bones', found: false, fact: 'Milk gives you calcium for strong teeth and bones!' },
      { id: 'w2_bread', word: 'BREAD', clueEmoji: '🍞', hint: 'Baked loaf for yummy toast and sandwiches', found: false, fact: 'Bread has been baked for over 10,000 years!' },
      { id: 'w2_pie', word: 'PIE', clueEmoji: '🥧', hint: 'Crust filled with warm apples or berries', found: false, fact: 'Fruit pies were made as early as ancient Rome!' }
    ]
  },
  {
    id: 3,
    title: 'Safari Adventures',
    category: 'Wild Animals',
    themeEmoji: '🦁',
    description: 'Discover magnificent wild animals in nature!',
    boardLetters: [
      ['L', 'I', 'O', 'N', 'S'],
      ['B', 'E', 'A', 'R', 'F'],
      ['I', 'R', 'O', 'G', 'R'],
      ['R', 'D', 'U', 'C', 'K'],
      ['D', 'E', 'E', 'R', 'P']
    ],
    targets: [
      { id: 'w3_lion', word: 'LION', clueEmoji: '🦁', hint: 'The king of the beasts with a golden roar', found: false, fact: 'A lion’s roar can be heard from 5 miles away!' },
      { id: 'w3_bear', word: 'BEAR', clueEmoji: '🐻', hint: 'Big furry friend that loves honey and fish', found: false, fact: 'Bears can run as fast as racehorses!' },
      { id: 'w3_frog', word: 'FROG', clueEmoji: '🐸', hint: 'Green hopper that makes ribbit sounds', found: false, fact: 'Frogs drink water through their skin!' },
      { id: 'w3_duck', word: 'DUCK', clueEmoji: '🦆', hint: 'Feathered swimmer that quacks happily', found: false, fact: 'Ducks have waterproof feathers to stay dry!' },
      { id: 'w3_bird', word: 'BIRD', clueEmoji: '🐦', hint: 'Has wings and sings joyful melodies', found: false, fact: 'Some birds can fly backward, like hummingbirds!' }
    ]
  },
  {
    id: 4,
    title: 'Sky & Space',
    category: 'Cosmic Wonders',
    themeEmoji: '🚀',
    description: 'Look high up into the clouds and cosmic stars!',
    boardLetters: [
      ['S', 'U', 'N', 'N', 'Y'],
      ['M', 'O', 'O', 'N', 'S'],
      ['S', 'T', 'A', 'R', 'T'],
      ['C', 'L', 'O', 'U', 'D'],
      ['R', 'A', 'I', 'N', 'Y']
    ],
    targets: [
      { id: 'w4_sun', word: 'SUN', clueEmoji: '☀️', hint: 'The giant glowing star giving us warm daytime', found: false, fact: 'The Sun is so big that 1 million Earths could fit inside!' },
      { id: 'w4_moon', word: 'MOON', clueEmoji: '🌙', hint: 'Glows in the night sky and changes shapes', found: false, fact: 'Footprints left by astronauts on the Moon stay there forever!' },
      { id: 'w4_star', word: 'STAR', clueEmoji: '⭐', hint: 'Twinkles in the deep dark sky', found: false, fact: 'Stars twinkle because their light passes through Earth’s atmosphere!' },
      { id: 'w4_cloud', word: 'CLOUD', clueEmoji: '☁️', hint: 'Fluffy white puff floating above', found: false, fact: 'A single fluffy cloud can weigh over a million pounds!' },
      { id: 'w4_rain', word: 'RAIN', clueEmoji: '🌧️', hint: 'Cool drops of water falling to help flowers', found: false, fact: 'Raindrops are shaped like round hamburger buns!' }
    ]
  },
  {
    id: 5,
    title: 'Rainbow Colors',
    category: 'Vibrant Colors',
    themeEmoji: '🎨',
    description: 'Find the vibrant hues that paint our beautiful world!',
    boardLetters: [
      ['R', 'E', 'D', 'B', 'L'],
      ['P', 'I', 'N', 'K', 'U'],
      ['G', 'O', 'L', 'D', 'E'],
      ['G', 'R', 'E', 'E', 'N'],
      ['T', 'E', 'A', 'L', 'S']
    ],
    targets: [
      { id: 'w5_red', word: 'RED', clueEmoji: '🔴', hint: 'The color of shiny strawberries and apples', found: false, fact: 'Red is the first color babies can see!' },
      { id: 'w5_blue', word: 'BLUE', clueEmoji: '🔵', hint: 'The hue of a clear summer sky', found: false, fact: 'Blue is the favorite color of most people around the world!' },
      { id: 'w5_pink', word: 'PINK', clueEmoji: '🌸', hint: 'Sweet blend of red and white petals', found: false, fact: 'Flamingos turn pink from the shrimp they eat!' },
      { id: 'w5_gold', word: 'GOLD', clueEmoji: '🟡', hint: 'Shining like treasure and sunlight', found: false, fact: 'Gold is so soft you could mold a coin with your fingers!' },
      { id: 'w5_green', word: 'GREEN', clueEmoji: '🟢', hint: 'The color of fresh grass and springtime leaves', found: false, fact: 'Plants look green because of a special pigment named chlorophyll!' }
    ]
  },
  {
    id: 6,
    title: 'Ocean Friends',
    category: 'Deep Blue Sea',
    themeEmoji: '🌊',
    description: 'Dive under the sparkling blue waves!',
    boardLetters: [
      ['F', 'I', 'S', 'H', 'Y'],
      ['C', 'R', 'A', 'B', 'S'],
      ['W', 'H', 'A', 'L', 'E'],
      ['S', 'H', 'A', 'R', 'K'],
      ['S', 'E', 'A', 'L', 'S']
    ],
    targets: [
      { id: 'w6_fish', word: 'FISH', clueEmoji: '🐟', hint: 'Swims in water using shiny fins', found: false, fact: 'Fish do not have eyelids and sleep with eyes open!' },
      { id: 'w6_crab', word: 'CRAB', clueEmoji: '🦀', hint: 'Walks sideways and has two strong claws', found: false, fact: 'Crabs communicate by drumming and waving their claws!' },
      { id: 'w6_whale', word: 'WHALE', clueEmoji: '🐳', hint: 'Giant peaceful mammal of the open sea', found: false, fact: 'The blue whale is the largest animal ever known to live on Earth!' },
      { id: 'w6_shark', word: 'SHARK', clueEmoji: '🦈', hint: 'Fast swimmer with cartilage instead of bones', found: false, fact: 'Sharks have existed since before dinosaurs walked the Earth!' },
      { id: 'w6_seal', word: 'SEAL', clueEmoji: '🦭', hint: 'Playful pup of the sea with whiskers', found: false, fact: 'Seals can hold their breath underwater for nearly two hours!' }
    ]
  }
];

export const SENTENCE_LEVELS: SentenceLevel[] = [
  {
    id: 1,
    title: 'The Friendly Kitten',
    themeEmoji: '🐱',
    fullSentence: 'I SEE A CAT',
    words: ['I', 'SEE', 'A', 'CAT'],
    boardLetters: [
      ['I', 'S', 'E', 'E'],
      ['A', 'C', 'A', 'T'],
      ['M', 'O', 'P', 'D'],
      ['L', 'U', 'N', 'A']
    ],
    clueIllustration: '🐱',
    hint: 'Connect the words in order: first "I", then "SEE", "A", and "CAT"!'
  },
  {
    id: 2,
    title: 'Playful Puppy',
    themeEmoji: '🐶',
    fullSentence: 'THE DOG RUNS',
    words: ['THE', 'DOG', 'RUNS'],
    boardLetters: [
      ['T', 'H', 'E', 'S'],
      ['D', 'O', 'G', 'U'],
      ['R', 'U', 'N', 'N'],
      ['P', 'A', 'W', 'S']
    ],
    clueIllustration: '🐶',
    hint: 'Build what the happy puppy is doing: "THE", "DOG", "RUNS"!'
  },
  {
    id: 3,
    title: 'Sunny Morning',
    themeEmoji: '☀️',
    fullSentence: 'THE SUN IS BIG',
    words: ['THE', 'SUN', 'IS', 'BIG'],
    boardLetters: [
      ['T', 'H', 'E', 'S'],
      ['S', 'U', 'N', 'U'],
      ['I', 'S', 'B', 'N'],
      ['B', 'I', 'G', 'Y']
    ],
    clueIllustration: '☀️',
    hint: 'Look at the giant warm daytime sky: "THE", "SUN", "IS", "BIG"!'
  },
  {
    id: 4,
    title: 'Fruity Picnic',
    themeEmoji: '🍎',
    fullSentence: 'WE LOVE APPLES',
    words: ['WE', 'LOVE', 'APPLES'],
    boardLetters: [
      ['W', 'E', 'L', 'O'],
      ['O', 'V', 'E', 'V'],
      ['A', 'P', 'P', 'E'],
      ['L', 'E', 'S', 'T']
    ],
    clueIllustration: '🍎',
    hint: 'A sweet snack for our picnic: "WE", "LOVE", "APPLES"!'
  },
  {
    id: 5,
    title: 'Flying High',
    themeEmoji: '🐦',
    fullSentence: 'BIRDS FLY HIGH',
    words: ['BIRDS', 'FLY', 'HIGH'],
    boardLetters: [
      ['B', 'I', 'R', 'D', 'S'],
      ['F', 'L', 'Y', 'U', 'P'],
      ['H', 'I', 'G', 'H', 'T'],
      ['S', 'K', 'Y', 'Z', 'W']
    ],
    clueIllustration: '🐦',
    hint: 'Soaring through the fluffy clouds: "BIRDS", "FLY", "HIGH"!'
  },
  {
    id: 6,
    title: 'Little Hopper',
    themeEmoji: '🐸',
    fullSentence: 'FROGS CAN JUMP',
    words: ['FROGS', 'CAN', 'JUMP'],
    boardLetters: [
      ['F', 'R', 'O', 'G', 'S'],
      ['C', 'A', 'N', 'L', 'E'],
      ['J', 'U', 'M', 'P', 'A'],
      ['P', 'O', 'N', 'D', 'P']
    ],
    clueIllustration: '🐸',
    hint: 'A green hopper by the lily pond: "FROGS", "CAN", "JUMP"!'
  },
  {
    id: 7,
    title: 'Night Magic',
    themeEmoji: '⭐',
    fullSentence: 'STARS SHINE BRIGHT',
    words: ['STARS', 'SHINE', 'BRIGHT'],
    boardLetters: [
      ['S', 'T', 'A', 'R', 'S'],
      ['S', 'H', 'I', 'N', 'E'],
      ['B', 'R', 'I', 'G', 'H'],
      ['T', 'M', 'O', 'O', 'N']
    ],
    clueIllustration: '⭐',
    hint: 'Twinkling above before bedtime: "STARS", "SHINE", "BRIGHT"!'
  },
  {
    id: 8,
    title: 'Young Scholar',
    themeEmoji: '📖',
    fullSentence: 'I CAN READ BOOKS',
    words: ['I', 'CAN', 'READ', 'BOOKS'],
    boardLetters: [
      ['I', 'C', 'A', 'N', 'R'],
      ['R', 'E', 'A', 'D', 'E'],
      ['B', 'O', 'O', 'K', 'S'],
      ['P', 'A', 'G', 'E', 'S']
    ],
    clueIllustration: '📖',
    hint: 'The super power of every reader: "I", "CAN", "READ", "BOOKS"!'
  }
];

export const STICKER_BADGES: StickerBadge[] = [
  {
    id: 'badge_first_word',
    title: 'First Word Speller',
    desc: 'Found your very first connected word!',
    icon: '✨',
    unlocked: true,
    targetCount: 1,
    currentCount: 1
  },
  {
    id: 'badge_pet_whisperer',
    title: 'Pet Friend',
    desc: 'Found all friendly pet animals in Level 1',
    icon: '🐾',
    unlocked: false,
    targetCount: 5,
    currentCount: 0
  },
  {
    id: 'badge_sentence_star',
    title: 'Sentence Champion',
    desc: 'Built complete sentences by connecting words',
    icon: '📜',
    unlocked: false,
    targetCount: 1,
    currentCount: 0
  },
  {
    id: 'badge_star_collector',
    title: 'Star Wizard',
    desc: 'Earned 20 or more golden stars',
    icon: '⭐',
    unlocked: false,
    targetCount: 20,
    currentCount: 0
  },
  {
    id: 'badge_word_detective',
    title: 'Word Detective',
    desc: 'Discovered 10 bonus words in the sandbox',
    icon: '🔍',
    unlocked: false,
    targetCount: 10,
    currentCount: 0
  },
  {
    id: 'badge_nature_explorer',
    title: 'Nature Explorer',
    desc: 'Solved Sky & Space and Safari levels',
    icon: '🚀',
    unlocked: false,
    targetCount: 2,
    currentCount: 0
  },
  {
    id: 'badge_rainbow_master',
    title: 'Rainbow Master',
    desc: 'Completed all vibrant color puzzles',
    icon: '🎨',
    unlocked: false,
    targetCount: 5,
    currentCount: 0
  },
  {
    id: 'badge_super_reader',
    title: 'Super Reader',
    desc: 'Mastered 5 full sentences',
    icon: '🏆',
    unlocked: false,
    targetCount: 5,
    currentCount: 0
  }
];

// Helper to generate a random 5x5 alphabet soup for Sandbox Explorer mode
export function generateRandomSoup(): string[][] {
  const commonKidLetters = 'AAAAABBCCDDDEEEEFFGGHHIIIIJKLLMMNNNOOOOOPPQRRSSSTTTTUUUVWYZ';
  const grid: string[][] = [];
  for (let r = 0; r < 5; r++) {
    const row: string[] = [];
    for (let c = 0; c < 5; c++) {
      const randChar = commonKidLetters[Math.floor(Math.random() * commonKidLetters.length)];
      row.push(randChar);
    }
    grid.push(row);
  }
  return grid;
}
