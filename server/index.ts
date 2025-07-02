import app from './main';
import dotenv from 'dotenv';

dotenv.config();

app.listen(8118, "::", () => {
    console.log(`kolleddj server is running on port 8304`);
});