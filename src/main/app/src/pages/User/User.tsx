import React, { useEffect, useState, useRef } from 'react';
import { List, Modal, Input, Space, Button, InputRef, Flex } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getUserFriends, addUserFriend } from '../../store/slice/userSlice';
import { UserAddOutlined, ItalicOutlined } from '@ant-design/icons';
import { user } from '../../types/user';

interface AddUserModalProps {
  modalOpen: boolean;
  toggleModal: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = (props) => {
  const { modalOpen, toggleModal } = props;
  const friendIdRef = useRef<InputRef>(null);
  const userId = sessionStorage.getItem('userId')?.slice(1, -1) || '';
  const dispatch = useDispatch();

  const handleAddFriend = () => {

    console.log("handleAddFriend");
    console.log(friendIdRef.current?.input?.value);
    var friendId = friendIdRef.current?.input?.value || '';
    var meAndFriend: user[] = [
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
    <>
      <Modal title="Add Friend" open={modalOpen} onCancel={toggleModal} footer={null}>
        <Space.Compact style={{width: '100%'}}>
          <Input placeholder="User ID" ref={friendIdRef}/>
          <Button type="primary" onClick={handleAddFriend}>add</Button>
        </Space.Compact> 
      </Modal>
    </>  
  )
}

const User: React.FC = () => {

  const userId = sessionStorage.getItem('userId')?.slice(1, -1) || '';
  const dispatch = useDispatch();
  const friends = useSelector((state: RootState) => state.user.friends); 

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getUserFriends(userId));
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  return (
    <div>
      <Flex align='center' style={{ marginTop:'10px' }}> 
        <ItalicOutlined style={{ fontSize: '20px' }}/>
        <p style={{ marginLeft: '10px' }}>{userId}</p>
      </Flex>
      <Flex align='center'>
        <UserAddOutlined onClick={toggleModal} style={{ fontSize: '20px' }}/>
        <p style={{ marginLeft: '10px' }}>Add Friend</p>
      </Flex>
      <List
        itemLayout="horizontal"
        dataSource={friends}
        header={<div>Friends</div>}
        style={{ width: '100%' }}
        renderItem={(friend: any) => (
          <List.Item>
            <List.Item.Meta
              title={friend.name}
            />
          </List.Item>
        )}>
      </List>
      { modalOpen ? <AddUserModal modalOpen={modalOpen} toggleModal={toggleModal}/> : null }
    </div>
  );
}

export default User;
