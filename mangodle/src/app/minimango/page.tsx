'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { CROSSWORD_PUZZLES } from './answers';

const WIDTH = 5;
const HEIGHT = 5;

type Direction = 'across' | 'down' | null;
type Cell = {
  letter: string;
  number?: number;
  isActive: boolean;
};

// Choose random puzzle on load
const puzzle = CROSSWORD_PUZZLES[Math.floor(Math.random() * CROSSWORD_PUZZLES.length)];

function buildGrid(clues: typeof puzzle) {
  const grid: Cell[][] = Array.from({ length: HEIGHT }, () =>
    Array.from({ length: WIDTH }, () => ({ letter: '', isActive: false }))
  );

  const markClue = (clue: any, isAcross: boolean) => {
    for (let i = 0; i < clue.answer.length; i++) {
      const row = clue.row + (isAcross ? 0 : i);
      const col = clue.col + (isAcross ? i : 0);
      grid[row][col].isActive = true;
      if (i === 0) grid[row][col].number = clue.number;
    }
  };

  clues.across.forEach(clue => markClue(clue, true));
  clues.down.forEach(clue => markClue(clue, false));

  return grid;
}

// Find clue at given cell and direction
function findClueAtCell(clues: typeof puzzle, row: number, col: number, dir: Direction) {
  if (!dir) return null;
  const cluesArr = dir === 'across' ? clues.across : clues.down;
  for (const clue of cluesArr) {
    const len = clue.answer.length;
    for (let i = 0; i < len; i++) {
      const r = clue.row + (dir === 'down' ? i : 0);
      const c = clue.col + (dir === 'across' ? i : 0);
      if (r === row && c === col) {
        return clue;
      }
    }
  }
  return null;
}

// Get all cells coordinates for a clue and direction
function getClueCells(clue: any, dir: Direction) {
  if (!dir) return [];
  const cells = [];
  for (let i = 0; i < clue.answer.length; i++) {
    const r = clue.row + (dir === 'down' ? i : 0);
    const c = clue.col + (dir === 'across' ? i : 0);
    cells.push([r, c]);
  }
  return cells;
}

export default function Page() {
  const [inputs, setInputs] = useState<string[][]>(
    Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => ''))
  );
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [highlightDirection, setHighlightDirection] = useState<Direction>('across');

  const grid = buildGrid(puzzle);

  // Toggle highlight direction if same cell clicked
  function onCellClick(row: number, col: number) {
    if (!grid[row][col].isActive) return; // ignore blocked cells

    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      // toggle direction
      setHighlightDirection(prev => (prev === 'across' ? 'down' : 'across'));
    } else {
      setSelectedCell({ row, col });
      setHighlightDirection('across'); // default to across on new cell
    }
  }

  // Handle typing: fills letters in the current word's direction starting from selected cell
  function handleChange(row: number, col: number, val: string) {
    if (!selectedCell) return;
    const letter = val.toUpperCase().slice(-1);
    if (!letter.match(/[A-Z]/)) return;

    const clue = findClueAtCell(puzzle, selectedCell.row, selectedCell.col, highlightDirection);
    if (!clue) return;

    // Get all clue cells
    const cells = getClueCells(clue, highlightDirection);

    // Find index of current cell in clue cells
    const idx = cells.findIndex(([r, c]) => r === row && c === col);
    if (idx === -1) return;

    setInputs(prev => {
      const copy = prev.map(r => [...r]);
      copy[row][col] = letter;

      // Move to next cell in direction if possible
      if (idx + 1 < cells.length) {
        const [nextR, nextC] = cells[idx + 1];
        // We can simulate focusing next input by storing selectedCell as next cell (optional)
        // For now we just update selectedCell and inputs
        setSelectedCell({ row: nextR, col: nextC });
      }
      return copy;
    });
  }

  // Determine if cell is highlighted for across/down highlight
  function isCellHighlighted(row: number, col: number) {
    if (!selectedCell) return { across: false, down: false };

    const acrossClue = findClueAtCell(puzzle, selectedCell.row, selectedCell.col, 'across');
    const downClue = findClueAtCell(puzzle, selectedCell.row, selectedCell.col, 'down');

    const highlightAcrossCells = acrossClue ? getClueCells(acrossClue, 'across') : [];
    const highlightDownCells = downClue ? getClueCells(downClue, 'down') : [];

    const isAcrossHighlight =
      highlightDirection === 'across' && highlightAcrossCells.some(([r, c]) => r === row && c === col);
    const isDownHighlight =
      highlightDirection === 'down' && highlightDownCells.some(([r, c]) => r === row && c === col);

    return { across: isAcrossHighlight, down: isDownHighlight };
  }

  // Check if clue is active to highlight clue text
  function isClueActive(dir: Direction, clueNumber: number) {
    if (!selectedCell) return false;
    if (dir !== highlightDirection) return false;

    const clue = findClueAtCell(puzzle, selectedCell.row, selectedCell.col, dir);
    if (!clue) return false;
    return clue.number === clueNumber;
  }

  return (
    <div className={styles.wrapper}>
      <h1>Mango Mini Crossword 🥭</h1>
      <div className={styles.container}>
        <div className={styles.grid}>
          {grid.map((rowArr, r) =>
            rowArr.map((cell, c) => {
              const { across, down } = isCellHighlighted(r, c);
              const highlightClass = across
                ? styles['highlighted-across']
                : down
                ? styles['highlighted-down']
                : '';

              return (
                <div
                  key={`${r}-${c}`}
                  className={`${styles.cell} ${!cell.isActive ? styles.blocked : ''} ${highlightClass}`}
                  onClick={() => onCellClick(r, c)}
                >
                  {cell.number && <div className={styles.number}>{cell.number}</div>}
                  {cell.isActive && (
                    <input
                      type="text"
                      maxLength={1}
                      className={styles.input}
                      value={inputs[r][c]}
                      onChange={e => handleChange(r, c, e.target.value)}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className={styles.clues}>
          <div>
            <h3 className={styles.sectionTitle}>Across</h3>
            <ul className={styles.listitem}>
              {puzzle.across.map(clue => (
                <li key={clue.number} className={isClueActive('across', clue.number) ? styles.activeClue : ''}>
                  <strong>{clue.number}</strong>. {clue.clue}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Down</h3>
            <ul className={styles.listitem}>
              {puzzle.down.map(clue => (
                <li key={clue.number} className={isClueActive('down', clue.number) ? styles.activeClue : ''}>
                  <strong>{clue.number}</strong>. {clue.clue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}