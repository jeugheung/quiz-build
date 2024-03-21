import React, {useState, useEffect, useRef} from 'react';
import './admin-dashboard.css'
import Header from '../../components/header/header';
import MembersTable from '../../components/members-table/members-table';
import QuestionTable from '../../components/question-table/question-table';
import { useNavigate } from 'react-router-dom';
import GameHeader from '../../components/game-header/game-header';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {ThreeDots} from 'react-loader-spinner';
import { Helmet } from 'react-helmet';
import io from 'socket.io-client';

const AdminDashboardPage = () => {
  const [gameQuestion, setGameQuestion] = useState(null);
  const socketRef = useRef(); // Web Socket
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId')
  const [loading, setLoading] = useState(false)

  const [game, setGame] = useState()
  const apiUrl = process.env.REACT_APP_API
  const socketUrl = process.env.REACT_APP_SOCKET
  // WebSocket 
  const [connected, setConnected] = useState(false)


  const fetchGameData = async () => {
    try {
        const response = await axios.get(`${apiUrl}/games/${roomId}`);
        const gameData = response.data;
        setGame(gameData)
    } catch (error) {
        console.error('Error fetching game data:', error);
    }
  };


  useEffect(() => {
    socketRef.current = io(socketUrl);

    socketRef.current.on('connect', () => {
      setConnected(true);
      console.log('Подключение установлено');
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
  }, []);

  const handleStartGame = () => {
    if (!gameQuestion) {
      alert('Пожалуйста, выберите вопрос');
      return;
    }
  
    setLoading(true);
    if (gameQuestion) {
      const message = {
        event: "start_game",
        question: gameQuestion
      };
      console.log('messagee',message)
      // socket.current.send(JSON.stringify(message));

      const gameData = {
        current_question_ru: gameQuestion.question_ru,
        current_question_kz: gameQuestion.question_kz,
        question_id: gameQuestion.id,
        points: gameQuestion.points,
        category: gameQuestion.category,
        game_step: game.game_step + 1,
        answers: [],
        answered_count: 0
      };
  
      try {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            room_id: roomId,
            gameData: gameData
          })
        };
      
        fetch(`${apiUrl}/games`, requestOptions)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to save game data');
            }
            return response.json();
          })
          .then(data => {
            // console.log('Game data saved:', data);
            
            setTimeout(() => {
              setLoading(false)
              socketRef.current.emit('message', JSON.stringify(message));
              navigate(`/admin-answers?roomId=${roomId}`);
            }, 500);
          })
          .catch(error => {
            console.error('Error saving game data:', error);
          });
      } catch (error) {
        console.error('Error saving game data:', error);
      }
    }
  };

  const handleEndGame = () => {
    const confirmed = window.confirm('Вы уверены, что хотите завершить игру?');
    if (confirmed) {
      navigate(`/winner-page?roomId=${roomId}`)
    }
  };
  

  return (
    <main className='dashboard'>
      <Helmet>
        <title>Панель Администратора</title>
      </Helmet>
      <Header />
      <div className='dashboard__container'>
        <GameHeader connectedStatus={connected}/>
        <div className='dashboard__content'>
          <MembersTable/>
          <div className='dashboard__tableview'>
            <QuestionTable setGameQuestion={setGameQuestion}/>
            <button className='dashboard__button' onClick={() => handleStartGame()}>
              {loading ? (
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
                <span> Начать игру</span>
              )}
             
            </button>

            <button className='dashboard__button-end' onClick={handleEndGame}>Завершить игру</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboardPage;
