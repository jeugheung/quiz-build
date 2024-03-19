import React from 'react';
import './home-page.css'
import mainBg from '../../assets/mainBg.png'
import UserSignIn from '../../components/user-sign-in/user-sign-in';
import { Helmet } from 'react-helmet';

const HomePage = () => {
  return (
    <main className='home'>
      <Helmet>
        <title>Войти в игру</title>
      </Helmet>
      <UserSignIn />
      <img src={mainBg} className='home__main-bg' alt=''></img>
    </main>
  );
}

export default HomePage;
