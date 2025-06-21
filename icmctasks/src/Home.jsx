import { useNavigate } from 'react-router-dom';
import './Home.css';
import fundo from './images/fundo.png';
import logo from './images/icmc_tasks_logo.png';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="home"
      style={{
        backgroundImage: `url(${fundo})`,
        backgroundSize: '50% 50%',       // 4 imagens (2x2)
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="overlay">
        <img src={logo} alt="ICMC Tasks" className="logo" />

        <div className="btn-container">
          <button className="btn cadastre" onClick={() => navigate('/register')}>
            CADASTRE-SE
          </button>
          <button className="btn login" onClick={() => navigate('/login')}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
