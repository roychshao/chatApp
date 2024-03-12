import { user } from './user';
import { message } from './message';

export type chatroom = {
    roomId: string,
    roomName: string,
    users: user[],
    messages: message[]
}
