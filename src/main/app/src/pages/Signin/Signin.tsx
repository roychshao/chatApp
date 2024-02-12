import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { signin } from '../../store/slice/userSlice';
import { user } from './../../types/user';

const Signin: React.FC = () => {

  const dispatch = useDispatch();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const userProfile = useSelector((state: RootState) => state.user.profile);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    var email = emailRef.current?.value || '';
    var password = passwordRef.current?.value || '';
    var userData: user = {
      userId: '',
      name: '',
      age: 0,
      gender: '',
      email: email,
      password: password
    }
    dispatch(signin(userData));
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Signin</h1>

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              ref={emailRef}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              ref={passwordRef}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Sign In
            </button>
          </div>
        </form>

        <p>{userProfile ? userProfile.userId : ""}</p>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to='/register' className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
