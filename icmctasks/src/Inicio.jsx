import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';
import Header from './components/Header/Header.jsx';
import Pesquisa from './components/Inicio/Pesquisa';
import TaskCard from './components/Inicio/TaskCard';
import AddTaskButton from './components/Inicio/AddTaskButton';

const Inicio = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');

  // Recuperar nome e foto do localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedPhoto = localStorage.getItem('userPhoto');
    setUserName(storedName || '');
    setUserPhoto(storedPhoto || '');
  }, []);

  const tasks = [ /* ... suas tarefas */ ];

  const filteredTasks = tasks.filter(task =>
    task.titulo.toLowerCase().includes(searchValue.toLowerCase()) ||
    task.descricao.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleFilterClick = () => {
    console.log('Filtros clicked');
  };

  const handleAddTask = () => {
    try {
      navigate('/addtask');
    } catch (error) {
      console.error('Erro na navegação:', error);
    }
  };

  const handleTaskClick = (taskId) => {
    const selectedTask = tasks.find(task => task.id === taskId);
    navigate('/tasks', { state: { task: selectedTask } });
  };

  return (
    <div className="inicio-container">
      <Header userName={userName} userProfilePhoto={userPhoto} />

      <main className="inicio-main">
        <Pesquisa
          value={searchValue}
          onChange={setSearchValue}
          onFilterClick={handleFilterClick}
        />

        <div className="task-cards-list">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              titulo={task.titulo}
              descricao={task.descricao}
              prazo={task.prazo}
              status={task.status}
              onClick={() => handleTaskClick(task.id)}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && searchValue && (
          <div className="no-tasks-message">
            <p>Nenhuma tarefa encontrada</p>
          </div>
        )}
      </main>

      <AddTaskButton aoClicar={handleAddTask} />
    </div>
  );
};

export default Inicio;
