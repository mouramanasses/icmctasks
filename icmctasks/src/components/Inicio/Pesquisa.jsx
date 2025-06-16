import React, { useState } from 'react';
import './Pesquisa.css';
import iconeFiltro from '../../images/filtro.svg';

const Pesquisa = ({ value, onChange, onFilterClick }) => {
  // controle do estado do menu do filtro
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleFilterButtonClick = () => {
    setShowFilterMenu(prev => !prev); //inverte os valores, essencial para verificar oclick
  };

  const handleOptionClick = () => {
    setShowFilterMenu(false);
  };

  return (
    <div className="pesquisa-container">
      <div className="pesquisa">
        <div className="pesquisa-input-area">
          <input
            type="text"
            placeholder="Pesquisar"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pesquisa-input"
          />
        </div>
        <button
          onClick={handleFilterButtonClick}
          className="filtro-botao"
          aria-label="Filtrar resultados"
        >
          <img
              src={iconeFiltro}
              alt="Ícone de filtro na pesquisa"
              className="filtro-icon"
          />
        </button>
      </div>
      {showFilterMenu && (
        <div className="filtro-menu">
          <button className="filtro-opcao" onClick={handleOptionClick}>
            Todas as atividades
          </button>
          <button className="filtro-opcao" onClick={handleOptionClick}>
            Pendentes
          </button>
          <button className="filtro-opcao" onClick={handleOptionClick}>
            Em andamento
          </button>
          <button className="filtro-opcao" onClick={handleOptionClick}>
            Concluídas
          </button>
        </div>
      )}
    </div>
  );
};

export default Pesquisa;

