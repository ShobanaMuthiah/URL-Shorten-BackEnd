import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './Routers/Auth.js';
import urlRoutes from './Routers/Url.js';
import dashboardRoutes from './Routers/Dashboard.js';
import { Server } from 'socket.io';
import http from 'http';
import connectDB from './Databases/ConnectDB.js';
import cors from 'cors';
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials:true
  },
});
app.use(cors({
  origin:'*',
  credentials:true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/dashboard', dashboardRoutes);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.port || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port`);
});
