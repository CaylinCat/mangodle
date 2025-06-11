'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { CROSSWORD_PUZZLES } from './answers';

const WIDTH = 5;
const HEIGHT = 5;

const puzzle = CROSSWORD_PUZZLES[Math.floor(Math.random() * CROSSWORD_PUZZLES.length)];

type Direction = 'across' | 'down' | null;
type Cell = {
  letter: string;
  number?: number;
  isActive: boolean;
};

function buildGrid(clues: typeof puzzle) {
  const grid: Cell[][] = Array.from({ length: HEIGHT }, () =>
    Array.from({ length: WIDTH }, () => ({ letter: '', isActive: false }))
  );

  const markClue = (clue: any, isAcross: boolean) => {
    for (let i = 0; i < clue.answer.length; i++) {
      const row = clue.row + (isAcross ? 0 : i);
      const col = clue.col + (isAcross ? i : 0);
      grid[row][col].isActive = true;
      grid[row][col].letter = clue.answer[i].toUpperCase();
      if (i === 0) grid[row][col].number = clue.number;
    }
  };

  clues.across.forEach(clue => markClue(clue, true));
  clues.down.forEach(clue => markClue(clue, false));

  return grid;
}

function findClueAtCell(clues: typeof puzzle, row: number, col: number, dir: Direction) {
  if (!dir) return null;
  const cluesArr = dir === 'across' ? clues.across : clues.down;
  for (const clue of cluesArr) {
    for (let i = 0; i < clue.answer.length; i++) {
      const r = clue.row + (dir === 'down' ? i : 0);
      const c = clue.col + (dir === 'across' ? i : 0);
      if (r === row && c === col) return clue;
    }
  }
  return null;
}

