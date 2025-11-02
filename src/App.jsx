import { Routes, Route } from "react-router-dom";
import Login from "./login/Login";
import Signup from "./SignUp/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
