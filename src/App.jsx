import { Routes, Route } from 'react-router-dom';
import Login from './login/login.jsx';
import Signup from './SignUp/Signup.jsx';
import Main from './main/Main.jsx';
import Profile from './profile/Profile.jsx';
import Chat from './chat/Chat.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/main" element={<Main />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
