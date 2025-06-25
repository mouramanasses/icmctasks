// src/Inicio.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Inicio.css';
import Header        from './components/Header/Header.jsx';
import Pesquisa      from './components/Inicio/Pesquisa';
import TaskCard      from './components/Inicio/TaskCard';
import AddTaskButton from './components/Inicio/AddTaskButton';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',     // ↰ backend
  headers: { 'Content-Type': 'application/json' }
});

export default function Inicio() {
  const navigate = useNavigate();

  /* ---------- info do usuário ---------- */
  const [userName]  = useState(localStorage.getItem('userName')  || '');
  const [userPhoto] = useState(localStorage.getItem('userPhoto') || '');
  const  userId     = localStorage.getItem('userId');            // <- chave!

  /* ---------- tarefas ---------- */
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [searchValue, setSearchValue] = useState('');

  /* ---------- carregar na montagem ---------- */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const resp = await api.get(`/${userId}/tasks`);
        // o controller devolve { tasks, estatisticas } – pegamos só as tasks
        setTasks(resp.data.tasks || resp.data); 
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar tarefas.');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchTasks();
  }, [userId]);

  /* ---------- filtro de pesquisa ---------- */
  const filtered = tasks.filter(t =>
    t.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
    (t.descricao || '').toLowerCase().includes(searchValue.toLowerCase())
  );

  /* ---------- handlers ---------- */
  const handleAddTask   = () => navigate('/addtask');
  const handleTaskClick = task => navigate('/tasks', { state: { task } });

  /* ---------- UI ---------- */
  return (
    <div className="inicio-container">
      <Header userName={userName} userProfilePhoto={userPhoto} />

      <main className="inicio-main">
        <Pesquisa
          value={searchValue}
          onChange={setSearchValue}
          onFilterClick={() => console.log('Filtro')}
        />

        {/* LOADING / ERRO */}
        {loading && <p className="loading">Carregando tarefas…</p>}
        {error    && <p className="error">{error}</p>}

        {/* LISTA */}
        {!loading && !error && (
          <>
            <div className="task-cards-list">
              {filtered.map(task => (
                <TaskCard
                  key={task._id}
                  titulo={task.nome}
                  descricao={task.descricao}
                  prazo={new Date(task.prazo).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                  status={task.status}
                  onClick={() => handleTaskClick(task)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="no-tasks-message">
                <p>Nenhuma tarefa encontrada</p>
              </div>
            )}
          </>
        )}
      </main>

      <AddTaskButton aoClicar={handleAddTask} />
    </div>
  );
}
