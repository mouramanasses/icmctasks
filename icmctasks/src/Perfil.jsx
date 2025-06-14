import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Perfil.css';
import Header from './components/Header/Header';

const Perfil = () => {
  const navigate = useNavigate(); // Para conseguir navegar e voltar a home quando deleta conta

  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
// aqui vai pegar do banco de dados depois
  const [userData, setUserData] = useState({
    nome: "Nome do Usuário",
    email: "emaildousuario@email.com",
    dataNascimento: "01/01/2000",
    cpf: "999.999.999-33"
  });

  const [tempData, setTempData] = useState({ ...userData });

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para alternar modo de edição
  const handleEditToggle = () => {
    if (isEditing) {
      setUserData({ ...tempData });
      setIsEditing(false);
    } else {
      // Se não estava editando, entra no modo de edição
      setTempData({ ...userData });
      setIsEditing(true);
    }
  };

  // Função para cancelar edição
  const handleCancel = () => {
    setTempData({ ...userData }); // Usa os dados originais
    setIsEditing(false);
  };

  // Função para abrir de confirmação de exclusão
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // Função para confirmar exclusão da conta
  const handleConfirmDelete = () => {
    console.log("Conta excluída!");
    alert("Conta excluída com sucesso!");
    setShowDeleteModal(false);
    
    // Redireciona para página de login
    navigate('/');
  };

  // Função para cancelar exclusão
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="perfil-container">
      {/*cabeçalho*/}
      <Header 
        userProfilePhoto="https://cdn-icons-png.flaticon.com/512/194/194938.png"
        userName={userData.nome}
      />
             
      <div className="perfil-content">
        <div className="perfil-card">
          <div className="perfil-header">
            <img
              className="perfil-avatar"
              src="https://cdn-icons-png.flaticon.com/512/194/194938.png"
              alt="Avatar"
            />
            <div className="perfil-info">
              <h2>{userData.nome}</h2>
              <p>{userData.email}</p>
            </div>
          </div>
                     
          <div className="perfil-form">
            <label>Nome:</label>
            <input 
              type="text" 
              value={isEditing ? tempData.nome : userData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              readOnly={!isEditing}
              className={isEditing ? 'editing' : ''}
            />
                         
            <label>Email:</label>
            <input 
              type="email" 
              value={isEditing ? tempData.email : userData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              readOnly={!isEditing}
              className={isEditing ? 'editing' : ''}
            />
                         
            <label>Data de nasc.:</label>
            <input 
              type="text" 
              value={isEditing ? tempData.dataNascimento : userData.dataNascimento}
              onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
              readOnly={!isEditing}
              className={isEditing ? 'editing' : ''}
              placeholder="DD/MM/AAAA"
            />
                         
            <label>CPF:</label>
            <input 
              type="text" 
              value={userData.cpf}
              readOnly 
            />
                         
            <label>Senha:</label>
            <div className="senha-container">
              <input type="password" value="12345678" readOnly />
              <button className="btn-small">ALTERAR SENHA</button>
            </div>
                         
            <div className="perfil-buttons">
              {isEditing ? (
                <>
                  <button className="btn-primary" onClick={handleEditToggle}>
                    SALVAR ALTERAÇÕES
                  </button>
                  <button className="btn-cancel" onClick={handleCancel}>
                    CANCELAR
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-primary" onClick={handleEditToggle}>
                    ALTERAR DADOS
                  </button>
                  <button className="btn-delete" onClick={handleDeleteClick}>EXCLUIR CONTA</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/*confirmação de exclusão */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>⚠️ Confirmar Exclusão</h3>
            </div>
            <div className="modal-body">
              <p>Tem certeza de que deseja excluir sua conta?</p>
              <p className="warning-text">
                <strong>Esta ação é irreversível!</strong> Todos os seus dados serão perdidos permanentemente.
              </p>
            </div>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={handleCancelDelete}>
                CANCELAR
              </button>
              <button className="btn-confirm-delete" onClick={handleConfirmDelete}>
                SIM, EXCLUIR CONTA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;