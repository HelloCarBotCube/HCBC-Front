import { Routes, Route } from "react-router-dom";
import Login from "./login/login.jsx";
import Signup from "./SignUp/Signup.jsx";
import Main from "./main/Main.jsx";
import Profile from "./profile/Profile.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/main" element={<Main />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;