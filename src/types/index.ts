export interface Player {
  name: string;
  index: string;
  password: string;
  wins: number;
}

export interface Ship {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface GamePlayer {
  player: Player;
  ships: Ship[];
  gameBoard: string[][];
  isReady: boolean;
}

export interface Room {
  roomId: string;
  roomUsers: { name: string; index: string }[];
}

export interface Game {
  idGame: string;
  players: GamePlayer[];
  currentPlayerIndex: string;
  isStarted: boolean;
  isFinished: boolean;
}

export type AttackStatus = 'miss' | 'shot' | 'killed';

export interface WebSocketMessage<T> {
  type: string;
  data: T;
  id?: 0;
}

export interface RegRequestData {
  name: string;
  password: string;
}

export interface RegResponseData {
  name: string;
  index: string;
  error: boolean;
  errorText: string;
}

export interface UpdateWinnersData {
  name: string;
  wins: number;
}

export type CreateRoomRequestData = '';

export interface AddUserToRoomRequestData {
  indexRoom: string;
}

export interface CreateGameResponseData {
  idGame: string;
  idPlayer: string;
}

export interface UpdateRoomResponseData {
  roomId: string;
  roomUsers: {
    name: string;
    index: string;
  }[];
}

export interface AddShipsRequestData {
  gameId: string;
  ships: Ship[];
  indexPlayer: string;
}

export interface StartGameResponseData {
  ships: Ship[];
  currentPlayerIndex: string;
}

export interface AttackRequestData {
  gameId: string;
  x: number;
  y: number;
  indexPlayer: string;
}

export interface AttackResponseData {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: string;
  status: AttackStatus;
}

export interface RandomAttackRequestData {
  gameId: string;
  indexPlayer: string;
}

export interface TurnResponseData {
  currentPlayer: string;
}

export interface FinishResponseData {
  winPlayer: string;
}
