'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

const CATEGORY_COLORS: Record<number, string> = {
  0: '#FFD700',
  1: '#90EE90',
  2: '#ADD8E6',
  3: '#D8BFD8',
};

const solutionGroups = [
  { category: 'Fruits', words: ['Apple', 'Banana', 'Pear', 'Peach'] },
  { category: 'Pets', words: ['Dog', 'Cat', 'Rabbit', 'Hamster'] },
  { category: 'Vehicles', words: ['Car', 'Bus', 'Bike', 'Train'] },
  { category: 'Genres', words: ['Jazz', 'Rock', 'Pop', 'HipHop'] },
];

const shuffledWords = solutionGroups
  .flatMap(g => g.words)
  .sort(() => Math.random() - 0.5);

export default function ConnectionsGame() {
  const [selected, setSelected] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<typeof solutionGroups>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [jumpIndex, setJumpIndex] = useState<number | null>(null);
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
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setJumpIndex(0);
    setIsShakingAll(false);
  };

  useEffect(() => {
    if (jumpIndex === null) return;

    if (jumpIndex < selected.length) {
      const timer = setTimeout(() => {
        setJumpIndex(jumpIndex + 1);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        if (feedback === 'incorrect') {
          setIsShakingAll(true);
          setTimeout(() => {
            setIsShakingAll(false);
            setFeedback(null);
            setSelected([]);
            setJumpIndex(null);
          }, 600);
        } else if (feedback === 'correct') {
          const group = solutionGroups.find(
            g => g.words.every(w => selected.includes(w))
          );
          if (group && !foundGroups.includes(group)) {
            setFoundGroups(prev => [...prev, group]);
          }
          setFeedback(null);
          setSelected([]);
          setJumpIndex(null);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [jumpIndex, selected.length, feedback]);

  const getWordColor = (word: string): string | null => {
    const index = foundGroups.findIndex(g => g.words.includes(word));
    return index !== -1 ? CATEGORY_COLORS[index] : null;
  };

  const remainingWords = shuffledWords.filter(
    word => !foundGroups.some(group => group.words.includes(word))
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Connections</h1>

      <div className={styles.solvedArea}>
        {foundGroups.map((group, i) => (
          <div
            key={group.category}
            className={styles.solvedGroup}
            style={{ backgroundColor: CATEGORY_COLORS[i] }}
          >
            {group.category}
            <div className={styles.solvedText}>
              {group.words.join(', ')}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {remainingWords.map(word => {
          const isSelected = selected.includes(word);
          const isJumping = jumpIndex !== null && selected[jumpIndex] === word;
          const isShaking = isShakingAll && isSelected;

          return (
            <button
              key={word}
              className={`
                ${styles.wordButton}
                ${isSelected ? styles.selected : ''}
                ${isJumping ? styles.jump : ''}
                ${isShaking ? styles.shakeIncorrect : ''}
              `}
              onClick={() => toggleWord(word)}
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