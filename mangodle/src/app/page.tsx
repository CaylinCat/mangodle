'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

const ANSWER = 'MANGO';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export default function Wordle() {
  const [guesses, setGuesses] = useState<string[]>([]); // past guesses
  const [currentGuess, setCurrentGuess] = useState(''); // what user is typing now
  const [isSubmitted, setIsSubmitted] = useState(false); // to track when to show colors

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (guesses.length >= 6) return; // max 6 guesses

      if (e.key === 'Enter') {
        if (currentGuess.length === ANSWER.length) {
          setGuesses((prev) => [...prev, currentGuess.toUpperCase()]);
          setCurrentGuess('');
          setIsSubmitted(true);
        }
      } else if (e.key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentGuess.length < ANSWER.length) {
          setCurrentGuess((prev) => prev + e.key.toUpperCase());
          setIsSubmitted(false);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses]);

  const renderTile = (letter: string, i: number, guessIndex: number) => {
    let className = styles.tile;

    if (isSubmitted && guessIndex < guesses.length) {
      // Show colors only after submitting the guess
      if (letter === ANSWER[i]) className += ` ${styles.correct}`;
      else if (ANSWER.includes(letter)) className += ` ${styles.close}`;
      else className += ` ${styles.wrong}`;
    }

    return (
      <div key={i} className={className}>
        {letter}
      </div>
    );
  };

  const renderRow = (guess: string, guessIndex: number) => {
    const letters = guess.split('');
    while (letters.length < ANSWER.length) {
      letters.push('');
    }

    return (
      <div key={guessIndex} className={styles.row}>
        {letters.map((letter, i) => renderTile(letter, i, guessIndex))}
      </div>
    );
  };

  // Calculate empty rows to keep total rows to 6
  const emptyRows = 6 - guesses.length - 1;

  // Helper to get color class for a key based on guesses (only after submit)
  const getKeyColor = (letter: string) => {
    if (!isSubmitted) return '';
    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        const char = guess[i];
        if (char !== letter) continue;
        if (char === ANSWER[i]) return styles.correct;
        if (ANSWER.includes(char)) return styles.close;
      }
    }
    return '';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>MANGO Wordle</h1>

      <div className={styles.board}>
        {/* Past guesses */}
        {guesses.map((guess, i) => renderRow(guess, i))}

        {/* Current guess (unsubmitted) */}
        {guesses.length < 6 && renderRow(currentGuess, guesses.length)}

        {/* Empty rows */}
        {[...Array(emptyRows > 0 ? emptyRows : 0)].map((_, i) =>
          renderRow('', guesses.length + 1 + i)
        )}
      </div>

      <div className={styles.status}>
        {guesses.includes(ANSWER)
          ? 'You Win! 🎉'
          : guesses.length >= 6
          ? `Game Over! The answer was ${ANSWER}`
          : 'Type letters and press Enter to submit'}
      </div>

      {/* Keyboard */}
      <div className={styles.keyboard}>
        {ROWS.map((row, i) => (
          <div key={i} className={styles.keyboardRow}>
            {row.map((letter) => (
              <div
                key={letter}
                className={`${styles.key} ${getKeyColor(letter)}`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}