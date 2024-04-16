import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { RootState } from '../../store';
import { List, Input, Button, Layout,
  Row, Col, Avatar, 
  InputRef, Flex } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { getChatroomById, appendMessage } from '../../store/slice/chatroomSlice';
import { chatroom } from '../../types/chatroom';
import { message } from '../../types/message';
import { Header } from 'antd/es/layout/layout';

const { Footer, Content } = Layout;

const Chatroom: React.FC = () => {

  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.session.sessions.userId);
  const roomId = useSelector((state: RootState) => state.session.sessions.selectedRoomId);
  const inputMessageRef = useRef<InputRef>(null);
  const chatroomData: chatroom = useSelector((state: RootState) => {
    const idx = state.chatroom.roomProfile.rooms.findIndex((room: chatroom) => {
      return room.roomId === roomId;
    });
    return state.chatroom.roomProfile.rooms[idx];
  });
  const [wsClient, setWsClient] = useState<Client>(() => new Client());

  useEffect(() => {
    dispatch(getChatroomById(roomId));
    /*
    * configure client websocket
    */
    const client = new Client({
      brokerURL: 'ws://localhost:8080/chatApp',
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    var subscriptionId: any = null;
    client.onConnect = (frame) => {
      console.log('Connected: ' + frame);

      if (subscriptionId) {
        client.unsubscribe(subscriptionId);
      }

      subscriptionId = client.subscribe(`/topic/${roomId}/messages`, (message) => {
        console.log('Received: ' + message.body);
        const body = JSON.parse(message.body);
        dispatch(appendMessage({roomId,body}));
      });
    };

    client.onStompError = (frame) => {
      console.log('Broker reported error: ' + frame.headers['message']);
      console.log('Additional details: ' + frame.body);
    };


    client.activate();
    setWsClient(client);
    /*
    * websocket end
    */
    return () => {
      if (subscriptionId) {
        client.unsubscribe(subscriptionId);
      }
      client.deactivate();
    };
  }, [])

  const sendMessage = (messageContent: message) => {
    wsClient.publish({ destination: `/socket/${roomId}/messages`, body: JSON.stringify(messageContent)});
  };


  const handleSendMessage = () => {
    const me = chatroomData.users.find(user => user.userId === userId);
    const opponent = chatroomData.users.find(user => user.userId !== userId);
    var message: message = {
      messageId: '',
      content: inputMessageRef.current?.input?.value || '',
      fromUser: {
        userId: userId,
        name: me?.name || '',
        age: me?.age || 0,
        gender: me?.gender || '',
        email: me?.email || '',
        password: me?.password || '',
      },
      toUser: {
        userId: opponent?.userId || '',
        name: opponent?.name || '',
        age: opponent?.age || 0,
        gender: opponent?.gender || '',
        email: opponent?.email || '',
        password: opponent?.password || '',
      },
      chatroom: chatroomData,
      time: new Date()
    }
    sendMessage(message);
  }

  return (
    <Layout>
      <Header
        style={{
          height: '8vh'
        }}
      >
        <Flex align='center' justify='left' style={{ height: '100%' }}>
          <p style={{ color: 'white', fontSize: '20px' }}>{chatroomData?.roomName}</p>
        </Flex>
      </Header>
      <Content
        style={{
          height: '80vh'
        }}
      >
        <List
          dataSource={chatroomData.messages}
          style={{ overflowY: 'scroll' }}
          renderItem={(message) => (
            <List.Item>
              <List.Item.Meta
                avatar={message.fromUser.gender === 'male' ? 
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=25"/> : 
                  <Avatar src="https://api/dicebear.com/7.x/miniavs/svg?seed=44"/>
                }
                description={message.content}
              />
            </List.Item>
          )}
        />
      </Content>
      <Footer
        style={{
          height: '12vh'
        }}
      >
        <Row align={'middle'}>
          <Col span={2}>
            <FileAddOutlined style={{ fontSize: '18px' }} />
          </Col>
          <Col span={18}>
            <Input
              ref={inputMessageRef}
              placeholder='Type a message'
              size='large'
            />
          </Col>
          <Col span={3} offset={1}>
            <Button onClick={handleSendMessage} size='large'>Send</Button>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default Chatroom;
