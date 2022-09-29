import express from 'express';
import cors from 'cors';
import { Server } from "socket.io";
import { route } from './routes';
import { Room } from './room/room';

const app = express();

app.use(express.json());
app.use(route);
app.use(cors);

let rooms : Room[] = [];

const server = app.listen(3333, () => 'server running on port 3333');
const io = new Server(server, {
    cors: {
    origin: 'http://localhost:3000',
    credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('User connected');

    const roomName = 'Game Room';

    let room = rooms.find(room => room.name === roomName);

    if (room == null) {
        room = new Room(roomName, io);
        rooms.push(room);
    }

    room.add(socket);
});

io.on('guessed', (socket) => {
    console.log('received');    
});