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

export class Ws {
  private readonly wss: WebSocketServer;

  constructor(port: number) {
    this.wss = new WebSocketServer({ port: port });

    console.log(`WebSocket started on a port: ${port}`);

    this.wss.on('connection', (ws) => {
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
                this.wss,
              );
              break;
            case 'create_room':
              handleCreateRoom(
                ws,
                parsedMessage as WebSocketMessage<CreateRoomRequestData>,
                this.wss,
              );
              break;
            case 'add_user_to_room':
              handleAddUserToRoom(
                ws,
                parsedMessage as WebSocketMessage<AddUserToRoomRequestData>,
                this.wss,
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
  }

  close() {
    this.wss.close();
  }
}
