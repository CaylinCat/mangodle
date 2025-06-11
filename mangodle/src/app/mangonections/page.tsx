'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { PUZZLES } from './data';

const CATEGORY_COLORS: Record<number, string> = {
  0: '#FFD700',  // Yellow
  1: '#90EE90',  // Green
  2: '#ADD8E6',  // Blue
  3: '#D8BFD8',  // Purple
};

const COLOR_EMOJIS: Record<number, string> = {
  0: '🟨',
  1: '🟩',
  2: '🟦',
  3: '🟪',
};

const selectedPuzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
const ID = selectedPuzzle.id;
const solutionGroups = selectedPuzzle.groups;

export default function ConnectionsGame() {
  const [selected, setSelected] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<typeof solutionGroups>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [jumpIndex, setJumpIndex] = useState<number | null>(null);
  const [isShakingAll, setIsShakingAll] = useState(false);
  const MAX_MISTAKES = 4;
  const [mistakes, setMistakes] = useState(0);
  const [guessHistory, setGuessHistory] = useState<string[][]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [oneOffError, setOneOffError] = useState(false);


  const shuffledWords = solutionGroups
    .flatMap(g => g.words)
    .sort(() => Math.random() - 0.5);

  const [shuffled, setShuffled] = useState(() => shuffledWords);

  const remainingWords = shuffled.filter(
    word => !foundGroups.some(group => group.words.includes(word))
  );

  const toggleWord = (word: string) => {
    setSelected(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      } else if (prev.length < 4) {
        return [...prev, word];
      }
      return prev;
    });
  };

  const checkSelection = () => {
    if (selected.length !== 4) return;

    const group = solutionGroups.find(
      g => g.words.every(w => selected.includes(w))
    );

    setGuessHistory(prev => [...prev, selected]);

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
          const isOneOff = solutionGroups.some(g => {
            const inGroup = g.words.filter(w => selected.includes(w));
            return inGroup.length === 3;
          });
          setIsShakingAll(true);
          setTimeout(() => {
            setIsShakingAll(false);
            setFeedback(null);
            // setSelected([]);
            setJumpIndex(null);
            if (isOneOff) {
              setOneOffError(true);
              setTimeout(() => setOneOffError(false), 2000);
            }
          }, 600);
          setMistakes(prev => {
            const newCount = prev + 1;
            if (newCount >= MAX_MISTAKES) {
              setShowPopup(true);
            }
            return newCount;
          });
        } else if (feedback === 'correct') {
          const group = solutionGroups.find(
            g => g.words.every(w => selected.includes(w))
          );
          if (group && !foundGroups.includes(group)) {
            setFoundGroups(prev => {
              const newGroups = [...prev, group];
              if (newGroups.length === 4) {
                setShowPopup(true);
              }
              return newGroups;
            });
          }
          setFeedback(null);
          setSelected([]);
          setJumpIndex(null);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [jumpIndex, selected.length, feedback]);

  // const getWordColor = (word: string): string | null => {
  //   const index = foundGroups.findIndex(g => g.words.includes(word));
  //   return index !== -1 ? CATEGORY_COLORS[index] : null;
  // };

  const shuffleWords = () => {
    const remaining = shuffledWords.filter(
      word => !foundGroups.some(group => group.words.includes(word))
    );
    const newOrder = [...remaining].sort(() => Math.random() - 0.5);
    setShuffled(newOrder);
  };

  const renderEmojiGrid = () => {
    return guessHistory.map(guess => {
      return guess.map(word => {
        const groupIndex = solutionGroups.findIndex(g => g.words.includes(word));
        return groupIndex !== -1 ? COLOR_EMOJIS[groupIndex] : '⬜';
      }).join('');
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create four groups of four!</h1>

      <div className={styles.solvedArea}>
        {foundGroups.map(group => {
          const index = solutionGroups.findIndex(g => g.category === group.category);
          return (
            <div
              key={group.category}
              className={styles.solvedGroup}
              style={{ backgroundColor: CATEGORY_COLORS[index] }}
            >
              {group.category}
              <div className={styles.solvedText}>
                {group.words.join(', ')}
              </div>
            </div>
          );
        })}
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

      {oneOffError && (
        <div className={styles.errorMessage}>1 off!</div>
      )}

      <div className={styles.mistakes}>
        Mistakes Remaining: {'⚫️'.repeat(MAX_MISTAKES - mistakes)}
      </div>

      <div className={styles.buttonRow}>
        <button className={styles.utilityButton} onClick={shuffleWords}>
          Shuffle
        </button>
        <button className={styles.utilityButton} onClick={() => setSelected([])} disabled={selected.length === 0}>
          Deselect
        </button>
        <button className={styles.submitButton} onClick={checkSelection} disabled={selected.length !== 4}>
          Submit
        </button>
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button onClick={() => setShowPopup(false)} className={styles.exit}>X</button>
            <h2 className={styles.popupHeader}>{foundGroups.length === 4 ? 'Great!' : 'Next Time!'}</h2>
            <h3>Mangonections #{ID}</h3>
            <pre className={styles.emojiBox}>
              {renderEmojiGrid().join('\n')}
            </pre>
            <button
              onClick={() => {
                const text = `Mangonections #${ID}\n\n${renderEmojiGrid().join('\n')}`;
                navigator.clipboard.writeText(text);
                alert('Copied to clipboard!');
              }}
              className={styles.utilityButton}
            >
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}