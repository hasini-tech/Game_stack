import { Tile, SaaSProductId, SpecialTileType } from '../types/game';

export const BOARD_SIZE = 8;
export const NUM_PRODUCTS = 7;

let idCounter = 0;
function generateTileId(): string {
  idCounter++;
  return `tile-${Date.now()}-${idCounter}-${Math.random().toString(36).substr(2, 5)}`;
}

/**
 * Creates an 8x8 board with no initial matches and guaranteed at least 1 valid move.
 */
export function createInitialBoard(): Tile[][] {
  let board: Tile[][] = [];
  let attempts = 0;

  do {
    board = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      const row: Tile[] = [];
      for (let c = 0; c < BOARD_SIZE; c++) {
        let validProductIds: SaaSProductId[] = [0, 1, 2, 3, 4, 5, 6];

        // Prevent horizontal match-3
        if (c >= 2) {
          const prev1 = row[c - 1].productId;
          const prev2 = row[c - 2].productId;
          if (prev1 === prev2) {
            validProductIds = validProductIds.filter((p) => p !== prev1);
          }
        }

        // Prevent vertical match-3
        if (r >= 2) {
          const above1 = board[r - 1][c].productId;
          const above2 = board[r - 2][c].productId;
          if (above1 === above2) {
            validProductIds = validProductIds.filter((p) => p !== above1);
          }
        }

        const chosenProductId =
          validProductIds[Math.floor(Math.random() * validProductIds.length)];

        row.push({
          id: generateTileId(),
          productId: chosenProductId,
          row: r,
          col: c,
        });
      }
      board.push(row);
    }
    attempts++;
  } while (!hasValidMoves(board) && attempts < 100);

  return board;
}

/**
 * Check if two positions are orthogonal neighbors
 */
export function areAdjacent(
  r1: number,
  c1: number,
  r2: number,
  c2: number
): boolean {
  const dr = Math.abs(r1 - r2);
  const dc = Math.abs(c1 - c2);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

/**
 * Return a new board with swapped tiles
 */
export function swapTilesOnBoard(
  board: Tile[][],
  r1: number,
  c1: number,
  r2: number,
  c2: number
): Tile[][] {
  const newBoard = board.map((row) => [...row]);
  const temp = { ...newBoard[r1][c1] };

  newBoard[r1][c1] = {
    ...newBoard[r2][c2],
    row: r1,
    col: c1,
  };

  newBoard[r2][c2] = {
    ...temp,
    row: r2,
    col: c2,
  };

  return newBoard;
}

export interface MatchResult {
  matchedTileIds: Set<string>;
  matchedProducts: Map<SaaSProductId, number>;
  specialCreated?: { row: number; col: number; type: SpecialTileType }[];
}

/**
 * Scan board for horizontal and vertical matches (3 or more)
 */
export function findMatches(board: Tile[][]): MatchResult {
  const matchedTileIds = new Set<string>();
  const matchedProducts = new Map<SaaSProductId, number>();

  // Check horizontal matches
  for (let r = 0; r < BOARD_SIZE; r++) {
    let matchLen = 1;
    for (let c = 0; c < BOARD_SIZE; c++) {
      const current = board[r][c];
      const next = c < BOARD_SIZE - 1 ? board[r][c + 1] : null;

      if (next && current.productId === next.productId) {
        matchLen++;
      } else {
        if (matchLen >= 3) {
          const productId = current.productId;
          matchedProducts.set(
            productId,
            (matchedProducts.get(productId) || 0) + matchLen
          );
          for (let k = c - matchLen + 1; k <= c; k++) {
            matchedTileIds.add(board[r][k].id);
          }
        }
        matchLen = 1;
      }
    }
  }

  // Check vertical matches
  for (let c = 0; c < BOARD_SIZE; c++) {
    let matchLen = 1;
    for (let r = 0; r < BOARD_SIZE; r++) {
      const current = board[r][c];
      const next = r < BOARD_SIZE - 1 ? board[r + 1][c] : null;

      if (next && current.productId === next.productId) {
        matchLen++;
      } else {
        if (matchLen >= 3) {
          const productId = current.productId;
          matchedProducts.set(
            productId,
            (matchedProducts.get(productId) || 0) + matchLen
          );
          for (let k = r - matchLen + 1; k <= r; k++) {
            matchedTileIds.add(board[k][c].id);
          }
        }
        matchLen = 1;
      }
    }
  }

  return { matchedTileIds, matchedProducts };
}

/**
 * Drop tiles down to fill matched gaps and spawn new random tiles at the top.
 */
export function applyGravityAndRefill(
  board: Tile[][],
  matchedIds: Set<string>
): { newBoard: Tile[][]; newTileIds: Set<string> } {
  const newBoard: Tile[][] = Array.from({ length: BOARD_SIZE }, () => []);
  const newTileIds = new Set<string>();

  for (let c = 0; c < BOARD_SIZE; c++) {
    // Collect non-matched tiles in column from bottom to top
    const remainingInCol: Tile[] = [];
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (!matchedIds.has(board[r][c].id)) {
        remainingInCol.push(board[r][c]);
      }
    }

    // Number of new tiles needed for this column
    const missingCount = BOARD_SIZE - remainingInCol.length;

    // Build full updated column from top (r=0) to bottom (r=7)
    const updatedCol: Tile[] = [];

    // First add missing new tiles at the top
    for (let i = 0; i < missingCount; i++) {
      const rIndex = i;
      const newId = generateTileId();
      newTileIds.add(newId);
      updatedCol.push({
        id: newId,
        productId: Math.floor(Math.random() * NUM_PRODUCTS) as SaaSProductId,
        row: rIndex,
        col: c,
        isNew: true,
      });
    }

    // Then add remaining existing tiles
    for (let i = remainingInCol.length - 1; i >= 0; i--) {
      const rIndex = missingCount + (remainingInCol.length - 1 - i);
      updatedCol.push({
        ...remainingInCol[i],
        row: rIndex,
        col: c,
        isNew: false,
      });
    }

    // Assign column to newBoard
    for (let r = 0; r < BOARD_SIZE; r++) {
      newBoard[r][c] = updatedCol[r];
    }
  }

  return { newBoard, newTileIds };
}

