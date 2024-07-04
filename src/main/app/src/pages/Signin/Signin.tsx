import React, { useEffect } from 'react';
import { Form, Input, Button, Flex } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { signin, register } from '../../store/slice/userSlice';
import { setUserId, setGender } from '../../store/slice/sessionSlice';
import { createChatroom } from '../../store/slice/chatroomSlice';
import { user } from './../../types/user';
import { chatroom } from '../../types/chatroom';
import axios from "axios";

const Signin: React.FC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userProfile = useSelector((state: RootState) => state.user.profile);

  useEffect(() => {
    if (userProfile.userId && userProfile.name) {
      console.log("register successfully and get user profile, userId: ", userProfile.userId);
      dispatch(setUserId(userProfile.userId));
      dispatch(setGender(userProfile.gender));
      
      // register an ai assistant automatically once login and has no ai assistant.
      const checkAssistant = async () => {
        await axios.get(`http://localhost:8080/api/user/${userProfile.userId}-assistant`, {
          withCredentials: true
        }).catch(e => { 
          if (e.response.status === 404) {
            let aiAssistantData: user = {
              userId: userProfile.userId + '-assistant',
              name: "🤖 AI assistant",
              age: 0,
              gender: userProfile.gender,
              email: '',
              password: ''
            }
            dispatch(register(aiAssistantData))
              .then(unwrapResult)
              .then(() => {
                // create AI chatroom
                const chatroomData: chatroom = {
                  roomId: "",
                  roomName: "🤖 AI assistant",
                  users: [
                    {
                      userId: userProfile.userId,
                      name: "",
                      age: 0,
                      gender: "",
                      email: "",
                      password: "",
                    },
                    aiAssistantData,
                  ],
                  messages: []
                }
                dispatch(createChatroom(chatroomData));
              })
          }
        })
      }

      checkAssistant();
      navigate('/home');
    }
  }, [userProfile, navigate]);

  const handleSignIn = (values: any) => {
    let userData: user = {
      userId: '',
      name: '',
      age: 0,
      gender: '',
      email: values.email,
      password: values.password
    }
    dispatch(signin(userData));
  }

  return (
    <Flex justify="center" align="center" style={{ height: '100vh' }} vertical>

      <h1>Signin</h1>

      <Form
        name="signin"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={{ size: 'large' }}
        onFinish={handleSignIn}
        style={{ width: '80%', maxWidth: '800px' }}
        size="large"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          <Button type="primary" htmlType="submit">
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <div>
        <p>
          Don't have an account?{' '}
          <Link to='/register' className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </Flex>
  );
};

export default Signin;
