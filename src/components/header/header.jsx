import React from 'react';
import './header.css'
import miniLogo from '../../assets/mini-logo.png'

const Header = () => {
  return (
    <header className='header'>
      <div className='header__container'>
        <img src={miniLogo} alt=''></img>
      </div>
    </header>
  );
}

export default Header;
