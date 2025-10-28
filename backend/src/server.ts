import dotenv from 'dotenv';
import App from './app';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const app = new App();

app.startServer(PORT);
