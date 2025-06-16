import React from 'react';
import './AddTaskButton.css';
import icone from '../../images/add-tarefa.svg';

const AddTaskButton = ({ aoClicar }) => {
  return (
    <button
      onClick={aoClicar}
      aria-label="Adicionar algo"
      className="botao-flutuante"
    >
      <img
        src={icone}
        alt="Ícone de adicionar tarefa"
        className="icone"
      />
    </button>
  );
};

export default AddTaskButton;