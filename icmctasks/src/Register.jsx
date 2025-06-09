import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import logo from './images/icmc_tasks_logo.png';

//Declara um componente React chamado "Register" e já o exporta.
//    Um componente é basicamente uma função que retorna um pedaço de interface.
export default function Register() {
  //Chama useNavigate() para obter a função `navigate`, que
  //    usamos depois pra levar o usuário a outra rota.
  const navigate = useNavigate();

  //Cria um estado interno `form` (objeto) e a função setForm()
  //    para atualizar esse estado. Começamos com todos os campos vazios.
  const [form, setForm] = useState({
    nome: '',
    dataNasc: '',
    cpf: '',
    email: '',
    senha: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,       
      [name]: value  
    }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();            // 9a. Impede o envio tradicional que recarrega a página
    console.log('Enviando dados de cadastro:', form);
                                  // 9b. Aqui você chamaria sua API para criar o usuário
    navigate('/login');            // 9c. Depois de “cadastrar”, leva para a tela de login
  };

  return (
    //container total da página, para aplicar o fundo gradiente
    <div className="register-page">

      {/*o “card” branco centralizado*/}
      <div className="register-card">

        {/* logo no topo, com alt para acessibilidade*/}
        <img
          src={logo}
          alt="ICMC Tasks"
          className="register-logo"
        />

        {/* 15. formulário: onSubmit chama handleSubmit*/}
        <form onSubmit={handleSubmit}>

          {/* 16. campo de texto para o nome */}
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}         // liga ao estado `form.nome`
            onChange={handleChange}   // sempre que mudar, atualiza o estado
            required                  // torna obrigatório
          />

          {/* 17. agrupa data de nasc e CPF lado a lado */}
          <div className="row">
            <input
              type="date"
              name="dataNasc"
              placeholder="Data de Nasc."
              value={form.dataNasc}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cpf"
              placeholder="CPF"
              value={form.cpf}
              onChange={handleChange}
              required
            />
          </div>

          {/* 18. campo de e-mail */}
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* 19. campo de senha */}
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
            required
          />

          {/* 20. botão que envia o formulário */}
          <button
            type="submit"          
            className="btn cadastre"
          >
            CADASTRE-SE
          </button>

        </form>
      </div>
    </div>
  );
}
