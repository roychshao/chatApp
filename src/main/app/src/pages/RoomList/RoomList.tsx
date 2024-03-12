import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getUserChatrooms, createChatroom } from '../../store/slice/chatroomSlice';
import { chatroom } from '../../types/chatroom';


const RoomList: React.FC = () => {
 
  const userId = localStorage.getItem('userId')?.slice(1, -1) || '';
  const dispatch = useDispatch();
  const roomProfile = useSelector((state: RootState) => state.chatroom.roomProfile);
  const friendIdRef = useRef<HTMLInputElement>(null);
  const newRoomNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(getUserChatrooms(userId));
  }, []);

  const handleCreateChatroom = () => {
    console.log('create a new chatroom');
    
    var newRoomName = newRoomNameRef.current?.value || '';
    var friendId = friendIdRef.current?.value || '';

    console.log(newRoomName, friendId, );

    const chatroomData: chatroom = {
      roomId: "",
      roomName: newRoomName,
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
          userId: friendId,
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

  return (
    <div>
      <div>RoomList</div>
      <p>welcome, { userId } !</p>
      <form>
        <input type="text" placeholder="the id of the friend you want to make a chatroom with" ref={friendIdRef} />
        <input type="text" placeholder="the name of the chatroom" ref={newRoomNameRef} />
      </form>
      <button onClick={handleCreateChatroom}>
        create a new chatroom
      </button>
      <div className="tw flex flex-col gap-4">
        {roomProfile.rooms.map((room) => (
          <RoomItem
            key={room.roomId}
            room={room}
          />
        ))}
      </div>
    </div>
  );
}

const RoomItem: React.FC<{ room: chatroom }> = ({ room }) => {
  return (
    <div>
      {room.roomName}
    </div>
  );
}


export default RoomList;
