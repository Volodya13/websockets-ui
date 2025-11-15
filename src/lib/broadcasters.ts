import {
  UpdateRoomResponseData,
  UpdateWinnersData,
  WebSocketMessage,
} from '../types';
import { WebSocket, WebSocketServer } from 'ws';
import { players, rooms } from './storage';

export function sendUpdateWinners(wss: WebSocketServer) {
  const winnersData: UpdateWinnersData[] = players.map((player) => ({
    name: player.name,
    wins: player.wins,
  }));

  const response: WebSocketMessage<UpdateWinnersData[]> = {
    type: 'update_winners',
    data: winnersData,
    id: 0,
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(response));
    }
  });
}

export function sendUpdateRoom(wss: WebSocketServer) {
  const roomsData: UpdateRoomResponseData[] = rooms.map((room) => ({
    roomId: room.roomId,
    roomUsers: room.roomUsers,
  }));

  const response: WebSocketMessage<UpdateRoomResponseData[]> = {
    type: 'update_room',
    data: roomsData,
    id: 0,
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(response));
    }
  });
}
