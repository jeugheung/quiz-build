import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import './user-sign-in.css';
import suLogo from '../../assets/suLogo.png'
import formLogo from '../../assets/formLogo.png'
import axios from 'axios';
import {ThreeDots} from 'react-loader-spinner'
import { io } from 'socket.io-client';

const UserSignIn = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false); 
  const [roomId, setRoomId] = useState();
  const navigate = useNavigate();
  const socket = useRef();

  const apiUrl = process.env.REACT_APP_API
  const socketUrl = process.env.REACT_APP_SOCKET

  function generateId() {
    let id = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    
    for (let i = 0; i < 10; i++) {
      id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return id;
  }

  
const userConnection = () => {
  if (!roomId || !username) {
    // Проверяем, пустые ли поля ввода и выводим alert, если хотя бы одно из них пустое
    alert("Пожалуйста, заполните все поля ввода");
    return; // Прерываем выполнение функции
  }
  setLoading(true);
  const userId = generateId();
  const socket = io(socketUrl);

  socket.on('connect', () => {
    console.log('Connected');

    const message = {
      event: "connection",
      username,
      id: userId,
    };
    socket.emit('message', JSON.stringify(message)); // Отправляем сообщение на сервер

    axios.post(`${apiUrl}/users`, {
      username,
      points: 0,
      room_id: roomId,
      id: userId,
    })
    .then(response => {
      console.log('User created:', response.data);
      setTimeout(() => {
        setLoading(false);
        navigate(`/user-game?roomId=${roomId}&userId=${userId}`);
      }, 500);
    })
    .catch(error => {
      console.error('Error creating user:', error.response.data);
      setLoading(false);
    });
  });

  socket.on('error', () => {
    console.log("Socket произошла ошибка");
  });
};

  

  return (
    <div className='user-sign__form'>
      <img src={suLogo} alt='' className='user-sign__top-logo'></img>
      <img src={formLogo} alt='' className='user-sign__middle-logo'></img>
      <div className='user-sign__form-block'>
        <input 
          className='user-sign__form-input' 
          type='text' 
          placeholder='Введите номер игры'
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <input 
          className='user-sign__form-input' 
          type='text' 
          placeholder='Введите имя'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className='user-sign__form-btn' onClick={userConnection} disabled={loading}>
          {loading ? (
              <ThreeDots
                  visible={true}
                  height="30"
                  width="30"
                  color="white"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                <span>Войти</span>
              )}
        </button>
      </div>
    </div>
  );
}

export default UserSignIn;
