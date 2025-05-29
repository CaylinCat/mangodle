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
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [animatingRow, setAnimatingRow] = useState<number | null>(null);


  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (guesses.length >= 6) return;

      if (e.key === 'Enter') {
        if (currentGuess.length === ANSWER.length) {
          const newGuess = currentGuess.toUpperCase();
          setGuesses((prev) => [...prev, newGuess]);
          setCurrentGuess('');
          setAnimatingRow(guesses.length);
          setTimeout(() => {
            setAnimatingRow(null);
          }, 600 * ANSWER.length); 
        }
      } else if (e.key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentGuess.length < ANSWER.length) {
          setCurrentGuess((prev) => prev + e.key.toUpperCase());
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses]);

  const renderTile = (letter: string, i: number, guessIndex: number) => {
    let className = styles.tile;

    if (guessIndex < guesses.length) {
      if (letter === ANSWER[i]) className += ` ${styles.correct}`;
      else if (ANSWER.includes(letter)) className += ` ${styles.close}`;
      else className += ` ${styles.wrong}`;
    }

    const isFlipping = animatingRow === guessIndex;
    const style = isFlipping ? { animationDelay: `${i * 0.15}s` } : undefined;

    return (
      <div
        key={i}
        className={`${className} ${isFlipping ? styles.flip : ''}`}
        style={style}
      >
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

  const emptyRows = 6 - guesses.length - 1;

  const getKeyColor = (letter: string) => {
    let hasCorrect = false;
    let hasClose = false;
    let hasWrong = false;

    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        const char = guess[i];
        if (char !== letter) continue;

        if (char === ANSWER[i]) hasCorrect = true;
        else if (ANSWER.includes(char)) hasClose = true;
        else hasWrong = true;
      }
    }

    if (hasCorrect) return styles.correct;
    if (hasClose) return styles.close;
    if (hasWrong) return styles.wrong;

    return '';
  };


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🥭 MANGODLE 🥭</h1>

      <div className={styles.board}>
        {guesses.map((guess, i) => renderRow(guess, i))}
        {guesses.length < 6 && renderRow(currentGuess, guesses.length)}
        {[...Array(emptyRows > 0 ? emptyRows : 0)].map((_, i) =>
          renderRow('', guesses.length + 1 + i)
        )}
      </div>

      <div className={styles.status}>
        {guesses.includes(ANSWER)
          ? 'You Win! 🎉'
          : guesses.length >= 6
          ? `Womp womp :( The answer was ${ANSWER}`
          : 'Type letters and press Enter to submit'}
      </div>

      {/*digital keyboard*/}
      <div className={styles.keyboard}>
        {ROWS.map((row, i) => (
          <div key={i} className={styles.keyboardRow}>
            {row.map((letter) => (
              <div key={letter} className={`${styles.key} ${getKeyColor(letter)}`}>
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}