/**
 * Check if the board has at least one valid swap move that creates a match
 */
export function hasValidMoves(board: Tile[][]): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      // Check swap with right neighbor
      if (c < BOARD_SIZE - 1) {
        const testBoard = swapTilesOnBoard(board, r, c, r, c + 1);
        if (findMatches(testBoard).matchedTileIds.size > 0) {
          return true;
        }
      }
      // Check swap with bottom neighbor
      if (r < BOARD_SIZE - 1) {
        const testBoard = swapTilesOnBoard(board, r, c, r + 1, c);
        if (findMatches(testBoard).matchedTileIds.size > 0) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Shuffle current board tiles randomly until no immediate matches but valid move exists
 */
export function shuffleBoard(board: Tile[][]): Tile[][] {
  const allTiles: Tile[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      allTiles.push(board[r][c]);
    }
  }

  let shuffledBoard: Tile[][] = [];
  let attempts = 0;

  do {
    // Fisher-Yates shuffle
    for (let i = allTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTiles[i], allTiles[j]] = [allTiles[j], allTiles[i]];
    }

    shuffledBoard = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      const row: Tile[] = [];
      for (let c = 0; c < BOARD_SIZE; c++) {
        const tile = allTiles[r * BOARD_SIZE + c];
        row.push({
          ...tile,
          row: r,
          col: c,
        });
      }
      shuffledBoard.push(row);
    }
    attempts++;
  } while (
    (findMatches(shuffledBoard).matchedTileIds.size > 0 ||
      !hasValidMoves(shuffledBoard)) &&
    attempts < 200
  );

  return shuffledBoard;
}

/**
 * Calculate score for a match cluster
 */
export function calculateMatchScore(
  tileCount: number,
  comboMultiplier: number
): { points: number; label?: string } {
  const basePointsPerTile = 100;
  let points = tileCount * basePointsPerTile * comboMultiplier;

  let label: string | undefined = undefined;
  if (tileCount >= 5) {
    points += 1000 * comboMultiplier;
    label = '5-MATCH BLAST!';
  } else if (tileCount === 4) {
    points += 400 * comboMultiplier;
    label = '4-IN-A-ROW!';
  } else if (comboMultiplier > 1) {
    label = `COMBO x${comboMultiplier}!`;
  }

  return { points, label };
}

/**
 * Get motivational badge text based on combo
 */
export function getMotivationalMessage(combo: number, score: number): string | null {
  if (combo === 2) return 'DOUBLE CRUSH!';
  if (combo === 3) return 'UNSTOPPABLE COMBO!';
  if (combo === 4) return 'SAAS MASTER STRIKE!';
  if (combo >= 5) return 'TECH EXPO LEGEND!';
  if (score > 10000 && score < 10500) return 'GOLD TIER ACHIEVED!';
  return null;
}