function getClueCells(clue: any, dir: Direction) {
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
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [correctCells, setCorrectCells] = useState(new Set());
  const [showDropdown, setShowDropdown] = useState(false);



  const grid = buildGrid(puzzle);

  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => null))
  );

  useEffect(() => {
    if (showWinPopup || paused) return;
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, [showWinPopup, paused]);

  function onCellClick(row: number, col: number) {
    if (!grid[row][col].isActive) return;

    if (selectedCell?.row === row && selectedCell?.col === col) {
      setHighlightDirection(prev => (prev === 'across' ? 'down' : 'across'));
    } else {
      setSelectedCell({ row, col });
    }

    setTimeout(() => {
      inputRefs.current[row][col]?.focus();
      inputRefs.current[row][col]?.select();
    }, 0);
  }

  function checkWin(inputsToCheck: string[][] = inputs) {
    for (let r = 0; r < HEIGHT; r++) {
      for (let c = 0; c < WIDTH; c++) {
        if (grid[r][c].isActive && inputsToCheck[r][c] !== grid[r][c].letter.toUpperCase()) {
          return false;
        }
      }
    }
    return true;
  }

  function handleChange(row: number, col: number, val: string) {
    if (correctCells.has(`${row},${col}`)) return;
    const letter = val.toUpperCase().slice(-1);
    if (!/^[A-Z]?$/.test(letter)) return;

    setInputs(prev => {
      const updated = prev.map(r => [...r]);
      updated[row][col] = letter;

      if (checkWin(updated)) {
        setShowWinPopup(true);
      }

      return updated;
    });

    const clue = findClueAtCell(puzzle, row, col, highlightDirection);
    if (!clue) return;
    const cells = getClueCells(clue, highlightDirection);
    const idx = cells.findIndex(([r, c]) => r === row && c === col);

    if (idx + 1 < cells.length) {
      const [nextR, nextC] = cells[idx + 1];
      setTimeout(() => {
        inputRefs.current[nextR][nextC]?.focus();
        inputRefs.current[nextR][nextC]?.select();
        setSelectedCell({ row: nextR, col: nextC });
      }, 0);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) {
    if (e.key === 'Tab') {
      e.preventDefault();
      setHighlightDirection(prev => (prev === 'across' ? 'down' : 'across'));
      return;
    }

    const clue = findClueAtCell(puzzle, row, col, highlightDirection);
    if (!clue) return;
    const cells = getClueCells(clue, highlightDirection);
    const idx = cells.findIndex(([r, c]) => r === row && c === col);

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (correctCells.has(`${row},${col}`)) return;
      if (inputs[row][col]) {
        setInputs(prev => {
          const updated = prev.map(r => [...r]);
          updated[row][col] = '';
          return updated;
        });
      } else if (idx > 0) {
        const [prevR, prevC] = cells[idx - 1];
        if (correctCells.has(`${prevR},${prevC}`)) return;
        setInputs(prev => {
          const updated = prev.map(r => [...r]);
          updated[prevR][prevC] = '';
          return updated;
        });
        setTimeout(() => inputRefs.current[prevR][prevC]?.focus(), 0);
        setSelectedCell({ row: prevR, col: prevC });
      }
    }
  }

  function isCellHighlighted(row: number, col: number) {
    if (!selectedCell) return { across: false, down: false };
    const clue = findClueAtCell(puzzle, selectedCell.row, selectedCell.col, highlightDirection);
    const cells = clue ? getClueCells(clue, highlightDirection) : [];
    const isHighlight = cells.some(([r, c]) => r === row && c === col);
    return { [highlightDirection!]: isHighlight };
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function isClueActive(dir: Direction, clueNumber: number) {
    if (!selectedCell || dir !== highlightDirection) return false;
    const clue = findClueAtCell(puzzle, selectedCell.row, selectedCell.col, dir);
    return clue?.number === clueNumber;
  }

  function markCorrect(row: any, col: any) {
    setCorrectCells(prev => new Set(prev).add(`${row},${col}`));
  }

  function getHighlightedWordCells() {
    const result: { row: number; col: number }[] = [];

    if (!selectedCell) return result;

    const { row, col } = selectedCell;
    const isAcross = highlightDirection === 'across';

    let startRow = row;
    let startCol = col;

    if (isAcross) {
      while (startCol > 0 && grid[row][startCol - 1].isActive) {
        startCol--;
      }
    } else {
      while (startRow > 0 && grid[startRow - 1][col].isActive) {
        startRow--;
      }
    }

    let currentRow = startRow;
    let currentCol = startCol;

    while (
      currentRow < HEIGHT &&
      currentCol < WIDTH &&
      grid[currentRow][currentCol].isActive
    ) {
      result.push({ row: currentRow, col: currentCol });

      if (isAcross) currentCol++;
      else currentRow++;
    }

    return result;
  }

  function handleCheckSquare() {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (inputs[row][col] === grid[row][col].letter) {
      markCorrect(row, col);
    }
  }

  function handleCheckWord() {
    const wordCells = getHighlightedWordCells();
    wordCells.forEach(({ row, col }) => {
      if (inputs[row][col] === grid[row][col].letter) {
        markCorrect(row, col);
      }
    });
  }

  function handleCheckPuzzle() {
    for (let r = 0; r < HEIGHT; r++) {
      for (let c = 0; c < WIDTH; c++) {
        if (inputs[r][c] === grid[r][c].letter) {
          markCorrect(r, c);
        }
      }
    }
  }

  const selectedClue =
    selectedCell && highlightDirection
      ? findClueAtCell(puzzle, selectedCell.row, selectedCell.col, highlightDirection)
      : null;

  const dateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.timerContainer}>
          <div className={styles.titleLine}>
            <span className={styles.title}>🥭The Mini Mango #{puzzle.id}</span>{' '}
            <span className={styles.date}>{dateString}</span>
          </div>
        <hr className={styles.divider} />
        <div className={styles.timerRow}>
          <div className={styles.centerGroup}>
            <div className={styles.timerText}>
              {formatTime(elapsed)}{' '}
            </div>
            <button
              className={styles.pauseButton}
              onClick={() => setPaused(!paused)}
              aria-label={paused ? "Resume timer" : "Pause timer"}
            >
              {paused ? '▶' : '⏸'}
            </button>
          </div>
           <div className={styles.checkDropdown}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={styles.checkButton}
            >
              Check
            </button>
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <div onClick={handleCheckSquare}>Square</div>
                <div onClick={handleCheckWord}>Word</div>
                <div onClick={handleCheckPuzzle}>Puzzle</div>
              </div>
            )}
          </div>
        </div>
        <hr className={styles.divider} />
      </div>

      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.selectedClue}>
            {selectedClue ? (
              <>
                <strong className={styles.cluePrefix}>
                  {selectedClue.number}
                  {highlightDirection === 'across' ? 'A' : 'D'}
                </strong>
                {selectedClue.clue}
              </>
            ) : (
              'Select a cell to see clue'
            )}
          </div>
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
                        className={`${styles.input} ${correctCells.has(`${r},${c}`) ? styles.correctLetter : ''}`}
                        ref={el => {
                          inputRefs.current[r][c] = el;
                        }}
                        type="text"
                        maxLength={1}
                        // className={styles.input}
                        value={inputs[r][c]}
                        onChange={e => handleChange(r, c, e.target.value)}
                        onKeyDown={e => handleKeyDown(e, r, c)}
                        pattern="[A-Za-z]"
                        autoComplete="off"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.cluesColumn}>
            <h3>Across</h3>
            <ul>
              {puzzle.across.map(clue => (
                <li
                  key={clue.number}
                  className={isClueActive('across', clue.number) ? styles.activeClue : ''}
                  onClick={() => {
                    setHighlightDirection('across');
                    setSelectedCell({ row: clue.row, col: clue.col });
                    setTimeout(() => {
                      inputRefs.current[clue.row][clue.col]?.focus();
                      inputRefs.current[clue.row][clue.col]?.select();
                    }, 0);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{clue.number}</strong>. {clue.clue}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.cluesColumn}>
            <h3>Down</h3>
            <ul>
              {puzzle.down.map(clue => (
                <li
                  key={clue.number}
                  className={isClueActive('down', clue.number) ? styles.activeClue : ''}
                  onClick={() => {
                    setHighlightDirection('down');
                    setSelectedCell({ row: clue.row, col: clue.col });
                    setTimeout(() => {
                      inputRefs.current[clue.row][clue.col]?.focus();
                      inputRefs.current[clue.row][clue.col]?.select();
                    }, 0);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{clue.number}</strong>. {clue.clue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showWinPopup && (
        <div className={styles.popupOverlay} onClick={() => setShowWinPopup(false)}>
          <div className={styles.popup} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥭</div>
            <h2>Congratulations!</h2>
            <p>You solved MiniMango #{puzzle.id} in {formatTime(elapsed)}.</p>
            <button
              className={styles.shareButton}
              onClick={() => {
                const shareText = `MiniMango 🥭\nSolved in ${formatTime(elapsed)}!`;
                navigator.clipboard.writeText(shareText);
                alert('Result copied to clipboard!');
              }}
            >
              Click to share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}