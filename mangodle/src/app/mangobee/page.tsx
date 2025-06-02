'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { VALID_WORDS } from './validWords';

export default function SpellingBee() {
  const CENTER_LETTER = 'A';
  const [letters, setLetters] = useState(['M', 'N', 'G', 'O', 'S', 'B']);

  const [current, setCurrent] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const handleLetterClick = (letter: string) => {
    setCurrent(current + letter);
    setMessage('');
  };

  const handleUndo = () => {
    setCurrent((prev) => prev.slice(0, -1));
  };

  const shuffleLetters = () => {
    const shuffled = [...letters];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setLetters(shuffled);
  };


  const handleSubmit = () => {
    const word = current.toLowerCase();
    if (word.length < 4) {
      setMessage('Too short!');
    } else if (!word.includes(CENTER_LETTER.toLowerCase())) {
      setMessage(`Must include "${CENTER_LETTER}"`);
    } else if (!VALID_WORDS.includes(word)) {
      setMessage('Not in word list');
    } else if (foundWords.includes(word)) {
      setMessage('Already found!');
    } else {
      setFoundWords([...foundWords, word]);
      setMessage('✅ Good!');
    }
    setCurrent('');
  };

  return (
    <div className={styles.container}>
      <h1>Spelling Bee</h1>

      <div className={styles.lettersWrapper}>
      {letters.concat(CENTER_LETTER).map((letter, i) => {
        if (letter === CENTER_LETTER) {
          return (
            <button
              key={letter}
              className={`${styles.letterCircle} ${styles.centerLetter}`}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </button>
          );
        } else {
          const outerLetters = letters;
          const index = outerLetters.indexOf(letter);
          const numOuterLetters = outerLetters.length;
          const angle = (index / numOuterLetters) * 2 * Math.PI - Math.PI / 2;
          const radius = 100;
          const x = 130 + radius * Math.cos(angle);
          const y = 130 + radius * Math.sin(angle);

          return (
            <button
              key={`${letter}-${i}`}
              className={styles.letterCircle}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </button>
          );
        }
      })}
    </div>


      <div className={styles.currentWord}>{current}</div>

      <div className={styles.actionsRow}>
        <button onClick={handleUndo} className={styles.actionButton}>Delete</button>
        <button onClick={shuffleLetters} className={styles.actionButton}>↻🔄</button>
        <button onClick={handleSubmit} className={styles.actionButton}>Submit</button>
      </div>

      <div className={styles.message}>{message}</div>

      <div className={styles.found}>
        <h2>Found Words ({foundWords.length}):</h2>
        <ul>
          {foundWords.map((word, i) => (
            <li key={i}>{word}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}