import { Server, Socket } from "socket.io";
var randomWords = require('random-words');

const playsPerTurn = 10;
const roles = ['sandman', 'good guy', 'bad guy', 'guesser'];

interface ConnectedUserProps {
    username: string,
    socket: Socket
}

export class Room {

    private players: Array<{username: string, id: string}> = new Array();
    private clients: Array<Socket> = new Array();
    private playersConnected = 0;
    
    private deck: string[] = [];
    private cardsGuessed: string[] = [];
    private currentCardIndex = 0;
    private currentCard: string = '';
    
    private started: boolean = false;
    private numberOfTurns = 0;
    private turnsPlayed = 0;
    private guesserIndex = 0;
    private guesses = 0;
    private skips = 0;
    
    private badGuys: Array<string> = [];
    private goodGuys: Array<string> = [];
    private sadmans: Array<string> = [];

    private lastRoleIndex = 0;

    constructor(private name: string, private numberOfPlayers: number, private io: Server) { }

    getName() {
        return this.name;
    }

    getNumberOfPlayers() {
        return this.numberOfPlayers;
    }

    getCapacity() {
        return `${this.playersConnected}/${this.numberOfPlayers}`;
    }

    isGameStarted() {
        return this.started;
    }

    add({username, socket}: ConnectedUserProps) {
        if (!this.clients.includes(socket) && this.numberOfPlayers > this.playersConnected) {
            this.clients.push(socket);

            this.players.push({username: username, id: socket.id});

            socket.on('guessed', () => this.handleGuess());
            socket.on('skipped', () => this.handleSkipCard());
            socket.on('start', () => this.startGame());

            socket.on("disconnect", () => {this.handleClientDisconnect(socket)});

            console.log('New player just joined!', this.name);

            socket.join(this.name);

            this.io.to(this.name).emit('players_changed', {players: this.players.map(player => player.username)});

            this.playersConnected++;
            console.log(this.playersConnected);
        }
    }

    private handleGuess() {
        console.log('Dreamer guessed, picking another card!');
        this.guesses;
        this.cardsGuessed.push(this.currentCard);
        this.drawCard();
    }

    private handleSkipCard() {
        console.log('Uuuh dreamer asked for another card');
        this.skips++;
        this.drawCard();
    }

    private handleClientDisconnect(socket: Socket) {
        const disconnectPlayerIndex = this.clients.indexOf(socket);
        console.log('Client disconnected', disconnectPlayerIndex);

        if(disconnectPlayerIndex > -1) {
            this.players.splice(disconnectPlayerIndex, 1);
            this.playersConnected--;
            this.numberOfTurns--;
            this.guesserIndex--;
        }

        if(disconnectPlayerIndex === this.guesserIndex) {
            this.endTurn();
        }

        this.io.to(this.name).emit('players_changed', {players: this.players.map(player => player.username)});
    }

    private startGame() {
        console.log('Starting game...');
        this.started = true;
        this.turnsPlayed = 0;
    
        this.io.to(this.name).emit('start', 'Game Started!');

        this.numberOfTurns = this.playersConnected;

        this.newTurn();
    }

    private newTurn() {
        this.currentCardIndex = -1;
        this.lastRoleIndex = -1;
        this.deck = randomWords(10);

        this.sortRoles();
        this.drawCard();
    }

    private sortRoles() {
        this.clients.forEach(socket => {
            let role = '';

            if(socket === this.clients[this.guesserIndex]) {
                role = roles[3];
            } else {
                role = this.getRole();
            }
            
            socket.emit('role', { role: role});
        });
    }

    private getRole(): string {
        if(this.lastRoleIndex === 2){
            this.lastRoleIndex = -1;
        }

        return roles[++this.lastRoleIndex];
    }
    private drawCard() {
        this.currentCardIndex++;
        if (this.deckHasCards()) {
            this.currentCard = this.deck[this.currentCardIndex];
            this.io.to(this.name).emit('card', { card: this.currentCard });
        } else {
            this.endTurn();
        }
    }
    
    private deckHasCards() : boolean {
        return this.currentCardIndex < playsPerTurn;
    }

    private endTurn() {
        this.turnsPlayed++;
        if(this.isLastTurn()) {
            this.endGame();
        } else {
            this.guesserIndex++;
            this.newTurn();
        }
    }

    private isLastTurn() : boolean{
        return this.turnsPlayed >= this.numberOfTurns
    }

    private endGame() {

    }

}