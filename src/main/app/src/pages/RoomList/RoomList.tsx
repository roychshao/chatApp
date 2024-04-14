import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List } from 'antd';
import { RootState } from '../../store';
import { getUserChatrooms } from '../../store/slice/chatroomSlice';
import { setSelectedRoomId } from '../../store/slice/sessionSlice';

const RoomList: React.FC = () => {
 
  const dispatch = useDispatch();
  const roomProfile = useSelector((state: RootState) => state.chatroom.roomProfile);
  const userId = useSelector((state: RootState) => state.session.sessions.userId);

  useEffect(() => {
    dispatch(getUserChatrooms(userId));
  }, []);

  
  return (
    <div>
      <List
        itemLayout='horizontal'
        dataSource={roomProfile.rooms}
        header={<div>Room List</div>}
        style={{ width: '100%' }}
        renderItem={(room) => (
          <List.Item onClick={() => dispatch(setSelectedRoomId(room.roomId)) }>
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
