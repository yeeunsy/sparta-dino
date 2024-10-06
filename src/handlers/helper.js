import { CLIENT_VERSION } from "../constants.js";
import { setStage, getStage } from "../models/stage.model.js";
import { getUser, removeUser } from "../models/user.model.js";
import handlerMappings from "./handlerMapping.js";



// 유저 접속 해제 시
export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`user Disconnected: ${socket.id}`);
    console.log("current users : ", getUser());
}

// 유저 접속
export const handleConnection = (socket, uuid) => {
    console.log(`New user Connect: ${uuid} with socket id ${socket.id}`);
    console.log('Current users: ', getUser());

    // 스테이지 빈 배열 생성
    createStage(uuid);

    //
    socket.emit('connection!', { uuid });

}

// 클라 버전 검증
export const handlerEvent = (io, socket, data) => {

    //
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', { status: 'fail', message: "Client version mismatch" });
        return
    }

    const handler = handlerMappings[data.handlerId];

    if (!handler) {
        socket.emit('response', { status: 'fail', message: "handler not found" })
        return
    }

    const response = handler(data.userId, data.payload);

    if (response.broadcast) {
        io.emit('response', 'broadcast');
        return
    }

    socket.emit('response', response);
}