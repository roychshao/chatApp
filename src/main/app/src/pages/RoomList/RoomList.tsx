import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Avatar } from 'antd';
import { RootState } from '../../store';
import { getUserChatrooms } from '../../store/slice/chatroomSlice';
import { setSelectedRoomId } from '../../store/slice/sessionSlice';
import { chatroom } from '../../types/chatroom';

const RoomList: React.FC = () => {
 
  const dispatch = useDispatch();
  const roomProfile = useSelector((state: RootState) => state.chatroom.roomProfile);
  const userId = useSelector((state: RootState) => state.session.sessions.userId);

  useEffect(() => {
    dispatch(getUserChatrooms(userId));
  }, []);

  const getFriendGender = (room: chatroom) => {
    const friend = room.users.find((user) => user.userId !== userId);
    return friend?.gender;
  }

  return (
    <div>
      <List
        itemLayout='horizontal'
        dataSource={roomProfile.rooms}
        style={{ width: '100%' }}
        renderItem={(room) => {
          const lastMessage = room.messages.length > 0 ? room.messages[room.messages.length - 1].content : '';
          const maxLength = 44;
          return (
            <List.Item onClick={() => dispatch(setSelectedRoomId(room.roomId)) }>
              <List.Item.Meta
                avatar={getFriendGender(room) === "male" ? <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=25" /> : <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=44" />}
                title={room.roomName}
                description={lastMessage.length > maxLength ? `${lastMessage.slice(0, maxLength)}...` : lastMessage}
              />
            </List.Item>
          )
        }}>
      </List>
    </div>
  );
}


export default RoomList;
