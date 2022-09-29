import { Server, Socket } from "socket.io";
import { RandomRange } from "../utils/random-range";

export class Room {    
  
    name : string;
    players : Array<Socket> = new Array();
    
    private started: boolean = false;
    private numberOfPlayers : number = 0;
    private roles = ['sandman', 'good guy', 'bad guy'];
    
    constructor(name: string, private io: Server) {
        this.name = name;
    }

    add(socket : Socket)
    {
        socket.on('guessed', this.cardGuessed)
        socket.on('skip', this.skipCard)

        if(!this.players.includes(socket)) {
            this.players.push(socket);
     
            console.log('New player just joined', this.name);

            socket.join(this.name);
            
            this.numberOfPlayers++;
            console.log(this.numberOfPlayers);
        }

        if(this.numberOfPlayers >= 2 && !this.started) {
            this.startGame();
        }
    }

    private startGame() {
        
        console.log('started game');
        this.started = true;
    
        this.io.to(this.name).emit('start', 'Game Started!');

        this.io.on('guessed', (socket) => {
            console.log('received');    
        });

        this.players.forEach(player => {
            let pos = RandomRange(0, 2);
            player.emit('role', this.roles[pos]);
        });
    }

    private cardGuessed() {
        console.log('Card Guessed!');
    }

    private skipCard() {
        console.log('Skiped Card!');
    }
}