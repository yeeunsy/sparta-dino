import { getUser, removeUser } from "../models/user.model.js";




export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`user Disconnected: ${socket.id}`);
    console.log("current users : ", getUser());
}


export const handleConnection = (socket, uuid) => {
    console.log(`New user Connect: ${uuid} with socket id ${socket.id}`);
    console.log('Current users: ', getUser());

    

}