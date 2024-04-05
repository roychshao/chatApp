import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { List, Input, Button, Layout,
         Row, Col, Divider, Avatar } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { getChatroomById } from '../../store/slice/chatroomSlice';
import { chatroom } from '../../types/chatroom';

const { Footer, Content } = Layout;

interface ChatroomProps {
    roomId: string;
}

const Chatroom: React.FC<ChatroomProps> = (props) => {
    const { roomId } = props;
    const gender = sessionStorage.getItem('gender')?.slice(1, -1) || '';
    const [inputMessage, setInputMessage] = useState('');
    const dispatch = useDispatch();
    const chatroomData: chatroom = useSelector((state: RootState) => {
        const idx = state.chatroom.roomProfile.rooms.findIndex((room: chatroom) => {
            room.roomId == roomId;
        });
        return state.chatroom.roomProfile.rooms[idx];
    });

    useEffect(() => {
        dispatch(getChatroomById(roomId));
    }, [])

    const handleSendMessage = () => {

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
                                avatar={gender == 'male' ? 
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
