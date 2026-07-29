import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Tile,
  GameStatus,
  GameMode,
  ScoreFloatingText,
  SaaSProductId,
} from '../types/game';
import {
  createInitialBoard,
  swapTilesOnBoard,
  findMatches,
  applyGravityAndRefill,
  hasValidMoves,
  shuffleBoard,
  calculateMatchScore,
  getMotivationalMessage,
  areAdjacent,
} from '../utils/gameLogic';
import { audioEngine } from '../utils/audio';
import { getStoredLeaderboard, saveLeaderboardEntry } from '../components/LeaderboardModal';
import { calculateRankTier } from '../components/GameOverModal';

const TIMER_INITIAL = 60;

export function useGameEngine() {
  const [status, setStatus] = useState<GameStatus>('landing');
  const [mode, setMode] = useState<GameMode>('timed');
  const [board, setBoard] = useState<Tile[][]>([]);
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number } | null>(null);
  const [matchedTileIds, setMatchedTileIds] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(TIMER_INITIAL);
  const [timePlayed, setTimePlayed] = useState<number>(0);
  const [floatingScores, setFloatingScores] = useState<ScoreFloatingText[]>([]);
  const [educationalProductId, setEducationalProductId] = useState<SaaSProductId | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const boardRef = useRef<Tile[][]>([]);
  const scoreRef = useRef<number>(0);
  const statusRef = useRef<GameStatus>('landing');
  const sessionRef = useRef<number>(0);
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // Load high score on mount
  useEffect(() => {
    const records = getStoredLeaderboard();
    if (records.length > 0) {
      setHighScore(records[0].score);
    }
  }, []);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const clearPendingTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutIdsRef.current.clear();
  }, []);

  const beginFreshSession = useCallback(() => {
    sessionRef.current += 1;
    clearPendingTimeouts();
    setIsBusy(false);
  }, [clearPendingTimeouts]);

  const isSessionActive = useCallback((sessionId: number) => {
    return sessionRef.current === sessionId;
  }, []);

  const scheduleSessionTimeout = useCallback(
    (sessionId: number, fn: () => void, delay: number) => {
      const timeoutId = setTimeout(() => {
        timeoutIdsRef.current.delete(timeoutId);
        if (!isSessionActive(sessionId)) return;
        fn();
      }, delay);

      timeoutIdsRef.current.add(timeoutId);
      return timeoutId;
    },
    [isSessionActive]
  );

  useEffect(() => {
    return () => {
      sessionRef.current += 1;
      clearPendingTimeouts();
    };
  }, [clearPendingTimeouts]);

  // Timer Tick
  useEffect(() => {
    if (status !== 'playing' || mode === 'zen') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        if (prev <= 10) {
          audioEngine.playTick();
        }
        return prev - 1;
      });

      setTimePlayed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status, mode]);

  const endGame = useCallback(() => {
    beginFreshSession();
    setSelectedTile(null);
    setMatchedTileIds(new Set());
    setMotivationalMessage(null);
    setEducationalProductId(null);
    setStatus('gameover');
    audioEngine.stopBGM();
    audioEngine.playGameOver();

    setHighScore((prev) => Math.max(prev, scoreRef.current));
  }, [beginFreshSession]);

  const startGame = (chosenMode: GameMode = 'timed') => {
    beginFreshSession();
    setMode(chosenMode);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalMatches(0);
    setTimeRemaining(TIMER_INITIAL);
    setTimePlayed(0);
    setSelectedTile(null);
    setMatchedTileIds(new Set());
    setFloatingScores([]);
    setEducationalProductId(null);
    setMotivationalMessage(null);

    const initialBoard = createInitialBoard();
    setBoard(initialBoard);
    setStatus('playing');

    audioEngine.startBGM();
  };

  const togglePause = () => {
    if (status === 'playing') {
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('playing');
    }
  };

  const toggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  // Process recursive cascades
  const resolveCascades = useCallback(
    async (currentBoard: Tile[][], currentCombo: number, sessionId = sessionRef.current) => {
      if (!isSessionActive(sessionId)) return;
      const matchResult = findMatches(currentBoard);

      if (matchResult.matchedTileIds.size === 0) {
        // No more matches in cascade
        setCombo(0);
        setMatchedTileIds(new Set());

        // Check for valid moves
        if (!hasValidMoves(currentBoard)) {
          setMotivationalMessage('SHUFFLING BOARD!');
          scheduleSessionTimeout(sessionId, () => {
            const shuffled = shuffleBoard(currentBoard);
            setBoard(shuffled);
            setMotivationalMessage(null);
            setIsBusy(false);
          }, 600);
        } else {
          setIsBusy(false);
        }
        return;
      }

      // We have matches!
      const nextCombo = currentCombo + 1;
      setCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));
      setTotalMatches((prev) => prev + 1);

      // Play match sound
      audioEngine.playMatch(nextCombo);

      // Highlight matched tile IDs
      setMatchedTileIds(matchResult.matchedTileIds);

      // Pick first matched product for educational popup
      const matchedProductsArr = Array.from(matchResult.matchedProducts.keys());
      if (matchedProductsArr.length > 0) {
        setEducationalProductId(matchedProductsArr[0]);
      }

      // Calculate Points
      const { points, label } = calculateMatchScore(
        matchResult.matchedTileIds.size,
        nextCombo
      );
      setScore((prev) => {
        const updated = prev + points;
        setHighScore((h) => Math.max(h, updated));
        return updated;
      });

      // Check motivational message
      const msg = getMotivationalMessage(nextCombo, scoreRef.current + points);
      if (msg) {
        setMotivationalMessage(msg);
        scheduleSessionTimeout(sessionId, () => setMotivationalMessage(null), 2500);
      }

      // Spawn floating score text
      const firstMatchedId = Array.from(matchResult.matchedTileIds)[0];
      let matchRow = 4, matchCol = 4;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (currentBoard[r][c].id === firstMatchedId) {
            matchRow = r;
            matchCol = c;
          }
        }
      }

      const scoreId = `score-${Date.now()}`;
      setFloatingScores((prev) => [
        ...prev,
        {
          id: scoreId,
          score: points,
          row: matchRow,
          col: matchCol,
          combo: nextCombo,
          label,
        },
      ]);

      scheduleSessionTimeout(sessionId, () => {
        setFloatingScores((prev) => prev.filter((s) => s.id !== scoreId));
      }, 1200);

      // Wait 320ms for explosion animation
      await new Promise((res) => setTimeout(res, 320));
      if (!isSessionActive(sessionId)) return;

      // Apply Gravity and Refill
      const { newBoard } = applyGravityAndRefill(
        currentBoard,
        matchResult.matchedTileIds
      );
      setBoard(newBoard);
      setMatchedTileIds(new Set());

      // Wait for drop animation
      await new Promise((res) => setTimeout(res, 280));
      if (!isSessionActive(sessionId)) return;

      // Continue cascade
      resolveCascades(newBoard, nextCombo, sessionId);
    },
    [isSessionActive, scheduleSessionTimeout]
  );

  const handleSwap = useCallback(
    async (r1: number, c1: number, r2: number, c2: number) => {
      if (isBusy || status !== 'playing') return;
      setIsBusy(true);
      setSelectedTile(null);

      audioEngine.playSwap();

      // Perform swap
      const sessionId = sessionRef.current;
      const originalBoard = boardRef.current;
      const swappedBoard = swapTilesOnBoard(originalBoard, r1, c1, r2, c2);
      setBoard(swappedBoard);

      // Check if valid match
      const initialMatches = findMatches(swappedBoard);

      if (initialMatches.matchedTileIds.size === 0) {
        // Invalid swap - bounce back after delay
        audioEngine.playInvalid();
        await new Promise((res) => setTimeout(res, 280));
        if (!isSessionActive(sessionId)) return;
        setBoard(originalBoard); // Revert
        setIsBusy(false);
      } else {
        // Valid swap! Start cascade loop
        resolveCascades(swappedBoard, 0, sessionId);
      }
    },
    [isBusy, status, resolveCascades, isSessionActive]
  );

  const saveScoreToLeaderboard = (playerName: string) => {
    saveLeaderboardEntry({
      playerName,
      score,
      maxCombo,
      totalMatches,
      rank: calculateRankTier(score),
      date: 'Today',
      mode,
    });
  };

  return {
    status,
    mode,
    board,
    selectedTile,
    setSelectedTile,
    matchedTileIds,
    score,
    highScore,
    combo,
    maxCombo,
    totalMatches,
    timeRemaining,
    timePlayed,
    floatingScores,
    educationalProductId,
    setEducationalProductId,
    motivationalMessage,
    isMuted,
    isBusy,
    startGame,
    togglePause,
    toggleMute,
    handleSwap,
    saveScoreToLeaderboard,
  };
}
