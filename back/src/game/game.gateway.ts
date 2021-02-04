import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { User } from '../user/user.entity';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway implements  OnGatewayConnection,
                                        OnGatewayDisconnect {
    constructor(private readonly gameService: GameService) {}
    @WebSocketServer() server;
    
    async handleConnection(sessionId:any){
        // Notify connected clients of current users
    }
    async handleDisconnect(sessionId:any){
        // Notify connected clients of current users
    }    

    //Handle Lobby
    @SubscribeMessage('joinLobby')
    async onJoinLobby(clientSocket, data){
        const userId=data[0];
        const gameId=data[1];
        clientSocket.join(gameId);
        clientSocket.broadcast.
            to(gameId).emit('joinLobby', userId);
    }

    @SubscribeMessage('quitGame')
    async onQuitGame(clientSocket, data){
        const userId=data[0];
        const gameId=data[1];
        clientSocket.broadcast.
            to(gameId).emit('quitGame', userId);

        clientSocket.leave(gameId);
    }

    @SubscribeMessage('killGame')
    async onKillGame(clientSocket, gameId){
        clientSocket.broadcast.
            to(gameId).emit('killGame', gameId);

        clientSocket.leave(gameId);
    }
}