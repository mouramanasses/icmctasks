import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header/Header.jsx';
import backIcon from './images/seta-voltar.png';
import saveIcon from './images/salvar-tarefa.png';
import './AddTask.css';

// baseURL centralizada – mude a porta aqui se precisar
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

export default function AddTask() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // se veio de edição
  const isEditing   = state?.isEditing || false;
  const taskToEdit  = state?.task     || null;

  // id do usuário obtido no login
  const userId = localStorage.getItem('userId');

  const [task, setTask] = useState({
    nome: '',
    descricao: '',
    prazo: '',
    status: 'Em andamento'
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  /* ---------- preencher formulário em modo edição ---------- */
  useEffect(() => {
    if (isEditing && taskToEdit) {
      const d   = new Date(taskToEdit.prazo);
      const iso = !isNaN(d) ? d.toISOString().slice(0,16) : ''; // yyyy-MM-ddTHH:mm
      setTask({
        nome:        taskToEdit.nome,
        descricao:   taskToEdit.descricao || '',
        prazo:       iso,
        status:      taskToEdit.status || 'Em andamento'
      });
    }
  }, [isEditing, taskToEdit]);

  /* -------------------- handlers --------------------------- */
  const handleChange = e => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!task.nome.trim())        { setError('Título obrigatório'); return false; }
    if (!task.prazo)              { setError('Prazo obrigatório');  return false; }
    if (isNaN(new Date(task.prazo))) { setError('Data inválida');   return false; }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        nome:       task.nome.trim(),
        descricao:  task.descricao.trim(),
        prazo:      new Date(task.prazo).toISOString(),
        status:     task.status
      };

      if (isEditing) {
        await api.put(`/tasks/${taskToEdit._id}`, payload);
      } else {
        await api.post(`/${userId}/tasks`, payload);
      }
      navigate('/inicio');                // volta para lista
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao salvar';
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI --------------------------- */
  return (
    <div className="add-task-page">
      <Header userName={localStorage.getItem('userName') || ''} />

      <div className="add-task-content">
        <div className="add-task-card">

          {/* Botões de topo */}
          <button
            className="task-back-button"
            onClick={() => navigate(-1)}
            disabled={loading}
            aria-label="Voltar"
          >
            <img src={backIcon} alt="Voltar" />
          </button>

          <button
            className="save-task-button"
            onClick={handleSubmit}
            disabled={loading}
            aria-label="Salvar"
          >
            <img src={saveIcon} alt="Salvar" />
          </button>

          <h1 className="add-task-title">
            {isEditing ? 'EDITAR TAREFA' : 'NOVA TAREFA'}
          </h1>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Título */}
            <div className="form-group">
              <label htmlFor="nome">Título *</label>
              <input
                id="nome" name="nome"
                value={task.nome}
                onChange={handleChange}
                disabled={loading}
                placeholder="Digite o título"
                required
              />
            </div>

            {/* Descrição */}
            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao" name="descricao"
                value={task.descricao}
                onChange={handleChange}
                disabled={loading}
                placeholder="Descreva a tarefa (opcional)"
                rows="5"
              />
            </div>

            {/* Prazo + Status */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prazo">Prazo *</label>
                <input
                  type="datetime-local"
                  id="prazo" name="prazo"
                  value={task.prazo}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status" name="status"
                  value={task.status}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option>Em andamento</option>
                  <option>Concluída</option>
                  <option>Atrasada</option>
                </select>
              </div>
            </div>

            {/* Botão escondido para submit via Enter */}
            <button type="submit" style={{ display: 'none' }} disabled={loading}/>
          </form>

          {loading && (
            <div className="loading-indicator">
              {isEditing ? 'Atualizando...' : 'Salvando...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
