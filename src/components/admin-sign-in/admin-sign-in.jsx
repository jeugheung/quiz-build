import React, { useState } from 'react';
import './admin-sign-in.css';
import suLogo from '../../assets/suLogo.png'
import formLogo from '../../assets/formLogo.png'
import { useNavigate } from 'react-router-dom';

const AdminSignIn = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginChange = (event) => {
    setLogin(event.target.value);
  };

  // Обработчик изменения в поле пароля
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignIn = () => {
    // Проверка на соответствие логина и пароля
    if (login === 'admin' && password === 'qwe123') {
      navigate('/admin-start');
    } else {
      alert('Неправильный логин или пароль');
    }
  };

  return (
    <div className='user-sign__form'>
      <img src={suLogo} alt='' className='user-sign__top-logo'></img>
      <img src={formLogo} alt='' className='user-sign__middle-logo'></img>
      <div className='user-sign__form-block'>
        <input
          className='user-sign__form-input'
          type='text'
          placeholder='Введите Логин'
          value={login}
          onChange={handleLoginChange}
        />
        <input
          className='user-sign__form-input'
          type='password'
          placeholder='Введите Пароль'
          value={password}
          onChange={handlePasswordChange}
        />
        <button className='user-sign__form-btn' onClick={handleSignIn}>
          Войти
        </button>
      </div>
    </div>
  );
}

export default AdminSignIn;
