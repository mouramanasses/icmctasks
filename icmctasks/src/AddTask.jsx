import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import backIcon from './images/seta-voltar.png';
import saveIcon from './images/salvar-tarefa.png';
import './AddTask.css';

const AddTask = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'Não Iniciado'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para salvar/editar a tarefa
    console.log('Task saved:', task);
    navigate('/tasks');
  };

  return (
    <div className="add-task-page">
      <Header userName="Rafael Carmanhani" />
      
      <div className="add-task-content">
        <div className="add-task-card">
          {/* Botão Voltar */}
          <button 
            className="task-back-button"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
          >
            <img src={backIcon} alt="Voltar" />
          </button>

          {/* Botão Salvar */}
          <button 
            className="save-task-button"
            onClick={handleSubmit}
            aria-label="Salvar tarefa"
          >
            <img src={saveIcon} alt="Salvar" />
          </button>

          {/* Título da Página */}
          <h1 className="add-task-title">
            {isEditing ? 'EDITAR TAREFA' : 'NOVA TAREFA'}
          </h1>
          
          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            {/* Campo Título */}
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                value={task.title}
                onChange={handleChange}
                placeholder="Digite o título da tarefa"
                required
              />
            </div>

            {/* Campo Descrição */}
            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={task.description}
                onChange={handleChange}
                placeholder="Descreva a tarefa..."
                rows="5"
                required
              />
            </div>

            {/* Campos Data e Status */}
            <div className="form-row">
              {/* Campo Prazo */}
              <div className="form-group">
                <label htmlFor="deadline">Prazo</label>
                <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  value={task.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Campo Status */}
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={task.status}
                  onChange={handleChange}
                >
                  <option value="Não Iniciado">Não Iniciado</option>
                  <option value="Em Progresso">Em Progresso</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;