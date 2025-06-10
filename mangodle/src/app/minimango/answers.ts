export type Clue = {
  number: number;
  row: number;
  col: number;
  answer: string;
  clue: string;
};

export type Crossword = {
  across: Clue[];
  down: Clue[];
};

export const CROSSWORD_PUZZLES: Crossword[] = [
  {
    across: [
      { number: 1, row: 0, col: 0, answer: 'SHAME', clue: 'A painful feeling of guilt or disgrace' },
      { number: 2, row: 1, col: 0, answer: 'PECAN', clue: 'Nut often used in pies' },
      { number: 3, row: 2, col: 0, answer: 'AMEND', clue: 'To make changes for the better' },
      { number: 4, row: 3, col: 0, answer: 'CARGO', clue: 'Goods transported in bulk' },
      { number: 5, row: 4, col: 0, answer: 'ELBOW', clue: 'Joint between upper and lower arm' },
    ],
    down: [
      { number: 1, row: 0, col: 0, answer: 'SPACE', clue: 'The vast expanse beyond Earth' },
      { number: 6, row: 0, col: 1, answer: 'HEMAL', clue: 'Relating to blood' },
      { number: 7, row: 0, col: 2, answer: 'ACERB', clue: 'Sharp or sour in tone' },
      { number: 8, row: 0, col: 3, answer: 'MANGO', clue: 'Tropical fruit with orange flesh' },
      { number: 9, row: 0, col: 4, answer: 'ENDOW', clue: 'To provide with a talent or gift' },
    ],
  },
  {
    across: [
      { number: 1, row: 1, col: 0, answer: 'SALAD', clue: 'Leafy dish often served cold' },
      { number: 2, row: 2, col: 0, answer: 'ENEMY', clue: 'Opponent or adversary' },
      { number: 3, row: 3, col: 0, answer: 'AGREE', clue: 'To be of the same opinion' },
      { number: 4, row: 4, col: 0, answer: 'LOT', clue: 'A portion or section of land or items' },
      { number: 5, row: 0, col: 1, answer: 'MAN', clue: 'Adult male human' },
    ],
    down: [
      { number: 1, row: 1, col: 0, answer: 'SEAL', clue: 'Aquatic mammal or to close tightly' },
      { number: 5, row: 0, col: 1, answer: 'MANGO', clue: 'Sweet tropical fruit' },
      { number: 7, row: 0, col: 2, answer: 'ALERT', clue: 'Vigilant or ready to act' },
      { number: 8, row: 0, col: 3, answer: 'NAME', clue: 'Word by which someone is called' },
      { number: 9, row: 1, col: 4, answer: 'DYE', clue: 'Substance used to color fabric' },
    ],
  },
  {
    across: [
      { number: 1, row: 0, col: 2, answer: 'MAP', clue: 'Navigation aid' },
      { number: 2, row: 1, col: 0, answer: 'SHADE', clue: 'Relief from sunlight' },
      { number: 3, row: 2, col: 0, answer: 'PANDA', clue: 'Bamboo eating bear' },
      { number: 4, row: 3, col: 0, answer: 'ANGER', clue: '>:( feeling' },
      { number: 5, row: 4, col: 1, answer: 'GOD', clue: 'Oh my ___!' },
    ],
    down: [
      { number: 2, row: 1, col: 0, answer: 'SPA', clue: 'Place to relax and unwind' },
      { number: 6, row: 1, col: 1, answer: 'HANG', clue: 'Suspend from above' },
      { number: 1, row: 0, col: 2, answer: 'MANGO', clue: 'Yummy tropical orange' },
      { number: 8, row: 0, col: 3, answer: 'ADDED', clue: '+' },
      { number: 9, row: 0, col: 4, answer: 'PEAR', clue: 'Green fruit, shaped like a teardrop' },
    ]
  }
];
