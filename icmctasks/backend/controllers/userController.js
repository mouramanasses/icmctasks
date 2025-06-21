const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { nome, email, cpf, senha, dataNascimento } = req.body;

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = new User({
      nome,
      email,
      cpf,
      senha: hashedPassword,
      dataNascimento
    });

    await newUser.save();
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' });
  } catch (err) {
    console.error('Erro no registro:', err);  // <-- Log mais detalhado do erro
    res.status(500).json({ erro: 'Erro ao registrar usuário.' });
  }
};

exports.login = async (req, res) => {
  const { email, cpf, senha } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email }, { cpf }] });
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).send({ error: 'Credenciais inválidas' });
    }
    res.send({ 
        message: 'Login bem-sucedido',
        userId: user._id,
        user: {
            nome: user.nome,
            email: user.email
        }
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
