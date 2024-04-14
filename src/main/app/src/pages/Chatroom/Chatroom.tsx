import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { RootState } from '../../store';
import { List, Input, Button, Layout,
         Row, Col, Divider, Avatar } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { getChatroomById } from '../../store/slice/chatroomSlice';
import { chatroom } from '../../types/chatroom';
import { message } from '../../types/message';

const { Footer, Content } = Layout;

const Chatroom: React.FC = () => {

    const dispatch = useDispatch();
    const userId = useSelector((state: RootState) => state.session.sessions.userId);
    const gender = useSelector((state: RootState) => state.session.sessions.gender);
    const roomId = useSelector((state: RootState) => state.session.sessions.selectedRoomId);
    const [inputMessage, setInputMessage] = useState<string>('');
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
        brokerURL: 'ws://localhost:8080/socket',
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
        client.publish({ destination: `/topic/${roomId}/messages`, body: JSON.stringify(messageContent)});
    };

    client.activate();

    const handleSendMessage = () => {
        var message: message = {
            messageId: '',
            content: inputMessage,
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
            <Content
                style={{
                    minHeight: '83vh'
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
            <Divider />
            <Footer>
                <Row align={'middle'}>
                        <Col span={2}>
                            <FileAddOutlined style={{ fontSize: '18px' }} />
                        </Col>
                        <Col span={18}>
                            <Input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
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
