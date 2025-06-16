import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';
import Header from './components/Header/Header'
import Pesquisa from './components/Inicio/Pesquisa';
import TaskCard from './components/Inicio/TaskCard';
import AddTaskButton from './components/Inicio/AddTaskButton';

const Inicio = () => {
  const [searchValue, setSearchValue] = useState('');

  // Dados de exemplo das tarefas
  const tasks = [
    {
      id: 1,
      titulo: 'TÍTULO DA TAREFA',
      descricao: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an',
      prazo: 'xx/xx/xx xx:xx',
      status: 'Pendente'
    },
    {
      id: 2,
      titulo: 'Dar commit - projeto de vendas',
      descricao: 'Projeto',
      prazo: 'xx/xx/xx xx:xx',
      status: 'Pendente'
    },
    {
      id: 3,
      titulo: 'ANÁLISE DE REQUISITOS',
      descricao: 'Realizar análise completa dos requisitos do sistema, incluindo funcionalidades principais e regras de negócio específicas.',
      prazo: '15/06/25 14:30',
      status: 'Em Progresso'
    }
  ];

  const filteredTasks = tasks.filter(task =>
    task.titulo.toLowerCase().includes(searchValue.toLowerCase()) ||
    task.descricao.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleFilterClick = () => {
    console.log('Filtros clicked');
  };

  const handleAddTask = () => {
    console.log('Adicionar nova tarefa');
  };

  return (
    <div className="inicio-container">
      <Header />

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
            />
          ))}
        </div>

        {filteredTasks.length === 0 && searchValue && (
          <div className="no-tasks-message">
            <p>Nenhuma tarefa encontrada</p>
          </div>
        )}
      </main>

      <AddTaskButton onClick={handleAddTask} />
    </div>
  );
};

export default Inicio;