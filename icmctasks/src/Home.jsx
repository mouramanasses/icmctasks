import { useNavigate } from 'react-router-dom';
import './Home.css';
import fundo from './images/fundo.png';       //import do fundo
import logo from './images/icmc_tasks_logo.png';    //import da logo

export default function Home() {
  const navigate = useNavigate(); //para redirecionar para as outras páginas (login e cadastro)

  return (
    <div
      className="home"
      style={{ backgroundImage: `url(${fundo})` }}
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
