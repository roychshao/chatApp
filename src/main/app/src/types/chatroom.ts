import { user } from './user';
import { message } from './message';

export type chatroom = {
    roomId: string,
    roomName: string,
    users: user[],
    messages: message[]
}

export const nullChatroom = {
    roomId: "",
    roomName: "",
    users: [] as user[],
    messages: [] as message[]
}
