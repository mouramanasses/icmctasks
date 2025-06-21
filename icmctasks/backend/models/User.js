const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  dataNascimento: {
    type: String, // ou Date, se você preferir armazenar como objeto de data
    required: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  fotoPerfil: {
  type: String,
  default: 'https://cdn-icons-png.flaticon.com/512/194/194938.png' // imagem padrão
}

});

module.exports = mongoose.model('User', userSchema);
