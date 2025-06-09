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
      { category: 'Fruits', words: ['Apple', 'Banana', 'Pear', 'Peach'] },
      { category: 'Pets', words: ['Dog', 'Cat', 'Rabbit', 'Hamster'] },
      { category: 'Vehicles', words: ['Car', 'Bus', 'Bike', 'Train'] },
      { category: 'Genres', words: ['Jazz', 'Rock', 'Pop', 'HipHop'] },
    ],
  },
  {
    id: 2,
    groups: [
      { category: 'Colors', words: ['Red', 'Blue', 'Green', 'Yellow'] },
      { category: 'Animals', words: ['Lion', 'Tiger', 'Bear', 'Wolf'] },
      { category: 'Cities', words: ['Paris', 'Tokyo', 'Rome', 'London'] },
      { category: 'Sports', words: ['Soccer', 'Tennis', 'Baseball', 'Golf'] },
    ],
  },
];