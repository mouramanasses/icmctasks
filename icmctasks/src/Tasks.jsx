import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import backIcon from './images/seta-voltar.png';
import deleteTask from './images/botao-deletar-tarefa.png';
import editTask from './images/botao-editar-tarefa.png';
import './Tasks.css';

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { taskId } = useParams();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userId = localStorage.getItem('userId') || '507f1f77bcf86cd799439011';
  const userName = localStorage.getItem('userName') || 'Usuário';
  const userPhoto = localStorage.getItem('userPhoto') || '';
  
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        
        if (location.state?.task) {
          setTask(location.state.task);
          setLoading(false);
          return;
        }
        
        if (taskId) {
          const response = await fetch(`http://localhost:3000/api/${userId}/tasks`);
          if (!response.ok) {
            throw new Error('Erro ao buscar tarefa');
          }
          
          const data = await response.json();
          const foundTask = data.tasks.find(t => t._id === taskId);
          
          if (foundTask) {
            setTask(foundTask);
          } else {
            throw new Error('Tarefa não encontrada');
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [taskId, location.state, userId]);
  
  const defaultTask = {
    _id: '0',
    nome: 'Tarefa não encontrada',
    descricao: 'Não foi possível carregar os dados da tarefa.',
    prazo: new Date(),
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar esta tarefa?');
    
    if (confirmDelete) {
      try {
        console.log('Attempting to delete task:', currentTask._id);
        console.log('User ID:', userId);
        
        const response = await fetch(`http://localhost:3000/api/tasks/${currentTask._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        let result = null;
        try {
          const responseText = await response.text();
          if (responseText) {
            result = JSON.parse(responseText);
          }
        } catch (jsonError) {
          console.log('Sem corpo de resposta JSON');
        }
        
        alert('Tarefa deletada com sucesso!');
        navigate('/inicio');
        
      } catch (err) {
        console.error('Delete error:', err);
        alert('Erro ao deletar tarefa: ' + err.message);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return '--/--/-- --:--';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '--/--/-- --:--';
    
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluída':
        return '#28a745';
      case 'Atrasada':
        return '#dc3545';
      case 'Em andamento':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="tasks-page">
        <Header userName={userName} userProfilePhoto={userPhoto} />
        <div className="tasks-content">
          <div className="loading">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-page">
        <Header userName={userName} userProfilePhoto={userPhoto} />
        <div className="tasks-content">
          <div className="error">Erro: {error}</div>
          <button onClick={() => navigate('/inicio')}>Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <Header 
        userName={userName}
        userProfilePhoto={userPhoto}
      />
      
      <div className="tasks-content">
        <div className="tasks-card">
            <button 
              className="task-back-button"
              onClick={() => navigate('/inicio')}
              aria-label="Voltar para página principal"
            >
              <img src={backIcon} alt="Voltar" />
            </button>

            <h1 className="task-title">{currentTask.nome}</h1>
          
            <div className="task-description">
              <p>{currentTask.descricao || 'Sem descrição disponível'}</p>
            </div>
            
            <div className="task-footer">
              <div className="task-deadline">
                <span>⏰</span>
                <span>{formatDate(currentTask.prazo)}</span>
              </div>
              <div className="task-status">
                <span>STATUS: </span>
                <span style={{ color: getStatusColor(currentTask.status) }}>
                  {currentTask.status}
                </span>
              </div>
            </div>
        </div>
      </div>

      <button 
        className="task-edit-button"
        onClick={handleEdit}
        aria-label="Editar Tarefa"
      >
        <img src={editTask} alt="Editar" />
      </button>

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