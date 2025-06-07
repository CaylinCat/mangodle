export interface PuzzleData {
  id: number;
  theme: string;
  grid: string[][];
  words: string[];
}

export const PUZZLES: PuzzleData[] = [
  {
    id: 1,
    theme: 'Wonderful Mangos',
    grid: [
    ['A', 'T', 'I', 'T', 'R', 'O'],
    ['N', 'X', 'O', 'C', 'I', 'P'],
    ['I', 'N', 'T', 'S', 'W', 'E'],
    ['D', 'A', 'M', 'A', 'T', 'E'],
    ['S', 'L', 'U', 'G', 'N', 'D'],
    ['E', 'D', 'F', 'O', 'C', 'E'],
    ['E', 'M', 'O', 'I', 'E', 'I'],
    ['S', 'O', 'T', 'H', 'S', 'L'],
    ],
    words: [
      'TROPIC',
      'SLICED',
      'SMOOTHIE',
      'ANTIOXIDANT',
      'SWEET',
      'SEED',
      'MANGOFUL',
    ],
  },
  {
    id: 2,
    theme: 'Delicious Mangos',
    grid: [
    ['M', 'A', 'N', 'J', 'U', 'I'],
    ['T', 'H', 'E', 'G', 'C', 'Y'],
    ['O', 'I', 'O', 'N', 'E', 'C'],
    ['O', 'M', 'S', 'L', 'A', 'T'],
    ['N', 'G', 'I', 'R', 'N', 'E'],
    ['I', 'E', 'R', 'C', 'E', 'P'],
    ['H', 'F', 'I', 'D', 'R', 'I'],
    ['S', 'E', 'R', 'O', 'U', 'S'],
    ],
    words: [
      'JUICY',
      'NECTAR',
      'RIPENED',
      'SMOOTHIE',
      'REFRESHING',
      'MANGOLICIOUS'
    ],
  },
];