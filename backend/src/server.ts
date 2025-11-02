import dotenv from 'dotenv';
import path from 'path';
import App from './app';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = Number(process.env.PORT) || 3000;

const app = new App();

app.startServer(PORT);
