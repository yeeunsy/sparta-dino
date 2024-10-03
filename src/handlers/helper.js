import { CLIENT_VERSION } from "../constants.js";
import { setStage, getStage } from "../models/stage.model.js";
import { getUser, removeUser } from "../models/user.model.js";
import handlerMappings from "./handlerMapping.js";




export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`user Disconnected: ${socket.id}`);
    console.log("current users : ", getUser());
}


export const handleConnection = (socket, uuid) => {
    console.log(`New user Connect: ${uuid} with socket id ${socket.id}`);
    console.log('Current users: ', getUser());

    
    const { stages } = getGameAssets();

    // stages 배열 0번째 = 첫 번째 스테이지
    setStage(uuid, stages.data[0].id);

    console.log('stage: ', getStage(uuid));

    socket.emit('connection!', { uuid });

}


export const handlerEvent = (io, socket, data) => {
    //
    if ( !CLIENT_VERSION.includes(data.clientVersion) ) {
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