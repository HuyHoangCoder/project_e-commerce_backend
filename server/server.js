require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001
const connectDB = require('./config/dbConnect');
const initRouter = require('./routers');
const cookieParser = require('cookie-parser');
app.use(express.json()); 
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })); 

connectDB();
initRouter(app);


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
