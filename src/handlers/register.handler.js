//
import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

// 대기 함수

const registerHandler = (io) => {
    io.on('connection', (socket) => {


        const userUUID = uuidv4();
        addUser({ uuid: userUUID, socketId: socket.id });

        handleConnection(socket, userUUID);

        socket.on('event', (data) => handlerEvent(io, socket, data));

        // 접속 해제 시
        // 하나의 유저를 대상으로 하는 이벤트
        socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID));
    })
}






export default registerHandler;