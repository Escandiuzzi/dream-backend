import express from 'express';
import { Server, Socket } from "socket.io";
import { route } from './routes';
import { Room } from './room/room';

const app = express();

app.use(express.json());
app.use(route);

export const rooms: Room[] = [];
const clients: string[] = [];

const server = app.listen(3333, () => 'server running on port 3333');

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
})

io.on('connection', (socket) => {
    if (!clients.includes(socket.id)) {
        console.log('Client connected')
        socket.on('create', (args) => {
            const { username, name, numberOfPlayers } = args;
            createRoom({ username: username, name: name, numberOfPlayers: numberOfPlayers, socket: socket });
        });
        socket.on('join', (args) => {
            console.log('User just joined');
            const { username, name } = args;
            joinRoom({ username: username, name: name, socket: socket });
        });

        clients.push(socket.id);
    }
});

io.on('guessed', (socket) => {
    console.log('received');
});

export interface CreateRoomData {
    username: string,
    name: string,
    numberOfPlayers: number,
    socket: Socket
}

export interface JoinRoomData {
    username: string,
    name: string,
    socket: Socket
}

export function createRoom(data: CreateRoomData) {

    const { username, name, numberOfPlayers, socket } = data;

    console.log('Creating new room!', name, numberOfPlayers);

    let room = rooms.find(room => room.getName() === name);

    if (room == null) {
        room = new Room(name, numberOfPlayers, io);
        rooms.push(room);
    }

    room.add({username: username, socket: socket});
}

export function joinRoom(data: JoinRoomData) {

    const { username, name, socket } = data;

    console.log('Joining new room!', name);

    let room = rooms.find(room => room.getName() === name);

    if (room != null) {
        room.add({username: username, socket: socket});
    }
}