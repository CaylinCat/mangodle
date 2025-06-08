'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

// Fixed category colors (yellow, green, blue, purple)
const CATEGORY_COLORS: Record<number, string> = {
  0: '#FFD700',
  1: '#90EE90',
  2: '#ADD8E6',
  3: '#D8BFD8',
};

// Example game data (no color inside)
const solutionGroups = [
  { category: 'Fruits', words: ['Apple', 'Banana', 'Pear', 'Peach'] },
  { category: 'Pets', words: ['Dog', 'Cat', 'Rabbit', 'Hamster'] },
  { category: 'Vehicles', words: ['Car', 'Bus', 'Bike', 'Train'] },
  { category: 'Genres', words: ['Jazz', 'Rock', 'Pop', 'HipHop'] },
];

const allWords = solutionGroups.flatMap(g => g.words).sort(() => Math.random() - 0.5);

export default function ConnectionsGame() {
  const [selected, setSelected] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<typeof solutionGroups>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  // Which word index is currently jumping
  const [jumpIndex, setJumpIndex] = useState<number | null>(null);
  // Whether all selected are shaking
  const [isShakingAll, setIsShakingAll] = useState(false);

  const toggleWord = (word: string) => {
    setSelected(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  };

  const checkSelection = () => {
    const group = solutionGroups.find(
      g => g.words.every(w => selected.includes(w)) && selected.length === 4
    );

    if (group && !foundGroups.includes(group)) {
      setFoundGroups([...foundGroups, group]);
      setFeedback('correct');
      setSelected([]);
    } else {
      setFeedback('incorrect');
      setJumpIndex(0);  // start jumping from first selected
      setIsShakingAll(false);
    }
  };

  // Sequence the jumps one by one, then shake all
  useEffect(() => {
    if (jumpIndex === null) return;

    if (jumpIndex < selected.length) {
      const timer = setTimeout(() => {
        setJumpIndex(jumpIndex + 1);
      }, 350); // duration of jump animation + small buffer
      return () => clearTimeout(timer);
    } else {
      // After last jump, start shaking all for 600ms, then clear
      setIsShakingAll(true);
      const timer = setTimeout(() => {
        setIsShakingAll(false);
        setFeedback(null);
        setSelected([]);
        setJumpIndex(null);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [jumpIndex, selected.length]);

  const getWordColor = (word: string): string | null => {
    const index = foundGroups.findIndex(g => g.words.includes(word));
    return index !== -1 ? CATEGORY_COLORS[index] : null;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Connections</h1>
      <div className={styles.grid}>
        {allWords.map((word, i) => {
          const isSelected = selected.includes(word);
          const color = getWordColor(word);

          // For jumping: word is jumping if index matches jumpIndex - 1 (because jumpIndex increments after jump)
          const isJumping = jumpIndex !== null && selected[jumpIndex] === word;
          // Shake all selected words together
          const isShaking = isShakingAll && isSelected;

          return (
            <button
              key={word}
              className={`
                ${styles.wordButton}
                ${isSelected ? styles.selected : ''}
                ${isJumping ? styles.jump : ''}
                ${isShaking ? styles.shakeIncorrect : ''}
                ${feedback === 'correct' ? styles.correct : ''}
              `}
              onClick={() => toggleWord(word)}
              style={{ backgroundColor: color || '' }}
              disabled={!!color}
            >
              {word}
            </button>
          );
        })}
      </div>
      <button
        className={styles.submitButton}
        onClick={checkSelection}
        disabled={selected.length !== 4}
      >
        Submit
      </button>
    </div>
  );
}