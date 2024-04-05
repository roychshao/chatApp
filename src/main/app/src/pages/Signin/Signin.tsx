import React, { useEffect } from 'react';
import { Form, Input, Button, Flex } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { signin } from '../../store/slice/userSlice';
import { user } from './../../types/user';

const Signin: React.FC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userProfile = useSelector((state: RootState) => state.user.profile);


  useEffect(() => {
    if (userProfile.userId && userProfile.name) {
      console.log("register successfully and get user profile, userId: ", userProfile.userId);
      sessionStorage.setItem('userId', JSON.stringify(userProfile.userId));
      sessionStorage.setItem('name', JSON.stringify(userProfile.name));
      sessionStorage.setItem('gender', JSON.stringify(userProfile.gender));
      sessionStorage.setItem('email', JSON.stringify(userProfile.email));
      navigate('/home');
    }
  }, [userProfile, navigate]);

  const handleSignIn = (values: any) => {
    var userData: user = {
      userId: '',
      name: '',
      age: 0,
      gender: '',
      email: values.email,
      password: values.password
    }
    dispatch(signin(userData));
    if (userProfile) {
      navigate('/home');
    }
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
