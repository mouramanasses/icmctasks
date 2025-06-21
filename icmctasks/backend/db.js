const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gerenciadorTarefas', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoose;