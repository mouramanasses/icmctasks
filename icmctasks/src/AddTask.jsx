import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import backIcon from './images/seta-voltar.png';
import saveIcon from './images/salvar-tarefa.png';
import './AddTask.css';

const AddTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar se está em modo de edição
  const isEditing = location.state?.isEditing || false;
  const taskToEdit = location.state?.task;
  
  // Pegar o userId (você pode obter isso do contexto de autenticação)
  const userId = localStorage.getItem('userId') || '507f1f77bcf86cd799439011'; // ID de exemplo
  
  const [task, setTask] = useState({
    nome: '',
    descricao: '',
    prazo: '',
    status: 'Em andamento'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Preencher campos se estiver editando
  useEffect(() => {
    if (isEditing && taskToEdit) {
      // Converter a data para o formato datetime-local
      const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        // Formato: YYYY-MM-DDTHH:mm
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setTask({
        nome: taskToEdit.nome || '',
        descricao: taskToEdit.descricao || '',
        prazo: formatDateForInput(taskToEdit.prazo),
        status: taskToEdit.status || 'Em andamento'
      });
    }
  }, [isEditing, taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando o usuário começar a digitar
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!task.nome.trim()) {
      setError('O título é obrigatório');
      return false;
    }
    
    if (!task.prazo) {
      setError('O prazo é obrigatório');
      return false;
    }
    
    // Verificar se a data é válida
    const prazoDate = new Date(task.prazo);
    if (isNaN(prazoDate.getTime())) {
      setError('Data de prazo inválida');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const taskData = {
        nome: task.nome.trim(),
        prazo: new Date(task.prazo).toISOString(),
        status: task.status
      };
      
      // Adicionar descrição se fornecida (campo não obrigatório no backend)
      if (task.descricao.trim()) {
        taskData.descricao = task.descricao.trim();
      }
      
      let response;
      
      if (isEditing) {
        // Atualizar tarefa existente
        response = await fetch(`/api/tasks/${taskToEdit._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData)
        });
      } else {
        // Criar nova tarefa
        response = await fetch(`/api/${userId}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData)
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar tarefa');
      }
      
      const savedTask = await response.json();
      console.log('Task saved:', savedTask);
      
      // Redirecionar para a página de tarefas ou lista
      navigate('/inicio');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
          >
            <img src={backIcon} alt="Voltar" />
          </button>

          {/* Botão Salvar */}
          <button 
            className="save-task-button"
            onClick={handleSubmit}
            aria-label="Salvar tarefa"
            disabled={loading}
          >
            <img src={saveIcon} alt="Salvar" />
          </button>

          {/* Título da Página */}
          <h1 className="add-task-title">
            {isEditing ? 'EDITAR TAREFA' : 'NOVA TAREFA'}
          </h1>
          
          {/* Exibir erro se houver */}
          {error && (
            <div className="error-message" style={{ 
              color: '#dc3545', 
              margin: '10px 0', 
              padding: '10px', 
              border: '1px solid #dc3545', 
              borderRadius: '4px',
              backgroundColor: '#f8d7da'
            }}>
              {error}
            </div>
          )}
          
          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            {/* Campo Título */}
            <div className="form-group">
              <label htmlFor="nome">Título *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={task.nome}
                onChange={handleChange}
                placeholder="Digite o título da tarefa"
                required
                disabled={loading}
              />
            </div>

            {/* Campo Descrição */}
            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={task.descricao}
                onChange={handleChange}
                placeholder="Descreva a tarefa... (opcional)"
                rows="5"
                disabled={loading}
              />
            </div>

            {/* Campos Data e Status */}
            <div className="form-row">
              {/* Campo Prazo */}
              <div className="form-group">
                <label htmlFor="prazo">Prazo *</label>
                <input
                  type="datetime-local"
                  id="prazo"
                  name="prazo"
                  value={task.prazo}
                  onChange={handleChange}
                  required
                  disabled={loading}
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
                  disabled={loading}
                >
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Atrasada">Atrasada</option>
                </select>
              </div>
            </div>
            
            {/* Botão de submit escondido para funcionar com Enter */}
            <button 
              type="submit" 
              style={{ display: 'none' }}
              disabled={loading}
            >
              Salvar
            </button>
          </form>
          
          {/* Indicador de carregamento */}
          {loading && (
            <div className="loading-indicator" style={{
              textAlign: 'center',
              margin: '20px 0',
              color: '#666'
            }}>
              {isEditing ? 'Atualizando tarefa...' : 'Criando tarefa...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTask;