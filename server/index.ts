import app from './main';
import dotenv from 'dotenv';

dotenv.config();

app.listen(8104, "::", () => {
    console.log(`Server is running on port ${process.env.VITE_BACKEND_PORT} and hostname ${process.env.VITE_BACKEND_HOSTNAME}`);
});