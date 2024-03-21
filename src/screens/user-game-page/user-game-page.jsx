import React, {useEffect, useState, useRef} from 'react';
import './user-game-page.css'
import Header from '../../components/header/header';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {ThreeDots, RotatingSquare, ThreeCircles} from 'react-loader-spinner'
import { Helmet } from 'react-helmet';
import io from 'socket.io-client';

const UserGamePage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const roomId = searchParams.get('roomId');

  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [loading, setLoading] = useState(true)
  const socketRef = useRef();
  const [userData, setUserData] = useState(null);
  const [gameData, setGameData] = useState()

  const [answerLoading, setAnswerLoading] = useState(false)
  const apiUrl = process.env.REACT_APP_API
  const socketUrl = process.env.REACT_APP_SOCKET

  // WebSocket 
  const [connected, setConnected] = useState(false)


  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/user/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchGameData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/games/${roomId}`);
      setGameData(response.data);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching game data:', error);
      setLoading(false)
    }
  };

  useEffect(() => {
    socketRef.current = io(socketUrl);

    socketRef.current.on('connect', () => {
      setConnected(true);
      console.log('Подключение установлено');
    });

    socketRef.current.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      console.log('Message from USE EFFECT user game', parsedMessage);
      if (parsedMessage.event === 'start_game') {
        console.log(parsedMessage);
        window.location.reload();
      } else if (parsedMessage.event === 'end_step') {
        console.log(parsedMessage.winner);
        setGameData(null);
        fetchGameData();
        fetchUserData();
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Соединение закрыто');
      setConnected(false);
    });

    socketRef.current.on('error', (error) => {
      console.error('Ошибка сокета:', error);
      alert('ERROR');
      setConnected(false);
    });

    fetchGameData();
    fetchUserData();
  }, []);

  
  const handleAnswerClick = () => {
    setAnswerLoading(true)
    const requestBody = {
      room_id: roomId,
      user_id: userId,
      answer: 'a',
      username: userData.username,
    };

    fetch(`${apiUrl}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message || 'Произошла ошибка на сервере');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Ответ сервера:', data);
      const message = {
        event: "user_answer",
        user: userData
      };
      console.log(message)
      socketRef.current.emit('message', JSON.stringify(message));
      setAnswerLoading(false)
      setAnswerSubmitted(true)
     
    })
    .catch(error => {
      console.error('Ошибка запроса:', error.message);
      setAnswerLoading(false)
      alert(error.message); // Выводим сообщение об ошибке пользователю
    });
  }

  if (loading) {
    return (
      <div className='answers-loader-container'>
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <main className='user-game'>
      <Helmet>
        <title>{userData ? userData.username : "User..."}</title>
      </Helmet>
      <Header type={"user"}/>
      <div className='user-game__container'>

        <div className='user-game__question-container'>

          <div className='user-game__user-info'>
            {userData ? (
                <>
                  <div className='user-game__top-room'>
                    <span className='user-game__room-title'>Номер комнаты: {userData ? userData.room_id : '...'}</span>
                    <span className='user-game__room-title'>Текущий ход - {gameData ? gameData.game_step : 0}</span>
                  </div>
                  <div className='user-game__info_block'>
                    <div className='user-game__info_item'>
                      <span className='user-game__info-title'>Имя пользователя:</span>
                      <span className='user-game__info-value'>{userData.username}</span>
                    </div>
                    <div className='user-game__info_item'>
                      <span className='user-game__info-title'>ID:</span>
                      <span className='user-game__info-value'>{userData.user_id}</span>
                    </div>
                    <div className='user-game__info_item'>
                      <span className='user-game__info-title'>Ваши баллы:</span>
                      <span className='user-game__info-value'>{userData.points}</span>
                    </div>
                  </div>
                </>

            ) : (
              <div className='user-game__three-dots'>
                <ThreeDots
                  visible={true}
                  height="60"
                  width="60"
                  color="black"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            )}

          </div>

          {(gameData != null && gameData.game_step !== 0) ? (
            <div className='user-game__question'>
              <span className='user-game__points'>Вопрос на {gameData.points}</span>
              <div className='user-game__question-block'>
                <span className='user-game__category'>Тема : {gameData.category}</span>
                <span className='user-game__task'>{gameData.current_question_kz || gameData.question_kz}</span>
                <div className='user-game__divider-line'></div>
                <span className='user-game__task'>{gameData.current_question_ru || gameData.question_ru}</span>
              </div>
              {answerSubmitted ? (
                <button className='user-game__reply-btn__submitted' disabled>Вы ответили</button>
              ) : (
                <button className='user-game__reply-btn' onClick={() => handleAnswerClick()} disabled={answerLoading}>
                  {answerLoading ? (
                    <ThreeDots
                      visible={true}
                      height="60"
                      width="60"
                      color="white"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    <span>Ответить</span>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className='user-game__no-question'>
              <span>Ожидайте ответа администратора</span>
              <RotatingSquare
                visible={true}
                height="35"
                width="35"
                color="white"
                ariaLabel="rotating-square-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default UserGamePage;
