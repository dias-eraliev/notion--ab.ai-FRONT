import app from './main';
import dotenv from 'dotenv';

dotenv.config();

app.listen(8304, "::", () => {
    console.log(`Server is running`);
});