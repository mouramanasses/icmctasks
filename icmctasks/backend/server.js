const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./db'); // importa a conexão com MongoDB

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api', taskRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.use('/uploads', express.static('uploads'));
