import React, { useRef, useState, useEffect, useCallback } from 'react';
import { kidAudio } from '../utils/audio';

export interface GridCell {
  id: string;
  letter: string;
  row: number;
  col: number;
}

interface AlphabetCanvasProps {
  boardLetters: string[][];
  activeWord: string;
  onLetterChainChange: (chain: GridCell[]) => void;
  onSubmitWord: (chain: GridCell[]) => void;
  hintCellId: string | null;
  foundCellIds?: Set<string>;
}

export const AlphabetCanvas: React.FC<AlphabetCanvasProps> = ({
  boardLetters,
  onLetterChainChange,
  onSubmitWord,
  hintCellId,
  foundCellIds = new Set()
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedChain, setSelectedChain] = useState<GridCell[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number; radius: number }>>(new Map());

  // Flatten grid
  const cells: GridCell[] = [];
  boardLetters.forEach((row, rIdx) => {
    row.forEach((letter, cIdx) => {
      cells.push({
        id: `cell_${rIdx}_${cIdx}`,
        letter,
        row: rIdx,
        col: cIdx
      });
    });
  });

  // Calculate pixel centers of each cell relative to container
  const updateNodePositions = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newPositions = new Map<string, { x: number; y: number; radius: number }>();

    cells.forEach(cell => {
      const el = document.getElementById(cell.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        newPositions.set(cell.id, {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
          radius: rect.width / 2
        });
      }
    });

    setNodePositions(newPositions);
  }, [boardLetters.length]);

  useEffect(() => {
    updateNodePositions();
    const handleResize = () => updateNodePositions();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [updateNodePositions]);

  // Check if two cells are adjacent (including diagonal)
  const isAdjacent = (cellA: GridCell, cellB: GridCell) => {
    const dr = Math.abs(cellA.row - cellB.row);
    const dc = Math.abs(cellA.col - cellB.col);
    return dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0);
  };

  // Find cell at client coordinates
  const findCellAtCoord = (clientX: number, clientY: number): GridCell | null => {
    if (!containerRef.current) return null;
    const containerRect = containerRef.current.getBoundingClientRect();
    const localX = clientX - containerRect.left;
    const localY = clientY - containerRect.top;

    for (const cell of cells) {
      const pos = nodePositions.get(cell.id);
      if (pos) {
        const distSq = (localX - pos.x) ** 2 + (localY - pos.y) ** 2;
        if (distSq <= (pos.radius * 1.15) ** 2) {
          return cell;
        }
      }
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    containerRef.current.setPointerCapture(e.pointerId);

    const hit = findCellAtCoord(e.clientX, e.clientY);
    if (hit) {
      setIsDragging(true);
      const newChain = [hit];
      setSelectedChain(newChain);
      onLetterChainChange(newChain);
      kidAudio.playLetterTone(0);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const localX = e.clientX - containerRect.left;
    const localY = e.clientY - containerRect.top;

    if (isDragging) {
      setPointerPos({ x: localX, y: localY });
      const hit = findCellAtCoord(e.clientX, e.clientY);

      if (hit) {
        // Backtracking check: if dragging back to the penultimate item, unwind
        if (selectedChain.length >= 2 && selectedChain[selectedChain.length - 2].id === hit.id) {
          const newChain = selectedChain.slice(0, -1);
          setSelectedChain(newChain);
          onLetterChainChange(newChain);
          kidAudio.playLetterTone(Math.max(0, newChain.length - 1));
          return;
        }

        // Check if not already in chain and is adjacent to last cell
        const alreadyInChain = selectedChain.some(c => c.id === hit.id);
        const lastCell = selectedChain[selectedChain.length - 1];

        if (!alreadyInChain && lastCell && isAdjacent(lastCell, hit)) {
          const newChain = [...selectedChain, hit];
          setSelectedChain(newChain);
          onLetterChainChange(newChain);
          kidAudio.playLetterTone(newChain.length - 1);
        }
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
    setPointerPos(null);

    if (isDragging) {
      setIsDragging(false);
      if (selectedChain.length >= 2) {
        onSubmitWord(selectedChain);
      }
      // Clear after short visual settling
      setTimeout(() => {
        setSelectedChain([]);
        onLetterChainChange([]);
      }, 180);
    }
  };

  // Tap-to-select alternative for younger kids who might not want to drag
  const handleCellClick = (cell: GridCell) => {
    if (isDragging) return; // handled by drag

    const alreadyIdx = selectedChain.findIndex(c => c.id === cell.id);
    if (alreadyIdx !== -1) {
      // Tap on current last cell or in chain: if clicking last cell, submit!
      if (alreadyIdx === selectedChain.length - 1 && selectedChain.length >= 2) {
        onSubmitWord(selectedChain);
        setTimeout(() => {
          setSelectedChain([]);
          onLetterChainChange([]);
        }, 180);
        return;
      }
      // If clicking earlier node, slice back to it
      const newChain = selectedChain.slice(0, alreadyIdx + 1);
      setSelectedChain(newChain);
      onLetterChainChange(newChain);
      kidAudio.playLetterTone(newChain.length - 1);
      return;
    }

    if (selectedChain.length === 0) {
      const newChain = [cell];
      setSelectedChain(newChain);
      onLetterChainChange(newChain);
      kidAudio.playLetterTone(0);
    } else {
      const lastCell = selectedChain[selectedChain.length - 1];
      if (isAdjacent(lastCell, cell)) {
        const newChain = [...selectedChain, cell];
        setSelectedChain(newChain);
        onLetterChainChange(newChain);
        kidAudio.playLetterTone(newChain.length - 1);
      } else {
        // Start a fresh word from this cell
        const newChain = [cell];
        setSelectedChain(newChain);
        onLetterChainChange(newChain);
        kidAudio.playLetterTone(0);
      }
    }
  };

  // Pastel letter bubble color palette
  const getCellColor = (row: number, col: number, isSelected: boolean, isHinted: boolean, isFound: boolean) => {
    if (isSelected) {
      return 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg ring-4 ring-amber-300 scale-110 -translate-y-1';
    }
    if (isHinted) {
      return 'bg-gradient-to-br from-yellow-300 to-amber-400 text-amber-950 ring-4 ring-yellow-400 animate-pulse scale-105';
    }
    if (isFound) {
      return 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-900 border-2 border-emerald-300 shadow-xs';
    }

    // Varied friendly pastel tiles based on position
    const palettes = [
      'bg-gradient-to-br from-rose-100 to-pink-200 text-rose-950 border-rose-200',
      'bg-gradient-to-br from-sky-100 to-blue-200 text-sky-950 border-sky-200',
      'bg-gradient-to-br from-emerald-100 to-green-200 text-emerald-950 border-emerald-200',
      'bg-gradient-to-br from-amber-100 to-yellow-200 text-amber-950 border-amber-200',
      'bg-gradient-to-br from-purple-100 to-indigo-200 text-purple-950 border-purple-200'
    ];
    const palIdx = (row * 3 + col) % palettes.length;
    return `${palettes[palIdx]} hover:scale-105 border-2 shadow-sm hover:shadow-md`;
  };

  // Construct SVG path connecting selected nodes
  let svgPathD = '';
  if (selectedChain.length > 0) {
    const points = selectedChain
      .map(c => nodePositions.get(c.id))
      .filter((p): p is { x: number; y: number; radius: number } => p !== undefined);

    if (points.length > 0) {
      svgPathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        svgPathD += ` L ${points[i].x} ${points[i].y}`;
      }
      if (pointerPos && isDragging) {
        svgPathD += ` L ${pointerPos.x} ${pointerPos.y}`;
      }
    }
  }

  const numCols = boardLetters[0]?.length || 4;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full max-w-md mx-auto aspect-square p-4 sm:p-6 bg-gradient-to-b from-amber-100/60 to-orange-100/40 rounded-3xl border-4 border-amber-200/90 shadow-md touch-none select-none flex items-center justify-center"
      style={{ touchAction: 'none' }}
    >
      {/* SVG overlay for connecting line ribbon */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {svgPathD && (
          <>
            {/* Outer halo */}
            <path
              d={svgPathD}
              fill="none"
              stroke="#FDE68A"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
            {/* Main connecting ribbon */}
            <path
              d={svgPathD}
              fill="none"
              stroke="url(#lineGlow)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#softGlow)"
            />
            {/* Inner bright core */}
            <path
              d={svgPathD}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
          </>
        )}
      </svg>

      {/* Grid of letter buttons */}
      <div
        className="grid gap-2.5 sm:gap-3.5 w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardLetters.length}, minmax(0, 1fr))`
        }}
      >
        {cells.map(cell => {
          const isSelected = selectedChain.some(c => c.id === cell.id);
          const isHinted = hintCellId === cell.id;
          const isFound = foundCellIds.has(cell.id);

          return (
            <button
              key={cell.id}
              id={cell.id}
              type="button"
              onClick={() => handleCellClick(cell)}
              className={`relative flex items-center justify-center rounded-2xl sm:rounded-3xl font-black text-2xl sm:text-3xl lg:text-4xl transition-all duration-150 cursor-pointer active:scale-95 ${getCellColor(
                cell.row,
                cell.col,
                isSelected,
                isHinted,
                isFound
              )}`}
              aria-label={`Letter ${cell.letter}`}
            >
              <span className="drop-shadow-xs select-none">
                {cell.letter}
              </span>

              {/* Subdued order badge if in current multi-letter chain */}
              {isSelected && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-white text-amber-700 text-xs font-bold rounded-full flex items-center justify-center shadow-xs">
                  {selectedChain.findIndex(c => c.id === cell.id) + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
