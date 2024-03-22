import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, List, Form, Input, Button } from 'antd';
import { RootState } from '../../store';
import { getUserChatrooms, createChatroom } from '../../store/slice/chatroomSlice';
import { chatroom } from '../../types/chatroom';


const RoomList: React.FC = () => {
 
  const userId = sessionStorage.getItem('userId')?.slice(1, -1) || '';
  const dispatch = useDispatch();
  const roomProfile = useSelector((state: RootState) => state.chatroom.roomProfile);
  const friendIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(getUserChatrooms(userId));
  }, []);

  const handleCreateChatroom = (values: any) => {
    
    const chatroomData: chatroom = {
      roomId: "",
      roomName: userId + '/' + values.friendId,
      users: [
        {
          userId: userId,
          name: "",
          age: 0,
          gender: "",
          email: "",
          password: "",
        },
        {
          userId: values.friendId,
          name: "",
          age: 0,
          gender: "",
          email: "",
          password: "",
        }
      ],
      messages: []
    }
    dispatch(createChatroom(chatroomData)).then(() => {
      dispatch(getUserChatrooms(userId));
    })
  } 

  /* fake data*/
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
  //     messages: []
  //   },
  //   {
  //     roomId: "2",
  //     roomName: "room2",
  //     users: [
  //       {
  //         userId: "3",
  //         name: "user3",
  //         age: 3,
  //         gender: "male",
  //         email: "333@gmail.com",
  //         password: "333",
  //       },
  //       {
  //         userId: "4",
  //         name: "user4",
  //         age: 4,
  //         gender: "female",
  //         email: "444@gmail.com",
  //         password: "444",
  //       }
  //     ],
  //     messages: []
  //   }
  // ]

// TODO: use icon, dialog to add friend id
// TODO: react-infinite-scroll-component in List, antd
// TODO: button navigation bar with multiple function (personal page, chatroom list, posts and so on. if have)

  return (
    <Flex justify="flex-start" align="center" style={{ height: '100vh' }} vertical>
      <div>RoomList</div>
      <p>welcome, { userId } !</p>
      <Form
        name="create chatroom"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout='inline'
        initialValues={{ size: 'small' }}
        onFinish={handleCreateChatroom}
        style={{ width: '50%', maxWidth: '400px' }}
        size="small"
      >
        <Form.Item
          label="add friend Id"
          name="friendId"
          rules={[{ required: false, message: 'Please enter Id of a friend' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
          <Button type="primary" htmlType="submit">
            create
          </Button>
        
        </Form.Item>
      
      </Form>
      <List
        itemLayout='horizontal'
        dataSource={roomProfile.rooms}
        header={<div>Room List</div>}
        bordered
        style={{ width: '80%', maxWidth: '800px' }}
        renderItem={(room) => (
          <List.Item>
            <List.Item.Meta
              title={room.roomName}
            />
          </List.Item>
        )}>
      </List>
    </Flex>
  );
}


export default RoomList;
