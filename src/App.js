import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WebSocketProvider } from './shared/WebSocketContext';
import HomePage from './screens/home-page/home-page';
import AdminPage from './screens/admin/admin-page';
import AdminDashboardPage from './screens/admin-dashboard/admin-dashboard'
import UserGamePage from './screens/user-game-page/user-game-page';
import AdminAnswersPage from './screens/admin-answers/admin-answers';
import AdminStartPage from './screens/admin-start/admin-start';
import WinnerPage from './screens/winners-page/winners-page';

const App = () => {
  return (
    <BrowserRouter>
      <WebSocketProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path='admin-start' element={<AdminStartPage />} />
          <Route path="admin-dashboard" element={<AdminDashboardPage />} />
          <Route path='user-game' element={<UserGamePage />} />
          <Route path='admin-answers' element={<AdminAnswersPage />} />
          <Route path='winner-page' element={<WinnerPage />}/>
        </Routes>
      </WebSocketProvider>
    </BrowserRouter>
  );
};

export default App;
