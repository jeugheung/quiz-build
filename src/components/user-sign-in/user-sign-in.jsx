import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import './user-sign-in.css';
import suLogo from '../../assets/suLogo.png'
import formLogo from '../../assets/formLogo.png'
import axios from 'axios';

const UserSignIn = () => {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
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

  const userAdmin = () => {
    navigate('/admin');
  }


  const userConnection = () => {
    const userId = generateId()
    socket.current = new WebSocket(socketUrl);
    socket.current.onopen = () => {
      console.log('Connected')
      setConnected(true);
      const message = {
        event: "connection",
        username,
        id: userId,
      };
      socket.current.send(JSON.stringify(message));
      axios.post(`${apiUrl}/users`, {
        username,
        points: 0,
        room_id: roomId,
        id: userId,
      })
      .then(response => {
        console.log('User created:', response.data);
        navigate(`/user-game?roomId=${roomId}&userId=${userId}`);
      })
      .catch(error => {
        console.error('Error creating user:', error.response.data);
      });
      
    };
    socket.current.onmessage = (event) => {
    };

    socket.current.onerror = () => {
      console.log("Socket произошла ошибка");
    };

  }

  

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
        <button className='user-sign__form-btn' onClick={userConnection}>Войти</button>
        <button className='user-sign__form-btn-admin' onClick={userAdmin}>Администратор</button>
      </div>
    </div>
  );
}

export default UserSignIn;
