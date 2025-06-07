'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const GRID = [
    ['A', 'T', 'I', 'S', 'S', 'E'],
    ['N', 'X', 'O', 'W', 'T', 'E'],
    ['I', 'N', 'T', 'E', 'E', 'D'],
    ['D', 'A', 'M', 'A', 'S', 'U'],
    ['T', 'L', 'U', 'G', 'N', 'O'],
    ['R', 'O', 'F', 'O', 'I', 'C'],
    ['P', 'I', 'D', 'E', 'L', 'D'],
    ['C', 'S', 'L', 'I', 'C', 'E'],
];

const WORDS = [
    'TROPIC',
    'SLICED',
    'DELICOUS',
    'ANTIOXIDANT',
    'SWEET',
    'SEED',
    'MANGOFUL', // spangram
];

export default function MangoStrands() {
    const [selected, setSelected] = useState<{ row: number; col: number }[]>([]);
    const [foundPaths, setFoundPaths] = useState<{ word: string; path: { row: number; col: number }[] }[]>([]);
    const [currentSelection, setCurrentSelection] = useState('');
    const [lastResult, setLastResult] = useState<'valid' | 'invalid' | null>(null);
    const [hintedPath, setHintedPath] = useState<{ row: number; col: number }[] | null>(null);

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

    const handleHintClick = () => {
        const foundWordsSet = new Set(foundPaths.map(fp => fp.word));
        const notFoundWord = WORDS.find(w => !foundWordsSet.has(w));

        if (!notFoundWord) {
            setHintedPath(null);
            return;
        }

        const path = findWordPath(notFoundWord);
        if (path) setHintedPath(path);
    };

    const isInPath = (row: number, col: number, path: { row: number; col: number }[]) =>
        path.some(p => p.row === row && p.col === col);

    const getCellStyle = (row: number, col: number) => {
        const inSelected = selected.some(p => p.row === row && p.col === col);
        const found = foundPaths.find(({ path }) => isInPath(row, col, path));
        const isHint = hintedPath && isInPath(row, col, hintedPath);

        // if (inSelected && isHint) return `${styles.selected} ${styles.hinted}`;
        if (inSelected) return styles.selected;
        if (isHint) return styles.hinted;

        if (found) {
            return found.word === 'MANGOFUL' ? styles.foundSpanagram : styles.found;
        }

        if (inSelected) return styles.selected;

        return '';
    };

    const cellSize = 40;
    const gapX = 10; //horizontal gap between cells
    const gapY = 10; //vertical gap between cells
    const cellCenterOffset = cellSize / 2;
    const svgWidth = GRID[0].length * cellSize + (GRID[0].length - 1) * gapX;
    const svgHeight = GRID.length * cellSize + (GRID.length - 1) * gapY;


    const renderLines = (path: any[], animate: boolean, isSpanagram = false) => {
        if (path.length < 2) return null;

        return path.slice(1).map((pos, i) => {
            const from = path[i];
            const to = pos;

            const x1 = from.col * (cellSize + gapX) + cellCenterOffset;
            const y1 = from.row * (cellSize + gapY) + cellCenterOffset;
            const x2 = to.col * (cellSize + gapX) + cellCenterOffset;
            const y2 = to.row * (cellSize + gapY) + cellCenterOffset;

            return (
            <line
                key={`${from.row}-${from.col}-${to.row}-${to.col}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={isSpanagram ? styles.spanagramLine : (animate ? styles.animatedLine : styles.staticLine)}
            />
            );
        });
    };

    useEffect(() => {
        if (!hintedPath) return;

        const hintedWordFound = foundPaths.some(({ path }) =>
            hintedPath.every(p1 => path.some(p2 => p1.row === p2.row && p1.col === p2.col))
        );

        if (hintedWordFound) {
            setHintedPath(null);
        }
    }, [foundPaths, hintedPath]);

    return (
        <div className={styles.container} onMouseUp={handleMouseUp}>

            <div className={styles.leftPanel}>
                <div className={styles.themeBox}>
                    <div className={styles.themeTitle}>Today's Theme</div>
                    <div className={styles.theme}>Mangos</div>
                    <div className={styles.progress}>
                        {foundPaths.length} of {WORDS.length} theme words found.
                    </div>
                    <button className={styles.hintButton} onClick={handleHintClick}>Hint</button>
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

                <div className={styles.grid} style={{ position: 'relative', width: cellSize * GRID[0].length, height: cellSize * GRID.length }}>
                    {/* SVG overlay for tracing lines */}
                    <svg
                        className={styles.svgOverlay}
                        // width={cellSize * GRID[0].length}
                        // height={cellSize * GRID.length}
                        width={svgWidth}
                        height={svgHeight}
                    >
                        {/* Lines for current selection (animated) */}
                        {renderLines(selected, true)}

                        {/* Lines for found words (static) */}
                        {foundPaths.map(({ word, path }, i) => (
                        <g key={`found-${i}`}>
                            {renderLines(path, false, word === 'MANGOFUL')} 
                        </g>
                        ))}
                    </svg>

                    {/* Grid cells */}
                    {GRID.map((row, rowIndex) => (
                        <div key={rowIndex} className={styles.gridRow}>
                            {row.map((letter, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`${styles.cell} ${getCellStyle(rowIndex, colIndex)}`}
                                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                    onMouseEnter={(e) => e.buttons === 1 && handleMouseEnter(rowIndex, colIndex)}
                                    style={{ width: cellSize, height: cellSize }}
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

function findWordPath(word: string): { row: number; col: number }[] | null {
  const upperWord = word.toUpperCase();
  const rows = GRID.length;
  const cols = GRID[0].length;

  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  const directions = [
    { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
    { dr: 0, dc: -1 },                  { dr: 0, dc: 1 },
    { dr: 1, dc: -1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 },
  ];

  function dfs(r: number, c: number, index: number, path: { row: number; col: number }[]): boolean {
    if (index === upperWord.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (visited[r][c]) return false;
    if (GRID[r][c] !== upperWord[index]) return false;

    visited[r][c] = true;
    path.push({ row: r, col: c });

    for (const { dr, dc } of directions) {
      if (dfs(r + dr, c + dc, index + 1, path)) return true;
    }

    visited[r][c] = false;
    path.pop();
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const path: { row: number; col: number }[] = [];
      visited.forEach(row => row.fill(false));
      if (dfs(r, c, 0, path)) return path;
    }
  }

  return null;
}