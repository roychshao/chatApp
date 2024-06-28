/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './../../store/index.ts';
import Register from './../../pages/Register/Register.tsx';

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

describe('Register Page Component', () => {
  let store:any;
  
  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    });
  });

  test('renders Register Page components', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  test('calls handleRegister on form submit', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    const nameInput = screen.getByLabelText(/Name/i);
    await userEvent.type(nameInput, 'Test User');

    const ageInput = screen.getByLabelText(/Age/i);
    await userEvent.type(ageInput, '25');

    const genderSelect = screen.getByRole('combobox', { name: /Gender/i });
    await userEvent.selectOptions(genderSelect, 'female');

    const emailInput = screen.getByLabelText(/Email/i);
    await userEvent.type(emailInput, 'test@example.com');

    const passwordInput = screen.getByLabelText(/Password/i);
    await userEvent.type(passwordInput, 'password123');

    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    await userEvent.type(confirmPasswordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(submitButton);

    // redux action
    jest.spyOn(store.getDispatch(), 'dispatch').mockImplementation(() => {});

    // navigation
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => jest.fn(),
    }));

    await waitFor(() => {
      expect(store.getDispatch).toHaveBeenCalledWith(expect.any(Function)); // check for the call of register action
      expect(store.getDispatch).toHaveBeenCalledWith({ type: 'SET_USER_ID', payload: expect.any(String) }); // check for the call of setUserId action
      expect(store.getDispatch).toHaveBeenCalledWith({ type: 'SET_GENDER', payload: 'female' }); // check for the call of setGender action
      expect(store.getDispatch).toHaveBeenCalledWith({ type: 'NAVIGATE', payload: '/home' }); // check for the call of navigate action
    });
  })
});
