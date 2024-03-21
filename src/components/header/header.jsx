import React from "react";
import "./header.css";
import miniLogo from "../../assets/mini-logo.png";
import formLogo from '../../assets/formLogo.png'
import { useNavigate } from "react-router-dom";

const Header = ({ type }) => {
  const navigate = useNavigate();

  const handleNavigateToMainScreen = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <div
        className={`header__container ${
          type === "user" ? "user-header-container" : ""
        }`}
      >
        <img src={formLogo} alt="" className="form-logo"></img>
        {type === "user" ? (
          <button className="header__back" onClick={handleNavigateToMainScreen}>
            Выбор комнаты
          </button>
        ) : (
          <div className="admin-header">
            Администратор
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
