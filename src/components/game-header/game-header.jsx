import "./game-header.css";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const GameHeader = ({connectedStatus}) => {
  const [searchParams] = useSearchParams();
  const [gameData, setGameData] = useState();
  const roomId = searchParams.get("roomId");
  const apiUrl = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/games/${roomId}`);
        const gameData = response.data;
        console.log("Game data1313131:", gameData);
        setGameData(gameData);
        // Здесь вы можете обновить состояние вашего компонента с полученными данными
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGameData();
  }, []);

  return (
    <div className="game-header">
      <div className="game-header__container">
        <div className="game-header__item">
          <span className="game-header__item-title">Номер комнаты: </span>
          <span className="game-header__item-value">{roomId}</span>
        </div>
        <div className="game-header__item">
          <span className="game-header__item-title">Номер хода: </span>
          <span className="game-header__item-value">
            {gameData ? gameData.game_step : "..."}
          </span>
        </div>
        {connectedStatus && (
          <div>Online </div>
        )}
      </div>
    </div>
  );
};

export default GameHeader;
