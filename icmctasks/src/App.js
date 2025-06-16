// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Forgot from './Forgot';
import NewPassword from './NewPassword';
import Perfil from './Perfil';
import Inicio from './Inicio';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path= "/forgot" element ={<Forgot/>} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/inicio" element={<Inicio/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
