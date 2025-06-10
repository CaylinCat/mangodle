export interface PuzzleGroup {
  category: string;
  words: string[];
}

export interface Puzzle {
  id: number;
  groups: PuzzleGroup[];
}

export const PUZZLES: Puzzle[] = [
  {
    id: 1,
    groups: [
      { category: 'Condiments', words: ['Mayo', 'Ketchup', 'Mustard', 'Relish'] },
      { category: 'Fruits', words: ['Mango', 'Guava', 'Papaya', 'Lychee'] },
      { category: 'Seafood', words: ['Shrimp', 'Tuna', 'Crab', 'Lobster'] },
      { category: 'Colors', words: ['Olive', 'Peach', 'Coral', 'Salmon'] },
    ],
  },
  {
    id: 2,
    groups: [
      { category: 'Mango Textures', words: ['Fibrous', 'Juicy', 'Soft', 'Firm'] },
      { category: 'Ugh not him again', words: ['Hard', 'Firm', 'Cold', 'Bitter'] },
      { category: 'Flavors', words: ['Sweet', 'Sour', 'Salty', 'Umami'] },
      { category: 'Too hot!', words: ['Burning', 'Hot', 'Roasting', 'Melting'] },
    ],
  },
  {
    id: 3,
    groups: [
      { category: 'Worldwide Friends', words: ['Friend', 'Amigo', 'Rafiki', '友達'] },
      { category: 'Types of Cheetos', words: ['Puffs', 'Crunchy', 'Bites', 'Fantastix'] },
      { category: 'People but singular', words: ['Human', 'Person', 'Figure', 'Individual'] },
      { category: '___go', words: ['Man', 'Flamin', 'Ami', 'Indi'] },
    ],
  },
];