const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const sessionRoute = require('./routes/sessionRoute');
const templateRoute = require('./routes/templateRoute');
const articleRoute = require('./routes/articleRoute');
const langagesRoute = require('./routes/langagesRoute');
const fileRoute = require('./routes/fileRoute');

const app = express();

// Middleware pour les sessions
app.use(session({secret: 'lele'}));

// Middleware pour les cookies
app.use(cookieParser());

// Middleware pour autoriser les requêtes CORS
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));
app.use(cors({
  origin: 'https://articles-dev.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Routes
app.use('/api', userRoute);
app.use('/api', sessionRoute);
app.use('/api', templateRoute);
app.use('/api', articleRoute);
app.use('/api', langagesRoute);
app.use('/api', fileRoute);

app.listen(3000, () => {
  console.log("listening on port 3000");
});