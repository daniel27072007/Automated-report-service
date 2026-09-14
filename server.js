import app from './src/app.js'
import connectDatabase from './src/config/database.js'
import 'dotenv/config'

const PORT = process.env.PORT || 3000

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on: http://localhost:${PORT}`)
        });
        
    } catch (error) {
        console.error("Critical fail when stating the server: ", error.message);
        process.exit(1);
    }
};

startServer()