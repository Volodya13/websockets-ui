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
} from '../types';

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
          );
          break;
        case 'create_room':
          handleCreateRoom(
            ws,
            parsedMessage as WebSocketMessage<CreateRoomRequestData>,
          );
          break;
        case 'add_user_to_room':
          handleAddUserToRoom(
            ws,
            parsedMessage as WebSocketMessage<AddUserToRoomRequestData>,
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
              id: 0,
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

//temporary mock handlers
function handleRegistration(
  ws: WebSocket,
  message: WebSocketMessage<RegRequestData>,
) {
  console.log('Auth handle:', message.data);

  const response: WebSocketMessage<RegResponseData> = {
    type: 'reg',
    data: {
      name: message.data.name,
      index: 'some_player_id',
      error: false,
      errorText: '',
    },
    id: 0,
  };
  ws.send(JSON.stringify(response));
}

function handleCreateRoom(
  ws: WebSocket,
  message: WebSocketMessage<CreateRoomRequestData>,
) {
  console.log('Handle room adding:', message.data);

  const response: WebSocketMessage<UpdateRoomResponseData[]> = {
    type: 'update_room',
    data: [
      {
        roomId: 'some_room_id',
        roomUsers: [{ name: 'Player1', index: 'player1_id' }],
      },
    ],
    id: 0,
  };
  ws.send(JSON.stringify(response));
}

function handleAddUserToRoom(
  ws: WebSocket,
  message: WebSocketMessage<AddUserToRoomRequestData>,
) {
  console.log('Adding players to the room:', message.data);

  const response: WebSocketMessage<CreateGameResponseData> = {
    type: 'create_game',
    data: { idGame: 'some_game_id', idPlayer: 'some_player_in_game_id' },
    id: 0,
  };
  ws.send(JSON.stringify(response));
}

function handleAddShips(
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
    id: 0,
  };
  ws.send(JSON.stringify(response));
}

function handleAttack(
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
    id: 0,
  };
  ws.send(JSON.stringify(response));
}

function handleRandomAttack(
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
    id: 0,
  };
  ws.send(JSON.stringify(response));
}
