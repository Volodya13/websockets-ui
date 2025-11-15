import { httpServer } from './src/http_server';
import { Ws } from './src/ws/ws';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new Ws(WS_PORT);

process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  wsServer.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down servers...');
  wsServer.close();
  process.exit(0);
});
