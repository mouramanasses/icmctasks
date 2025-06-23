const mongoose = require('../db');

const taskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  nome: {
    type: String,
    required: true,
    trim: true
  },
  prazo: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Em andamento', 'Concluída', 'Atrasada'],
    default: 'Em andamento'
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
});

// Middleware para atualizar dataAtualizacao antes de salvar
taskSchema.pre('save', function(next) {
  this.dataAtualizacao = Date.now();
  next();
});

// Método para verificar se a tarefa está atrasada
taskSchema.methods.verificarSeAtrasada = function() {
  const agora = new Date();
  if (this.status !== 'Concluída' && this.prazo < agora) {
    this.status = 'Atrasada';
    return true;
  }
  return false;
};

module.exports = mongoose.model('Task', taskSchema);