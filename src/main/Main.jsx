import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/cookies';
import List from '../component/List';
import Random from '../component/Random';
import User from '../component/User';
import './index.css';

export default function Main() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="main-page">
      <div className="chat-list-section">
        <List />
      </div>
      <div className="random-match-section">
        <Random />
      </div>
      <div className="profile-section">
        <User />
      </div>
    </div>
  );
}