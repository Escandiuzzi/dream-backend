import express from 'express';
import { Server, Socket } from "socket.io";
import { route } from './routes';
import { Room } from './room/room';

const app = express();

app.use(express.json());
app.use(route);

export const rooms: Room[] = [];
const clients: Socket[] = [];

const server = app.listen(3333, () => 'server running on port 3333');

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('Client connected')
    socket.on('create', (args) => {
        const { name, numberOfPlayers } = args;

        createRoom({ name: name, numberOfPlayers: numberOfPlayers, socket: socket });
    });
}
);

io.on('guessed', (socket) => {
    console.log('received');
});

export interface CreateRoomData {
    name: string,
    numberOfPlayers: number,
    socket: Socket
}

export function createRoom(data: CreateRoomData) {

    const { name, numberOfPlayers, socket } = data;

    console.log('Creating new room!', name, numberOfPlayers);

    let room = rooms.find(room => room.name === name);

    if (room == null) {
        room = new Room(name, numberOfPlayers, io);
        rooms.push(room);
    }

    room.add(socket);
}