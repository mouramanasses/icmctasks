// src/components/Inicio/Pesquisa.jsx
import React, { useState, useRef, useEffect } from 'react';
import filterIcon from '../../images/filtro.svg';   // use o seu ícone
import './Pesquisa.css';

export default function Pesquisa({
  value,
  onChange,
  filterStatus,
  onFilterSelect
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  // Fecha o menu clicando fora
  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { label: 'Todas',        value: '' },
    { label: 'Em andamento', value: 'em_andamento' },
    { label: 'Concluídas',   value: 'concluidas' },
    { label: 'Atrasadas',    value: 'atrasadas' }
  ];

  return (
    <div className="pesquisa-wrapper" ref={ref}>
      <input
        type="text"
        placeholder="Pesquisar tarefas…"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pesquisa-input"
      />

      {/* Ícone de filtro */}
      <button
        type="button"
        className="pesquisa-filter-btn"
        onClick={() => setMenuOpen(o => !o)}
      >
        <img src={filterIcon} alt="Filtrar" />
      </button>

      {/* Menu de filtro */}
      {menuOpen && (
        <ul className="pesquisa-filter-menu">
          {options.map(opt => (
            <li
              key={opt.value}
              className={filterStatus === opt.value ? 'selected' : ''}
              onClick={() => {
                onFilterSelect(opt.value);
                setMenuOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
