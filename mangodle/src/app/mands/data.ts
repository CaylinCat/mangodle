export interface PuzzleData {
  id: number;
  grid: string[][];
  words: string[];
}

export const PUZZLES: PuzzleData[] = [
  {
    id: 1,
    grid: [
      ['A', 'T', 'I', 'S', 'S', 'E'],
      ['N', 'X', 'O', 'W', 'T', 'E'],
      ['I', 'N', 'T', 'E', 'E', 'D'],
      ['D', 'A', 'M', 'A', 'S', 'U'],
      ['T', 'L', 'U', 'G', 'N', 'O'],
      ['R', 'O', 'F', 'O', 'I', 'C'],
      ['P', 'I', 'D', 'E', 'L', 'D'],
      ['C', 'S', 'L', 'I', 'C', 'E'],
    ],
    words: [
      'TROPIC',
      'SLICED',
      'DELICOUS',
      'ANTIOXIDANT',
      'SWEET',
      'SEED',
      'MANGOFUL',
    ],
  },
  {
    id: 2,
    grid: [
      ['B', 'A', 'N', 'A', 'N', 'A'],
      ['T', 'W', 'I', 'S', 'T', 'Y'],
      ['P', 'E', 'E', 'L', 'S', 'R'],
      ['C', 'R', 'E', 'A', 'M', 'S'],
      ['H', 'O', 'T', 'P', 'O', 'T'],
      ['D', 'E', 'S', 'S', 'E', 'R'],
      ['S', 'N', 'A', 'C', 'K', 'S'],
      ['Y', 'U', 'M', 'M', 'Y', 'Y'],
    ],
    words: [
      'BANANA',
      'TWISTY',
      'PEELS',
      'CREAMS',
      'DESSERT',
      'SNACKS',
      'YUMMY',
    ],
  },
];