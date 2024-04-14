import React, { useEffect } from 'react';
import { Form, Input, Button, Flex, InputNumber, Radio } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { register } from '../../store/slice/userSlice';
import { user } from '../../types/user';
import { setUserId, setGender } from '../../store/slice/sessionSlice';

const Register: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userProfile = useSelector((state: RootState) => state.user.profile);

  useEffect(() => {
    if (userProfile.userId && userProfile.name) {
      console.log("register successfully and get user profile, userId: ", userProfile.userId);
      dispatch(setUserId(userProfile.userId));
      dispatch(setGender(userProfile.gender));
      navigate('/home');
    }
  }, [userProfile, navigate]);
  
  const handleRegister = (values: any) => {
    if (values.password !== values.confirmPassword) {
      console.log("password and confirm password not match");
      return;
    }
    var userData: user = {
      userId: '',
      name: values.name,
      age: values.age,
      gender: values.gender,
      email: values.email,
      password: values.password
    }
    dispatch(register(userData));
  }

  return (
    <Flex justify="center" align="center" style={{ height: '100vh' }} vertical>
      <h1>Register</h1>

      <Form
        name="register"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout='horizontal'
        initialValues={{ size: 'large' }}
        onFinish={handleRegister}
        style={{ width: '80%', maxWidth: '800px' }}
        size="large"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[{ required: true, message: 'Please input your age' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Please chose your gender' }]}
        >
          <Radio.Group>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </Radio.Group>
        </Form.Item>

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

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: 'Please confirm your password' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        
        </Form.Item>
      </Form>

      <div>
        <p>
          Already have an account?{' '}
          <Link to='/' className="text-blue-500 hover:underline">
            Signin here
          </Link>
        </p>
      </div>
    </Flex>
  );
};

export default Register;
