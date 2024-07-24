import { user } from "./user";
import { chatroom } from "./chatroom";

export type message = {
  messageId: string;
  content: string;
  fromUser: user;
  toUser: user;
  chatroom: chatroom;
  time: Date;
};
