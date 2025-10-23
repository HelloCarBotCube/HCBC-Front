// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./login/login";
import Signup from "./SignUp/Signup";
import Main from "./main/Main";
import "./SignUp/index.css";
import "./login/index.css";
import "./main/index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/main" element={<Main />} />
    </Routes>
  );
}

export default App;
