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
    
    @SubscribeMessage('startGame')
    async onStartGame(clientSocket, gameId){
        clientSocket.broadcast.
            to(gameId).emit('startGame', gameId);
    }

    //#region During Game
    @SubscribeMessage('sendChoices')
    async onSendChoice(clientSocket, data){
        const sessionId = data.sessionId;
        const choices = data.choices;
        clientSocket.broadcast.
            to(sessionId).emit('sendChoices', choices);
    }

    @SubscribeMessage('sendResponse')
    async onSendResponse(clientSocket, data){
        const sessionId = data.sessionId;
        const response = data.response;
        clientSocket.broadcast.
            to(sessionId).emit('sendResponse', response);
    }

    @SubscribeMessage('sendResult')
    async onSendResult(clientSocket, data){
        const sessionId = data.sessionId;
        const result = data.result;
        clientSocket.broadcast.
            to(sessionId).emit('sendResult', result);
    }

    @SubscribeMessage('sendEndOfQuestion')
    async onSendEndOfQuestion(clientSocket, sessionId){
        clientSocket.broadcast.
            to(sessionId).emit('sendEndOfQuestion', sessionId);
    }

    @SubscribeMessage('sendScore')
    async onScore(clientSocket, data){
        const sessionId = data.sessionId;
        const username = data.username;
        const score = data.score;
        clientSocket.broadcast.
            to(sessionId).emit('sendScore',
            {username: username, score:score});
    } 
    //#endregion
}