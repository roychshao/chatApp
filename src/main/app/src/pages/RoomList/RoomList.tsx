import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List } from 'antd';
import { RootState } from '../../store';
import { getUserChatrooms } from '../../store/slice/chatroomSlice';

const RoomList: React.FC = () => {

  const userId = sessionStorage.getItem('userId')?.slice(1, -1) || '';
  const dispatch = useDispatch();
  const roomProfile = useSelector((state: RootState) => state.chatroom.roomProfile);

  useEffect(() => {
    dispatch(getUserChatrooms(userId));
  }, []);

  
  // const handleCreateChatroom = (values: any) => {

  //   const chatroomData: chatroom = {
  //     roomId: "",
  //     roomName: userId + '/' + values.friendId,
  //     users: [
  //       {
  //         userId: userId,
  //         name: "",
  //         age: 0,
  //         gender: "",
  //         email: "",
  //         password: "",
  //       },
  //       {
  //         userId: values.friendId,
  //         name: "",
  //         age: 0,
  //         gender: "",
  //         email: "",
  //         password: "",
  //       }
  //     ],
  //     messages: []
  //   }
  //   dispatch(createChatroom(chatroomData)).then(() => {
  //     dispatch(getUserChatrooms(userId));
  //   })
  // } 

  /* fake data, 70 lines */
  // const testRooms: chatroom[] = [
  //   {
  //     roomId: "1",
  //     roomName: "room1",
  //     users: [
  //       {
  //         userId: "1",
  //         name: "user1",
  //         age: 1,
  //         gender: "male",
  //         email: "111@gmail.com",
  //         password: "111",
  //       },
  //       {
  //         userId: "2",
  //         name: "user2",
  //         age: 2,
  //         gender: "female",
  //         email: "222@gmail.com",
  //         password: "222",
  //       }
  //     ],
  //     messages: [
  //       {
  //         messageId: "m1",
  //         content: "I am the test content m1",
  //         fromUser: {
  //           userId: "1",
  //           name: "user1",
  //           age: 1,
  //           gender: "male",
  //           email: "111@gmail.com",
  //           password: "111",
  //         },
  //         toUser: {
  //           userId: "2",
  //           name: "user2",
  //           age: 2,
  //           gender: "female",
  //           email: "222@gmail.com",
  //           password: "222",
  //         },
  //         chatroom: nullChatroom,
  //         time: new Date(),
  //       },
  //       {
  //         messageId: "m2",
  //         content: "I am the test content m2",
  //         fromUser: {
  //           userId: "2",
  //           name: "user2",
  //           age: 2,
  //           gender: "female",
  //           email: "222@gmail.com",
  //           password: "222",
  //         },
  //         toUser: {
  //           userId: "1",
  //           name: "user1",
  //           age: 1,
  //           gender: "male",
  //           email: "111@gmail.com",
  //           password: "111",
  //         },
  //         chatroom: nullChatroom,
  //         time: new Date(),
  //       }
  //     ]
  //   },
  // ]


  return (
    <div>
      <List
        itemLayout='horizontal'
        dataSource={roomProfile.rooms}
        header={<div>Room List</div>}
        style={{ width: '100%' }}
        renderItem={(room) => (
          <List.Item>
            <List.Item.Meta
              title={room.roomName}
              description={room.messages.length > 0 ? room.messages[room.messages.length - 1].content : ''}
            />
          </List.Item>
        )}>
      </List>
    </div>
  );
}


export default RoomList;
