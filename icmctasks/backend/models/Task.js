const mongoose = require('../db');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nome: String,
  prazo: Date,
  status: {
    type: String,
    enum: ['Em andamento', 'Concluída', 'Atrasada'],
    default: 'Em andamento'
  }
});

module.exports = mongoose.model('Task', taskSchema);
