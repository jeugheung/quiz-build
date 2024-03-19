import React from 'react';
import './admin-page.css'
import mainBg from '../../assets/mainBg.png'
import AdminSignIn from '../../components/admin-sign-in/admin-sign-in';
import { Helmet } from 'react-helmet';

const AdminPage = () => {
  return (
    <main className='home'>
      <Helmet>
        <title>Администратор</title>
      </Helmet>
      <AdminSignIn />
      <img src={mainBg} className='home__main-bg' alt=''></img>
    </main>
  );
}

export default AdminPage;
