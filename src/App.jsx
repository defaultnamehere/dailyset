// src/App.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateBoard, checkSet } from './utils/game';
import Card from './components/Card';
import Confetti from 'react-confetti';
import FoundSetsSidebar from './components/FoundSetsSidebar';
import HelpIcon from './components/HelpIcon';
import { formatInTimeZone } from 'date-fns-tz';
import seedrandom from 'seedrandom';

function App() {
  const [board, setBoard] = useState([]);
  const [allSets, setAllSets] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectionResult, setSelectionResult] = useState(null);
  const [foundSets, setFoundSets] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [partyMode, setPartyMode] = useState(() => {
    const saved = localStorage.getItem('partyMode');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [explosions, setExplosions] = useState([]);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const cardRefs = useRef(new Map());

  

  const startNewGame = useCallback(() => {
    const timeZone = 'Australia/Sydney';
    const today = new Date();
    const seed = formatInTimeZone(today, timeZone, 'yyyy-MM-dd');
    const rng = seedrandom(seed);

    const { board: newBoard, sets: newSets } = generateBoard(rng);
    setBoard(newBoard);
    setAllSets(newSets.map(s => s.sort().join('')));
    setSelectedCards([]);
    setSelectionResult(null);
    setFoundSets([]);
    setIsGameWon(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setExplosions([]);
    setCopyButtonText('Copy');
    cardRefs.current.clear();
  }, []);

  const winGame = () => {
    setFoundSets(allSets);
    setIsGameWon(true);
  };

  const triggerExplosion = () => {
    if (selectedCards.length !== 3) return;

    const sources = selectedCards
      .map(cardValue => {
        const rect = cardRefs.current.get(cardValue)?.current?.getBoundingClientRect();
        if (!rect) return null;
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          w: 0,
          h: 0,
        };
      })
      .filter(Boolean);

    if (sources.length === 3) {
      setExplosions(sources);
      // Cleanup the confetti components after they've had plenty of time to fall
      setTimeout(() => setExplosions([]), 7000);
    }
  };

  useEffect(() => {
    localStorage.setItem('partyMode', JSON.stringify(partyMode));
  }, [partyMode]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleKeydown = (e) => e.key === 'd' && winGame();
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [allSets]);

  useEffect(() => {
    if (selectedCards.length === 3 && selectionResult === null) {
      const isSet = checkSet(...selectedCards);
      if (isSet) {
        const setString = [...selectedCards].sort().join('');
        if (allSets.includes(setString) && !foundSets.includes(setString)) {
          if (partyMode) triggerExplosion();
          setFoundSets(prev => [...prev, setString]);
          setSelectionResult('correct');
          if (foundSets.length + 1 === allSets.length) {
            setIsGameWon(true);
          }
        } else {
          setSelectionResult('incorrect');
        }
      } else {
        setSelectionResult('incorrect');
      }

      setTimeout(() => {
        setSelectedCards([]);
        setSelectionResult(null);
      }, 500);
    }
  }, [selectedCards, allSets, foundSets, selectionResult, partyMode]);

  useEffect(() => {
    if (isGameWon && startTime) {
      setElapsedTime(Date.now() - startTime);
    }
  }, [isGameWon, startTime]);

  const handleCardClick = (cardValue) => {
    if (isGameWon || selectedCards.length === 3) return;
    setSelectedCards(current =>
      current.includes(cardValue)
        ? current.filter(c => c !== cardValue)
        : [...current, cardValue]
    );
  };

  const formatTime = (ms) => {
    return `${Math.round(ms / 1000)}s`;
  };

  const handleCopyTime = () => {
    const timeInSeconds = Math.round(elapsedTime / 1000);
    navigator.clipboard.writeText(timeInSeconds);
    setCopyButtonText('Copied!');
    setTimeout(() => setCopyButtonText('Copy'), 2000);
  };

  return (
    <div className="container">
      {isGameWon && <Confetti width={windowSize.width} height={windowSize.height} />}
      {explosions.length > 0 && explosions.map((source, i) => (
        <Confetti
          key={i}
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={100}
          initialVelocityX={{ min: -30, max: 30}}
          initialVelocityY={{ min: -50, max: -20}}
          gravity={0.4}
          friction={0.95}
          tweenDuration={50}
          confettiSource={source}
        />
      ))}
      <header>
        <h1>Daily SET Puzzle <HelpIcon /></h1>
      </header>
      
      <div className="game-layout">
        <main className="game-content">
          <div className="board">
            {board.map((cardValue) => {
              if (!cardRefs.current.has(cardValue)) {
                cardRefs.current.set(cardValue, React.createRef());
              }
              return (
                <Card
                  ref={cardRefs.current.get(cardValue)}
                  key={cardValue}
                  value={cardValue}
                  isSelected={selectedCards.includes(cardValue)}
                  onClick={() => handleCardClick(cardValue)}
                  animation={selectedCards.includes(cardValue) ? selectionResult : null}
                />
              );
            })}
          </div>
          <div className="game-actions">
            {isGameWon ? (
              <div className="victory-message">
                <p className="congrats">Congratulations! You found all the sets!</p>
                <div className="time-display">
                  <p className="timer">Your time: {formatTime(elapsedTime)}</p>
                  <button onClick={handleCopyTime} className={`copy-button ${copyButtonText === 'Copied!' ? 'copied' : ''}`}>
                    {copyButtonText}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={winGame} className="secondary-button">Show Solution</button>
                <label htmlFor="party-mode" className="toggle-switch party-mode-toggle">
                  <input
                    type="checkbox"
                    id="party-mode"
                    checked={partyMode}
                    onChange={() => setPartyMode(!partyMode)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </>
            )}
          </div>
        </main>
        <FoundSetsSidebar foundSets={foundSets} totalSets={allSets.length} />
      </div>
    </div>
  );
}

export default App;
      