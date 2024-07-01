import React, { useEffect, useState, useRef } from 'react';
import { List, Modal, Input, Space, Button, InputRef, Flex, Avatar, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getUserFriends, addUserFriend } from '../../store/slice/userSlice';
import { createChatroom, getUserChatrooms } from '../../store/slice/chatroomSlice';
import { UserAddOutlined, ItalicOutlined, MessageOutlined, CopyOutlined } from '@ant-design/icons';
import { user } from '../../types/user';
import { chatroom } from '../../types/chatroom';

interface AddUserModalProps {
  modalOpen: boolean;
  toggleModal: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = (props) => {
  const { modalOpen, toggleModal } = props;
  const friendIdRef = useRef<InputRef>(null);
  const userId = useSelector((state: RootState) => state.session.sessions.userId); 
  const dispatch = useDispatch();

  const handleAddFriend = () => {

    console.log("handleAddFriend");
    console.log(friendIdRef.current?.input?.value);
    let friendId = friendIdRef.current?.input?.value ?? '';
    let meAndFriend: user[] = [
      {
        userId: userId,
        name: "",
        age: 0,
        gender: "",
        email: "",
        password: ""
      },
      {
        userId: friendId,
        name: "",
        age: 0,
        gender: "",
        email: "",
        password: ""
      }
    ];
    dispatch(addUserFriend(meAndFriend)).then(() => {
      dispatch(getUserFriends(userId));
    });
    toggleModal();
  }

  return (
    <Modal title="Add Friend" open={modalOpen} onCancel={toggleModal} footer={null}>
      <Space.Compact style={{ width: '100%' }}>
        <Input placeholder="User ID" onPressEnter={handleAddFriend} ref={friendIdRef} />
        <Button type="primary" onClick={handleAddFriend}>add</Button>
      </Space.Compact>
    </Modal>
  )
}

const User: React.FC = () => {

  const userId = useSelector((state: RootState) => state.session.sessions.userId); 
  const dispatch = useDispatch();
  const friends = useSelector((state: RootState) => state.user.friends);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(getUserFriends(userId));
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const createChatroomSuccess = () => {
    messageApi.open({
      type: 'success',
      content: 'chatroom created successfully.',
    });
  }

  const copyUserIdSuccess = () => {
    messageApi.open({
      type: 'success',
      content: 'userId copied!',
    });
  }

  const handleCreateChatroom = (friendId: string) => {

    const chatroomData: chatroom = {
      roomId: "",
      roomName: userId + '/' + friendId,
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
      createChatroomSuccess();
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text).then(() => {
        copyUserIdSuccess();
      })
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div>
      {contextHolder}
      <Flex align='center' style={{ marginTop: '10px' }}>
        <ItalicOutlined style={{ fontSize: '20px' }} />
        <p style={{ marginLeft: '10px', overflowX: 'auto', maxWidth: '200px', scrollbarWidth: 'thin' }}>{userId}</p>
        <CopyOutlined style={{ marginLeft: '10px', fontSize: '15px' }} onClick={() => copyToClipboard(userId)}/>
      </Flex>
      <Flex align='center'>
        <UserAddOutlined onClick={toggleModal} style={{ fontSize: '20px' }} />
        <button style={{ marginLeft: '10px', backgroundColor: 'transparent', border: 'none' }} onClick={toggleModal}>Add Friend</button>
      </Flex>
      <List
        itemLayout="horizontal"
        dataSource={friends}
        header={<div>Friends</div>}
        style={{ width: '100%' }}
        renderItem={(friend: any) => (
          <Flex align='center'>
            <List.Item>
              <List.Item.Meta
                avatar={friend.gender === "male" ? <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=25" /> : <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=44" />}
                title={friend.name}
              />
            </List.Item>
            <MessageOutlined style={{ marginLeft: '75%', fontSize: '20px' }} onClick={() => handleCreateChatroom(friend.userId)} />
          </Flex>
        )}>
      </List>
      {modalOpen ? <AddUserModal modalOpen={modalOpen} toggleModal={toggleModal} /> : null}
    </div>
  );
}

export default User;
