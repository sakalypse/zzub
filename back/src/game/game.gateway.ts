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
        const roomCode=data[1];
        clientSocket.join(roomCode);
        clientSocket.broadcast.to(roomCode).emit('joinLobby', userId);
    }

    @SubscribeMessage('quitGame')
    async onQuitGame(clientSocket, data){
        const userId=data[0];
        const roomCode=data[1];
        clientSocket.broadcast.
            to(roomCode).emit('quitGame', userId);

        clientSocket.leave(roomCode);
    }

    @SubscribeMessage('killGame')
    async onKillGame(clientSocket, roomCode){
        clientSocket.broadcast.to(roomCode).emit('killGame', roomCode);
        clientSocket.leave(roomCode);
    }
    
    @SubscribeMessage('startGame')
    async onStartGame(clientSocket, roomCode){
        clientSocket.broadcast.
            to(roomCode).emit('startGame', roomCode);
    }

    //#region During Game
    @SubscribeMessage('rejoin')
    async onRejoin(clientSocket, roomCode){
        clientSocket.join(roomCode);
    }

    @SubscribeMessage('sendQuestion')
    async onSendChoice(clientSocket, data){
        this.server.in(data.roomCode).emit('sendQuestion',
            {
                question: data.question,
                roundIsMultipleChoice: data.roundIsMultipleChoice,
                choices:data.choices,
                extra:data.extra,
                packName:data.packName,
                numberQuestion:data.numberQuestion
            });
    }

    @SubscribeMessage('playerSendChoice')
    async onSendResponse(clientSocket, data){
        this.server.in(data.roomCode).emit('playerSendChoice', {userId: data.userId, choiceId:data.choiceId});
    }

    @SubscribeMessage('playerSendInputChoice')
    async onSendResponseInput(clientSocket, data){
        this.server.in(data.roomCode).emit('playerSendInputChoice', {userId: data.userId, inputChoice:data.inputChoice});
    }

    @SubscribeMessage('playerAnswered')
    async onDisableCanAnswer(clientSocket, data){
        this.server.in(data.roomCode).emit('playerAnswered', {userId: data.userId, wrong: data.wrong});
    }

    @SubscribeMessage('endOfRound')
    async onEndOfRound(clientSocket, data){
        this.server.in(data.roomCode).emit('endOfRound', {});
    }
    //#endregion
}