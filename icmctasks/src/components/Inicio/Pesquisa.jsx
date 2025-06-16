import React from 'react';
import './Pesquisa.css';
import iconeFiltro from '../../images/filtro.svg';


const Pesquisa = ({ value, onChange, onFilterClick }) => {
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
          onClick={onFilterClick}
          className="filtro-botao"
          aria-label="Filtrar resultados"
        >
          <img
              src={iconeFiltro}
              alt="Ícone de filtro na pesquisa"
              className="filtro"
          />
        </button>
      </div>
    </div>
  );
};

export default Pesquisa;

