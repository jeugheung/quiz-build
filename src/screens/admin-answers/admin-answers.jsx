import React, {useState, useEffect, useRef} from 'react';
// import './admin-dashboard.css'
import './admin-answers.css'
import Header from '../../components/header/header';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {ThreeCircles, ThreeDots} from 'react-loader-spinner'
import io from 'socket.io-client';

const AdminAnswersPage = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState([])

  const [winner, setWinner] = useState()
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const [selectedItem, setSelectedItem] = useState(null);
  const [gameData, setGameData] = useState();
  const [loading, setLoading] = useState(true)
  const [incorrectLoading, setIncorrectLoading] = useState(false)
  const [endGameLoader, setEndGameLoader] = useState(false)

  const socketRef = useRef();
  const apiUrl = process.env.REACT_APP_API
  const socketUrl = process.env.REACT_APP_SOCKET

  //WebSocket
  const [connected, setConnected] = useState(false)


  const handleClick = (user_id, username) => {
    console.log('SELECTED WINNER',user_id)
    setSelectedItem(user_id);
    setWinner(username)
  };

  const fetchGameData = async () => {
    try {
        const response = await axios.get(`${apiUrl}/games/${roomId}`);
        const gameData = response.data;
        console.log('Game data:', gameData);
        setGameData(gameData)
        setAnswers(gameData.answers)

        setQuestion(gameData)
        setTimeout(() => {
          setLoading(false);
        }, 500)
        // Здесь вы можете обновить состояние вашего компонента с полученными данными
    } catch (error) {
        console.error('Error fetching game data:', error);
    }
};

  const toggleAnswerStatus = async (questionId) => {
    try {
      const response = await fetch(`${apiUrl}/question/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questionId })
      });
  
      if (!response.ok) {
        throw new Error('Failed to toggle answer status');
      }
  
      const data = await response.json();
      setIncorrectLoading(false)
      setEndGameLoader(false)
      navigate(`/admin-dashboard?roomId=${roomId}`)
    } catch (error) {
      console.error('Error toggling answer status:', error);
      setIncorrectLoading(false)
      setEndGameLoader(false)
    }
  };

  const handleEndStep = () => {
    setEndGameLoader(true)
    const requestBody = {
      user_id: selectedItem, // Замените на реальный user_id
      points: gameData.points // Количество баллов для добавления
    };

    fetch(`${apiUrl}/updatePoints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка HTTP: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log('Ответ сервера:', data);
      const message = {
        event: "end_step",
        winner: winner
      };
      console.log('messagee',message)
      socketRef.current.emit('message', JSON.stringify(message));
      toggleAnswerStatus(gameData.question_id)
      
      
    })
    .catch(error => {
      console.error('Ошибка запроса:', error.message);
    });
  }


  useEffect(() => {
    fetchGameData();
  }, []);

  useEffect(() => {
    socketRef.current = io(socketUrl);

    socketRef.current.on('connect', () => {
      setConnected(true);
      console.log('Подключение установлено');
    });

    socketRef.current.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      console.log('Message from USE EFFECT user game', parsedMessage);
      if (parsedMessage.event === "user_answer") {
        window.location.reload();
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
  }, []);

  const handleAllIncorrect = () => {
    setIncorrectLoading(true)
    const message = {
      event: "end_step",
      winner: winner
    };
    console.log('messagee',message)
    // socket.current.send(JSON.stringify(message));
    toggleAnswerStatus(gameData.question_id)
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
      <Header />
      <div className='user-game__container'>

        <div className='user-game__question-container'>
          <div className='user-game__top-room'>
              <span className='user-game__room-title'>Номер комнаты {roomId}</span>
              <span className='user-game__room-title'>Текущий ход - {gameData ? gameData.game_step : 0}</span>
          </div>
          {question ? (
            <div className='user-game__question'>
              <span className='user-game__points'>Вопрос на {question.points}</span>
              <div className='user-game__question-block'>
                <span className='user-game__category'>Тема : {question.category}</span>
                <span className='user-game__task'>{question.current_question_kz}</span>
                <span className='user-game__task'>{question.current_question_ru}</span>
              </div>
              {selectedItem ? (
                <div className='admin-answers__end-step' onClick={handleEndStep}>
                  {endGameLoader ? (
                    <ThreeDots
                      visible={true}
                      height="40"
                      width="40"
                      color="white"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    <span>Завершить ход</span>
                  )}
                </div>
              ) : (
                <div className='admin-answers__reply-btn'>Ожидайте ответа участников</div>
              )}
            </div>
          ) : (
            <div className='user-game__no-question'>
              <span>Ожидайте ответа администратора</span>
            </div>
          )}

          <div className='user-game__top-table'>
            <span className='user-game__answers-title'>Ответы участников</span>
            <div className='user-game__top-container'>
              {answers && (
                answers.map((answer, index) => (
                  <div key={index} className={`user-game__top-item ${selectedItem === index ? 'selected' : ''}`}>
                    <div className="user-game__top-user">
                      <div className="user-game__top-circle" style={{ backgroundColor: index === 0 ? 'green' : index === 1 ? 'red' : 'blue' }}>{index + 1}</div>
                      <span className='user-game__username'>{answer.username}</span>
                    </div>
                    <div className="user-game__top-btns">
                      <button className={`user-game__correct-answer ${selectedItem === answer.user_id ? 'selected' : ''}`} onClick={() => handleClick(answer.user_id, answer.username)}>
                        {selectedItem ? 'Победитель' : 'Правильно'}
                      </button>
                    </div>
                  </div>
                ))
              )}
              {answers.length > 0 && (
                <button className='all-incorrect' onClick={() => handleAllIncorrect()}>
                 {incorrectLoading ? (
                    <ThreeDots
                      visible={true}
                      height="40"
                      width="40"
                      color="white"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    <span>Все неправильно</span>
                  )}
                </button>

    
              )}
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}

export default AdminAnswersPage;
