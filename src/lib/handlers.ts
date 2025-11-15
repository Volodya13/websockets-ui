import { WebSocket, WebSocketServer } from 'ws';
import {
  WebSocketMessage,
  RegRequestData,
  RegResponseData,
  CreateRoomRequestData,
  AddUserToRoomRequestData,
  AddShipsRequestData,
  AttackRequestData,
  RandomAttackRequestData,
  CreateGameResponseData,
  UpdateRoomResponseData,
  StartGameResponseData,
  AttackResponseData,
  Player,
} from '../types';
import { players, rooms } from './storage';
import { sendUpdateWinners, sendUpdateRoom } from './broadcasters';

function sendResponse<T>(ws: WebSocket, message: WebSocketMessage<T>): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

export function handleRegistration(
  ws: WebSocket,
  message: WebSocketMessage<RegRequestData>,
  wss: WebSocketServer,
) {
  console.log('Auth handle:', message.data);

  const { name, password } = message.data;

  const playerIndex = `player_${players.length + 1}`;
  const newPlayer: Player = { name, password, index: playerIndex, wins: 0 };
  players.push(newPlayer);

  const response: WebSocketMessage<RegResponseData> = {
    type: 'reg',
    data: {
      name: message.data.name,
      index: newPlayer.index, // Используем сгенерированный index
      error: false,
      errorText: '',
    },
    id: message.id,
  };
  sendResponse(ws, response);

  sendUpdateWinners(wss);
}

export function handleCreateRoom(
  ws: WebSocket,
  message: WebSocketMessage<CreateRoomRequestData>,
  wss: WebSocketServer,
) {
  console.log('Handle room adding:', message.data);

  const roomId = `room_${rooms.length + 1}`;
  const newRoom: UpdateRoomResponseData = { roomId, roomUsers: [] };

  rooms.push(newRoom);

  const response: WebSocketMessage<UpdateRoomResponseData[]> = {
    type: 'update_room',
    data: rooms.map((room) => ({
      roomId: room.roomId,
      roomUsers: room.roomUsers,
    })),
    id: message.id,
  };
  sendResponse(ws, response);

  sendUpdateRoom(wss);
}

export function handleAddUserToRoom(
  ws: WebSocket,
  message: WebSocketMessage<AddUserToRoomRequestData>,
  wss: WebSocketServer,
) {
  console.log('Adding players to the room:', message.data);
  const { indexRoom } = message.data;

  const room = rooms.find((r) => r.roomId === indexRoom);

  const player = players[0];

  if (room && player && !room.roomUsers.some((u) => u.index === player.index)) {
    room.roomUsers.push({ name: player.name, index: player.index });
  }

  const response: WebSocketMessage<CreateGameResponseData> = {
    type: 'create_game',
    data: { idGame: 'some_game_id', idPlayer: player ? player.index : '' },
    id: message.id,
  };
  sendResponse(ws, response);

  sendUpdateRoom(wss);
}

export function handleAddShips(
  ws: WebSocket,
  message: WebSocketMessage<AddShipsRequestData>,
) {
  console.log('Adding ships handle:', message.data);

  const response: WebSocketMessage<StartGameResponseData> = {
    type: 'start_game',
    data: {
      ships: message.data.ships,
      currentPlayerIndex: message.data.indexPlayer,
    },
    id: message.id,
  };
  sendResponse(ws, response);
}

export function handleAttack(
  ws: WebSocket,
  message: WebSocketMessage<AttackRequestData>,
) {
  console.log('Attack handle:', message.data);

  const response: WebSocketMessage<AttackResponseData> = {
    type: 'attack',
    data: {
      position: { x: message.data.x, y: message.data.y },
      currentPlayer: message.data.indexPlayer,
      status: 'shot',
    },
    id: message.id,
  };
  sendResponse(ws, response);
}

export function handleRandomAttack(
  ws: WebSocket,
  message: WebSocketMessage<RandomAttackRequestData>,
) {
  console.log('Random attack handling:', message.data);

  const response: WebSocketMessage<AttackResponseData> = {
    type: 'attack',
    data: {
      position: { x: 0, y: 0 },
      currentPlayer: message.data.indexPlayer,
      status: 'miss',
    },
    id: message.id,
  };
  sendResponse(ws, response);
}
