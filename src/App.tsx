import { useState, useEffect, useCallback } from 'react';

const EMOJIS = ['🚀','💎','🔥','⚡','🌙','🎯','💫','🏆','🎮','🎲','🎨','🎭'];
const GRID = 4;
const ROWS = 6;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function App() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const init = useCallback(() => {
    const pairs = [...EMOJIS.slice(0, (ROWS * GRID) / 2), ...EMOJIS.slice(0, (ROWS * GRID) / 2)];
    setCards(shuffle(pairs));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
  }, []);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [a, b] = flipped;
      if (cards[a] === cards[b]) {
        setMatched(m => [...m, a, b]);
        setFlipped([]);
      } else {
        const t = setTimeout(() => setFlipped([]), 800);
        return () => clearTimeout(t);
      }
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === ROWS * GRID && matched.length > 0) setWon(true);
  }, [matched]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-2">🧠 Flip Match</h1>
      <p className="text-purple-300 mb-4">Moves: {moves} | Matched: {matched.length / 2} / {(ROWS * GRID) / 2}</p>
      <button onClick={init} className="mb-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold">{won ? 'Play Again' : 'Restart'}</button>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)`, gap: 8 }}>
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <button key={i} onClick={() => !isFlipped && flipped.length < 2 && setFlipped(f => [...f, i])}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-3xl font-bold flex items-center justify-center transition-all duration-300 ${
                isFlipped ? 'bg-white shadow-lg rotate-0' : 'bg-purple-800 hover:bg-purple-700 rotate-180'
              } ${matched.includes(i) ? 'ring-4 ring-green-400' : ''}`}>
              {isFlipped ? card : '?'}
            </button>
          );
        })}
      </div>
      {won && <div className="mt-6 text-center"><p className="text-3xl text-yellow-400 font-bold">🎉 You Won!</p><p className="text-white text-xl">in {moves} moves</p></div>}
    </div>
  );
}
