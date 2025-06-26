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
    console.error('Erro no registro:', err);
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
            email: user.email,
            fotoPerfil: user.fotoPerfil
        }
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-senha');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, dataNascimento } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { nome, email, dataNascimento },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { senha: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar senha:', err);
    res.status(500).json({ error: 'Erro ao atualizar senha' });
  }
};