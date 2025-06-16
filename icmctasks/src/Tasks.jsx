import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import backIcon from './images/seta-voltar.png';
import deleteTask from './images/botao-deletar-tarefa.png';
import editTask from './images/botao-editar-tarefa.png';
import './Tasks.css';

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const task = location.state?.task;
  
  const defaultTask = {
    id: 0,
    titulo: 'Tarefa não encontrada',
    descricao: 'Não foi possível carregar os dados da tarefa.',
    prazo: '--/--/-- --:--',
    status: 'Desconhecido'
  };
  
  const currentTask = task || defaultTask;

  const handleEdit = () => {
    navigate('/addtask', { 
      state: { 
        task: currentTask,
        isEditing: true 
      } 
    });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar esta tarefa?');
    
    if (confirmDelete) {
      navigate('/inicio');
    }
  };

  return (
    <div className="tasks-page">
      {/* Header com props personalizadas */}
      <Header 
        userName="Rafael Carmanhani"
      />
      
      {/* Container vazio para manter a estrutura */}
      <div className="tasks-content">
        <div className="tasks-card">
            {/* Botão Voltar */}
            <button 
              className="task-back-button"
              onClick={() => navigate('/inicio')} // Navega para a página principal
              aria-label="Voltar para página principal"
            >
              <img src={backIcon} alt="Voltar" />
            </button>

            {/* Título Centralizado */}
              <h1 className="task-title">{currentTask.titulo}</h1>
          
            {/* Descrição da Tarefa */}
              <div className="task-description">
                <p>{currentTask.descricao}</p>
              </div>
            
            {/* Novo rodapé */}
              <div className="task-footer">
                <div className="task-deadline">
                  <span>⏰</span>
                  <span>{currentTask.prazo}</span>
                </div>
                <div className="task-status">
                  <span>STATUS: </span>
                  {currentTask.status}
                </div>
              </div>
        </div>
      </div>
      {/* Botão Editar Tarefa */}
      <button 
        className="task-edit-button"
        onClick={handleEdit}
        aria-label="Editar Tarefa"
      >
        <img src={editTask} alt="Editar" />
      </button>

      {/* Botão Deletar Tarefa */}
      <button 
        className="task-delete-button"
        onClick={handleDelete}
        aria-label="Deletar Tarefa"
      >
        <img src={deleteTask} alt="deletar" />
      </button>
    </div>
  );
};

export default Tasks;