import React, {useState, useEffect, useRef} from 'react';
import './winners-page.css'
import Header from '../../components/header/header';
// import { useWebSocket } from '../../shared/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { ThreeCircles } from 'react-loader-spinner';
import winner from '../../assets/winner.png'

const WinnerPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true)
  const roomId = searchParams.get('roomId')
  const apiUrl = process.env.REACT_APP_API

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/${roomId}`);
      console.log('userdata', response.data)
      setUsers(response.data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching users:');
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered by newUsers change');
    fetchUsers();
  }, []);

  const resetQuestions = async () => {
    try {
      const response = await fetch(`${apiUrl}/questions/reset`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Сообщение об успешном обновлении
        navigate('/admin-start')
      } else {
        throw new Error('Failed to reset questions');
      }
    } catch (error) {
      console.error('Error resetting questions:', error);
    }
  };
  


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

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <main className='winner-page'>
      <Header />
      <div className='winner-page__container'>
        <div className='winner-page__table'>
          <div>
            <img src={winner} alt='' className='winner-page__img'></img>
          </div>
          <div className='winner-page__list'>
            {sortedUsers.map((user, index) => (
              <div key={user.id} className='members__item'>
                <div className={`members__profile-circle ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>
                  {index + 1}
                </div>
                <div className='members__profile-info'>
                  <span className='members__username'>{user.username}</span>
                  <span>Количество баллов {user.points}</span>
                </div>
              </div>
            ))}


          </div>

          <button className='winner-page__end-game' onClick={resetQuestions}>Завершить игру</button>
        </div>
        
      </div>
    </main>
  );
}

export default WinnerPage;
