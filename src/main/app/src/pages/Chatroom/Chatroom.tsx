import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { RootState } from '../../store';
import { List, Input, Button, Layout,
         Row, Col, Avatar, 
         InputRef, Flex } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { getChatroomById } from '../../store/slice/chatroomSlice';
import { chatroom } from '../../types/chatroom';
import { message } from '../../types/message';
import { Header } from 'antd/es/layout/layout';

const { Footer, Content } = Layout;

const Chatroom: React.FC = () => {

    const dispatch = useDispatch();
    const userId = useSelector((state: RootState) => state.session.sessions.userId);
    const gender = useSelector((state: RootState) => state.session.sessions.gender);
    const roomId = useSelector((state: RootState) => state.session.sessions.selectedRoomId);
    const inputMessageRef = useRef<InputRef>(null);
    const chatroomData: chatroom = useSelector((state: RootState) => {
        const idx = state.chatroom.roomProfile.rooms.findIndex((room: chatroom) => {
            return room.roomId === roomId;
        });
        return state.chatroom.roomProfile.rooms[idx];
    });
    const toUserId = chatroomData.users.find(user => user.userId !== userId)?.userId || '';

    useEffect(() => {
        dispatch(getChatroomById(roomId));
    }, [])

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

    client.onConnect = (frame) => {
        console.log('Connected: ' + frame);
        client.subscribe(`/topic/${roomId}/messages`, (message) => {
            console.log('Received: ' + message.body);
        });
    };

    client.onStompError = (frame) => {
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
    };

    const sendMessage = (messageContent: message) => {
        client.publish({ destination: `/socket/${roomId}/messages`, body: JSON.stringify(messageContent)});
    };

    client.activate();

    const handleSendMessage = () => {
        var message: message = {
            messageId: '',
            content: inputMessageRef.current?.input?.value || '',
            fromUser: {
                userId: userId,
                name: '',
                age: 0,
                gender: '',
                email: '',
                password: '',
            },
            toUser: {
                userId: toUserId,
                name: '',
                age: 0,
                gender: '',
                email: '',
                password: '',
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
                    renderItem={(message) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={gender === 'male' ? 
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
