import React, {useState, useEffect, useRef} from 'react';
import './admin-start.css'
import Header from '../../components/header/header';
// import { useWebSocket } from '../../shared/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {FidgetSpinner, Puff} from 'react-loader-spinner'
import { Helmet } from 'react-helmet';

const AdminStartPage = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API
  

  function generateRandomDigits() {
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += Math.floor(Math.random() * 10); // Генерация случайной цифры от 0 до 9
    }
    return result;
  }
  
  const handleStartGame = async  () => {
    setLoading(true);
    const roomId = generateRandomDigits(); // Ваш ID комнаты
    const gameData = {
      current_question_ru: '',
      current_question_kz: '',
      question_id: 0,
      points: 0,
      category: '',
      game_step: 0
    };

    try {
      const response = await axios.post(`${apiUrl}/games`, {
        room_id: roomId,
        gameData: gameData
      });
      console.log('Game data saved:', response.data);
      setTimeout(() => {
        setLoading(false);
        navigate(`/admin-dashboard?roomId=${roomId}`);
      }, 1000);
    } catch (error) {
      console.error('Error saving or updating game data:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }

  return (
    <main className='admin-start'>
      <Helmet>
        <title>Создать игру</title>
      </Helmet>
      <div className='admin-start__container'>
        <div className='admin-start__instruction-block'>
          <span className='admin-start__title'>Создайте игру</span>

          {!loading ? (
            <FidgetSpinner
              visible={true}
              height="100"
              width="100"
              ariaLabel="fidget-spinner-loading"
              wrapperStyle={{}}
              wrapperClass="fidget-spinner-wrapper"
            />
          ) : (
            <Puff
              visible={true}
              height="100"
              width="100"
              color="#4fa94d"
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          )}

          <button className='admin-start__create-game' onClick={handleStartGame} disabled={loading}>
            {loading ? 'Создание игры...' : 'Создать Игру'}
          </button>
        </div>
        
      </div>
    </main>
  );
}

export default AdminStartPage;
