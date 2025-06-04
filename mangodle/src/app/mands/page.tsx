'use client';

import { useState } from 'react';
import styles from './page.module.css';

const GRID = [
  ['m', 'a', 'n', 'g', 'o', 'l', 'i', 'c'],
  ['r', 'a', 'f', 'r', 'e', 's', 'h', 'i'],
  ['c', 'n', 'o', 'p', 'i', 'c', 'a', 'l'],
  ['y', 'i', 'o', 'o', 't', 'h', 'i', 'e'],
  ['j', 'u', 'i', 'c', 'y', 'x', 'x', 'x'],
  ['n', 'e', 'c', 't', 'a', 'r', 'x', 'x'],
  ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
  ['x', 'x', 'x', 'x', 'x', 'x', 'x', 's'],
];

const WORDS = [
  'JUICY',
  'NECTAR',
  'TROPICAL',
  'SMOOTHIE',
  'REFRESHING',
  'MANGOLICIOUS', // spangram
];

export default function MangoStrands() {
  const [selected, setSelected] = useState<{ row: number; col: number }[]>([]);
  const [foundPaths, setFoundPaths] = useState<{ word: string; path: { row: number; col: number }[] }[]>([]);
  const [currentSelection, setCurrentSelection] = useState('');
  const [lastResult, setLastResult] = useState<'valid' | 'invalid' | null>(null);

  const handleMouseDown = (row: number, col: number) => {
    setSelected([{ row, col }]);
    setCurrentSelection(GRID[row][col].toUpperCase());
    setLastResult(null);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!selected.length) return;

    const last = selected[selected.length - 1];
    const isAdjacent =
      Math.abs(last.row - row) <= 1 &&
      Math.abs(last.col - col) <= 1 &&
      !(last.row === row && last.col === col);

    const alreadyIncluded = selected.some(p => p.row === row && p.col === col);

    if (isAdjacent && !alreadyIncluded) {
      const newSelection = [...selected, { row, col }];
      setSelected(newSelection);
      const newWord = newSelection.map(({ row, col }) => GRID[row][col]).join('').toUpperCase();
      setCurrentSelection(newWord);
    }
  };

  const handleMouseUp = () => {
    const word = selected.map(({ row, col }) => GRID[row][col]).join('').toUpperCase();

    if (WORDS.includes(word)) {
      setFoundPaths(prev => [...prev, { word, path: selected }]);
      setLastResult('valid');
      setTimeout(() => {
        setCurrentSelection('');
        setLastResult(null);
      }, 1000);
    } else {
      setLastResult('invalid');
    }

    setSelected([]);
  };

  const isInPath = (row: number, col: number, path: { row: number; col: number }[]) =>
    path.some(p => p.row === row && p.col === col);

  const getCellStyle = (row: number, col: number) => {
    const inSelected = selected.some(p => p.row === row && p.col === col);
    const found = foundPaths.find(({ path }) => isInPath(row, col, path));

    if (found) {
      return found.word === 'MANGOLICIOUS' ? styles.foundSpanagram : styles.found;
    }

    if (inSelected) return styles.selected;

    return '';
  };

  return (
    <div className={styles.container} onMouseUp={handleMouseUp}>
      <div className={styles.leftPanel}>
        <div className={styles.themeBox}>
          <div className={styles.themeTitle}>Today's Theme</div>
          <div className={styles.theme}>Mangos</div>
          <div className={styles.progress}>
            {foundPaths.length} of {WORDS.length} theme words found.
          </div>
          <button className={styles.hintButton}>Hint</button>
        </div>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.preview}>
          {currentSelection && lastResult === null && (
            <span>{currentSelection}</span>
          )}
          {lastResult === 'valid' && (
            <span className={styles.validWord}>{currentSelection}</span>
          )}
          {lastResult === 'invalid' && (
            <span className={styles.invalidWord}>Not a Valid Word</span>
          )}
        </div>

        <div className={styles.grid}>
          {GRID.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.gridRow}>
              {row.map((letter, colIndex) => (
                <div
                  key={colIndex}
                  className={`${styles.cell} ${getCellStyle(rowIndex, colIndex)}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={(e) => e.buttons === 1 && handleMouseEnter(rowIndex, colIndex)}
                >
                  {letter}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
