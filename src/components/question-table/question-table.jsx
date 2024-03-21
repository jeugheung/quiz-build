import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './question-table.css'
import {ThreeCircles} from 'react-loader-spinner'

const QuestionTable = ({setGameQuestion}) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/questions`);
        // console.log('All questions', response.data);
        setQuestions(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
        // setLoading(false); // Устанавливаем значение загрузки как false после получения данных
      } catch (error) {
        console.error('Error fetching questions:', error);
        setTimeout(() => {
          setLoading(false);
        }, 500);
        // setLoading(false); // Устанавливаем значение загрузки как false в случае ошибки
      }
    };

    fetchData();
  }, []);

  const handleQuestionClick = (question) => {
    setGameQuestion(question);
    setSelectedQuestion(question)
    // Дальнейшая обработка клика на вопрос
  };

  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className='loader-container'>
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
    <div className='question-table'>
      {Object.entries(groupedQuestions).map(([category, questions]) => (
        <div key={category} className='question-table__content-container'>
          <span className='question-table__main-title'>{category}</span>
          <div className='question-table__question-stack'>
            {questions.map((question) => (
              <div
                key={question.id}
                className={`question-table__question-item ${selectedQuestion && selectedQuestion.id === question.id ? 'selected' : ''} ${question.answered ? 'answered' : ''}`}
                onClick={() => !question.answered && handleQuestionClick(question)} 
              >
                <span className='question-table__pointTitle'>{question.points}</span>
                <span>баллов</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  
}

export default QuestionTable;
