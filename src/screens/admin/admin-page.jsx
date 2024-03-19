import React from 'react';
import './admin-page.css'
import mainBg from '../../assets/mainBg.png'
import AdminSignIn from '../../components/admin-sign-in/admin-sign-in';

const AdminPage = () => {
  console.log(process.env.REACT_APP_SOCKET);
  console.log(process.env.REACT_APP_API);
  return (
    <main className='home'>
      <AdminSignIn />
      <img src={mainBg} className='home__main-bg' alt=''></img>
    </main>
  );
}

export default AdminPage;
