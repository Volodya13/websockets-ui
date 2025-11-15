import { WebSocketServer } from 'ws';
import {
  WebSocketMessage,
  RegRequestData,
  CreateRoomRequestData,
  AddUserToRoomRequestData,
  AddShipsRequestData,
  AttackRequestData,
  RandomAttackRequestData,
} from '../types';
import {
  handleAddShips,
  handleAddUserToRoom,
  handleAttack,
  handleCreateRoom,
  handleRandomAttack,
  handleRegistration,
} from '../lib/handlers';

const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: Number(PORT) });

console.log(`WebSocket started on a port: ${PORT}`);

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message) => {
    try {
      const parsedMessage: WebSocketMessage<any> = JSON.parse(
        message.toString(),
      );
      console.log('The message is:', parsedMessage);

      switch (parsedMessage.type) {
        case 'reg':
          handleRegistration(
            ws,
            parsedMessage as WebSocketMessage<RegRequestData>,
            wss,
          );
          break;
        case 'create_room':
          handleCreateRoom(
            ws,
            parsedMessage as WebSocketMessage<CreateRoomRequestData>,
            wss,
          );
          break;
        case 'add_user_to_room':
          handleAddUserToRoom(
            ws,
            parsedMessage as WebSocketMessage<AddUserToRoomRequestData>,
            wss,
          );
          break;
        case 'add_ships':
          handleAddShips(
            ws,
            parsedMessage as WebSocketMessage<AddShipsRequestData>,
          );
          break;
        case 'attack':
          handleAttack(
            ws,
            parsedMessage as WebSocketMessage<AttackRequestData>,
          );
          break;
        case 'randomAttack':
          handleRandomAttack(
            ws,
            parsedMessage as WebSocketMessage<RandomAttackRequestData>,
          );
          break;
        default:
          console.warn('Unknown message type:', parsedMessage.type);

          ws.send(
            JSON.stringify({
              type: 'error',
              data: { errorText: 'Unknown message type' },
              id: parsedMessage.id,
            }),
          );
          break;
      }
    } catch (error) {
      console.error('Error:', error);
      ws.send(
        JSON.stringify({
          type: 'error',
          data: { errorText: 'Invalid format JSON' },
          id: 0,
        }),
      );
    }
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');
  });

  ws.on('error', (error) => {
    console.error('Error WebSocket:', error);
  });
});
