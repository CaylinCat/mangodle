'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { VALID_WORDS } from './validWords';

export default function SpellingBee() {
  const CENTER_LETTER = 'A';
  const [letters, setLetters] = useState(['M', 'N', 'G', 'O', 'S', 'T']);

  const [current, setCurrent] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);


  const RANKS = [
    { name: 'Beginner', threshold: 0 },
    { name: 'Good Start', threshold: 5 },
    { name: 'Moving Up', threshold: 15 },
    { name: 'Solid', threshold: 30 },
    { name: 'Great', threshold: 50 },
    { name: 'Amazing', threshold: 75 },
    { name: 'Genius', threshold: 110 },
  ];

  const calculateScore = () => {
    let score = 0;
    for (let word of foundWords) {
      if (word.length === 4) {
        score += 1;
      } else {
        score += word.length;
      }

      const uniqueLetters = new Set(word.toUpperCase());
      const allLetters = [...letters, CENTER_LETTER];
      if (allLetters.every((l) => uniqueLetters.has(l))) {
        score += 7;
      }
    }
    return score;
  };

  const getRank = (score: number) => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (score >= RANKS[i].threshold) return RANKS[i].name;
    }
    return 'Beginner';
  };

  const score = calculateScore();
  const rank = getRank(score);
  const maxThreshold = RANKS[RANKS.length - 1].threshold;
  const progress = Math.min((score / maxThreshold) * 100, 100);

  const currentRankIndex = RANKS
    .map((r) => r.threshold)
    .filter((threshold) => score >= threshold).length - 1;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();

      if (key === 'BACKSPACE') {
        handleUndo();
      } else if (key === 'ENTER') {
        handleSubmit();
      } else if (key.length === 1 && /[A-Z]/.test(key)) {
        const allLetters = [...letters, CENTER_LETTER];
        if (allLetters.includes(key)) {
          handleLetterClick(key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [letters, current, foundWords]);

  useEffect(() => {
    if (score >= RANKS[RANKS.length - 1].threshold && !showPopup) {
      setShowPopup(true);
    }
  }, [score]);

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
      <h1>Mango Bee</h1>

      <div className={styles.progressBarContainer}>
        <div className={styles.rankLabel}>
          {RANKS[currentRankIndex]?.name || ''}
        </div>

        <div className={styles.progressTrack}>
          {RANKS.map((r, index) => {
            const isActive = score >= r.threshold;
            const isCurrent = index === currentRankIndex;
            const leftPercent = (index / (RANKS.length - 1)) * 100;

            return (
              <div
                key={r.name}
                className={`${styles.progressStep}`}
                style={{ left: `${leftPercent}%`, position: 'absolute' }}
              >
                <div className={`${styles.dot} ${isActive ? styles.active : ''}`}>
                  {isCurrent ? score : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>


      <div className={styles.mainArea}>
        <div className={styles.leftPanel}>
          <div className={styles.currentWord}>
            {current}
            <span className={styles.caret}>|</span>
          </div>

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

          <div className={styles.actionsRow}>
            <button onClick={handleUndo} className={styles.actionButton}>Delete</button>
            <button onClick={shuffleLetters} className={styles.actionButton}>🔄</button>
            <button onClick={handleSubmit} className={styles.actionButton}>Submit</button>
          </div>

          <div className={styles.message}>{message}</div>
        </div>

        <div className={styles.rightPanel}>
          <h2>You have found {foundWords.length} words.</h2>
          <ul>
            {foundWords.map((word, i) => (
              <li key={i}>{word}</li>
            ))}
          </ul>
        </div>
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <button onClick={() => setShowPopup(false)} className={styles.exit}>X</button>
            <h2 className={styles.popupHeader}>Genius!</h2>
            <p>{new Date().toLocaleDateString()}</p>
            <img src="/mangobee.png" alt="Genius Mango" className={styles.popupImage} />
          </div>
        </div>
      )}

    </div>
  );
}