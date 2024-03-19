import React from 'react';
import './home-page.css'
import mainBg from '../../assets/mainBg.png'
import UserSignIn from '../../components/user-sign-in/user-sign-in';

const HomePage = () => {
  return (
    <main className='home'>
      <UserSignIn />
      <img src={mainBg} className='home__main-bg' alt=''></img>
    </main>
  );
}

export default HomePage;
