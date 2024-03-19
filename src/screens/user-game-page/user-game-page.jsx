import React, {useEffect, useState, useRef} from 'react';
import './user-game-page.css'
import Header from '../../components/header/header';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useWebSocket } from '../../shared/WebSocketContext';
import {ThreeDots, RotatingSquare} from 'react-loader-spinner'
import { Helmet } from 'react-helmet';

const UserGamePage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const roomId = searchParams.get('roomId');

  const [question, setQuestion] = useState();
  // const [currentUser, setCurrentUser] = useState()
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const socket = useRef();
  const [userData, setUserData] = useState(null);
  const [gameData, setGameData] = useState()

  const [answerLoading, setAnswerLoading] = useState(false)
  const apiUrl = process.env.REACT_APP_API
  const socketUrl = process.env.REACT_APP_SOCKET

  const fetchUserData = async () => {
    try {
      // Выполняем GET-запрос для получения информации о пользователе по его id
      const response = await axios.get(`${apiUrl}/user/${userId}`);
      console.log('USER DATA BY ID', response.data)
      // Устанавливаем полученные данные в state
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchGameData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/games/${roomId}`);
      setGameData(response.data);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  useEffect(() => {
    console.log("USER ID",userId)
    socket.current = new WebSocket(socketUrl);
    socket.current.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Message from USE EFFECT user game', message);
    if (message.event == 'start_game') {
      setGameData(message.question)
      setAnswerSubmitted(false)
    } else if (message.event == 'end_step') {
      console.log(message.winner)
      setGameData(null)
      fetchUserData()
    }
  
    }

    return () => {
      socket.current.close();
    };
    
  }, []);

  useEffect(() => {
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
      socket.current.send(JSON.stringify(message));
      setAnswerLoading(false)
      setAnswerSubmitted(true)
    })
    .catch(error => {
      console.error('Ошибка запроса:', error.message);
      setAnswerLoading(false)
      alert(error.message); // Выводим сообщение об ошибке пользователю
    });
  }

  return (
    <main className='user-game'>
      <Helmet>
        <title>{userData ? userData.username : "User..."}</title>
      </Helmet>
      <Header />
      <div className='user-game__container'>

        <div className='user-game__question-container'>

          <div className='user-game__user-info'>
            {userData ? (
                <>
                  <div className='user-game__top-room'>
                    <span className='user-game__room-title'>Номер комнаты {userData ? userData.room_id : '...'}</span>
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

          {(gameData && gameData.game_step !== 0) ? (
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
