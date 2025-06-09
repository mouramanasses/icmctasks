import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Forgot.css';
import logo from './images/icmc_tasks_logo.png';

export default function Forgot() {
  const navigate = useNavigate();
  // estado para guardar os 4 dígitos
  const [code, setCode] = useState(['', '', '', '']);
  // refs para controlar foco automático
  const inputsRef = useRef([]);

  // quando o usuário digita em uma das caixas
  const handleChange = (idx) => (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    // se digitou algo, foca o próximo
    if (val && inputsRef.current[idx + 1]) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleResend = () => {
    console.log('Reenviando código...');
    // TODO: chamar API de resend
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const joined = code.join('');
    console.log('Código enviado:', joined);
    // TODO: verificar código antes de navegar
    navigate('/login'); // ou para página de alterar senha
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <img src={logo} alt="ICMC Tasks" className="forgot-logo" />
        <p className="forgot-text">Digite o código enviado para seu e-mail</p>
        <form onSubmit={handleSubmit}>
          <div className="code-inputs">
            {code.map((digit, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength="1"
                value={digit}
                onChange={handleChange(i)}
                ref={el => inputsRef.current[i] = el}
              />
            ))}
          </div>
          <button
            type="button"
            className="resend-code"
            onClick={handleResend}
          >
            Reenviar código
          </button>
          <button
            type="button"
            className="newpassword"
                onClick={() => navigate('/newpassword')}>Alterar Senha
            </button>
        </form>
      </div>
    </div>
  );
}
