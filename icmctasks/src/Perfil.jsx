import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';
import Header from './components/Header/Header';

const Perfil = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    dataNascimento: '',
    cpf: '',
    fotoPerfil: 'https://cdn-icons-png.flaticon.com/512/194/194938.png'
  });

  const [tempData, setTempData] = useState({ ...userData });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn('Nenhum userId encontrado no localStorage');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
        setUserData(response.data);
        setTempData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.put(`http://localhost:3000/api/users/${userId}`, {
          nome: tempData.nome,
          email: tempData.email,
          dataNascimento: tempData.dataNascimento
        });

        setUserData(response.data);
        setIsEditing(false);
        alert('Dados atualizados com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        alert('Erro ao atualizar dados. Tente novamente.');
      }
    } else {
      setTempData({ ...userData });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setTempData({ ...userData });
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.delete(`http://localhost:3000/api/users/${userId}`);
      alert('Conta excluída com sucesso!');
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('fotoPerfil', file);

    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(
        `http://localhost:3000/api/users/upload/${userId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setUserData(response.data);
      setTempData(response.data);
      alert('Foto de perfil atualizada!');
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
      alert('Erro ao enviar imagem');
    }
  };

  return (
    <div className="perfil-container">
      <Header
        userProfilePhoto={userData.fotoPerfil}
        userName={userData.nome}
      />

      <div className="perfil-content">
        <div className="perfil-card">
          <div className="perfil-header">
            <img
              className="perfil-avatar"
              src={userData.fotoPerfil}
              alt="Avatar"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={isEditing}
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
              <input type="password" value="********" readOnly />
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
