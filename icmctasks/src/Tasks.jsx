import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import backIcon from './images/seta-voltar.png';
import deleteTask from './images/botao-deletar-tarefa.png';
import editTask from './images/botao-editar-tarefa.png';
import './Tasks.css';

const Tasks = () => {
  const navigate = useNavigate();

  return (
    <div className="tasks-page">
      {/* Header com props personalizadas (ajuste conforme seu componente) */}
      <Header 
        userName="Rafael Carmanhani"
      />
      
      {/* Container vazio para manter a estrutura */}
      <div className="tasks-content">
        <div className="tasks-card">
            {/* Botão Voltar */}
            <button 
              className="task-back-button"
              onClick={() => navigate('/pagina_principal')} // Navega para a página principal
              aria-label="Voltar para página principal"
            >
              <img src={backIcon} alt="Voltar" />
            </button>

            {/* Título Centralizado */}
              <h1 className="task-title">Título da Tarefa</h1>
          
            {/* Descrição da Tarefa */}
              <div className="task-description">
                <p>descrição - Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an </p>
              </div>
            
            {/* Novo rodapé */}
              <div className="task-footer">
                <div className="task-deadline">
                  <span>⏰</span>
                  <span>15/06/2023 - 14:00</span>
                </div>
                <div className="task-status">
                  <span>STATUS: </span>
                    Em Progresso
                </div>
              </div>
        </div>
      </div>
      {/* Botão Editar Tarefa */}
      <button 
        className="task-edit-button"
        onClick={() => navigate('/add_tarefa')}
        aria-label="Editar Tarefa"
      >
        <img src={editTask} alt="Editar" />
      </button>

      {/* Botão Deletar Tarefa */}
      <button 
        className="task-delete-button"
        onClick={() => navigate('/pagina_principal')}
        aria-label="Deletar Tarefa"
      >
        <img src={deleteTask} alt="deletar" />
      </button>
    </div>
  );
};

export default Tasks;