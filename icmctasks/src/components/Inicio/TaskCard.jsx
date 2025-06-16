import React from 'react';
import './TaskCard.css';

const TaskCard = ({ titulo, descricao, prazo, status }) => {
  return (
    <div className="task-card-borda">
      <div className="task-card">
        <h2 className="task-card-titulo">{titulo}</h2>
        <p className="task-card-descricao">{descricao}</p>
        <div className="task-card-footer">
          <span className="task-card-prazo">Prazo: {prazo}</span>
          <span className="task-card-status">Status: {status}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;