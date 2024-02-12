import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { register } from '../../store/slice/userSlice';
import { user } from '../../types/user';

const Register: React.FC = () => {

  const dispatch = useDispatch();

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const userProfile = useSelector((state: RootState) => state.user.profile);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    var name = nameRef.current?.value || '';
    var age = ageRef.current?.valueAsNumber || 0;
    var gender = genderRef.current?.value || '';
    var email = emailRef.current?.value || '';
    var password = passwordRef.current?.value || '';
    var confirmPassword = confirmPasswordRef.current?.value || '';

    if (password == confirmPassword) {
      var userData: user = {
        userId: '',
        name: name,
        age: age,
        gender: gender,
        email: email,
        password: password
      }
      dispatch(register(userData));
    }
  }

  const inputFields = [
    { label: 'Name', id: 'name', type: 'text', ref: nameRef },
    { label: 'Age', id: 'age', type: 'number', ref: ageRef },
    { label: 'Gender', id: 'gender', type: 'text', ref: genderRef },
    { label: 'Email', id: 'email', type: 'email', ref: emailRef },
    { label: 'Password', id: 'password', type: 'password', ref: passwordRef },
    { label: 'Confirm Password', id: 'confirmPassword', type: 'password', ref: confirmPasswordRef },
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        <form onSubmit={handleRegister}>
          {inputFields.map((field) => (
            <div key={field.id} className="mb-4">
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-600">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                ref={field.ref}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                placeholder={`Enter your ${field.label.toLowerCase()}`}
              />
            </div>
          ))}
          <div className="mb-6">
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              register
            </button>
          </div>
        </form>
      </div>

      <p>{userProfile ? userProfile.userId : ''}</p>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-blue-500 hover:underline">
              SignIn here
            </Link>
          </p>
        </div>
    </div>
  );
};

export default Register;
