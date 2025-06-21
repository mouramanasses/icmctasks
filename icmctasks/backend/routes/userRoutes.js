const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload');
const User = require('../models/User');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.post('/upload/:id', upload.single('fotoPerfil'), async (req, res) => {
  try {
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fotoPerfil: imageUrl },
      { new: true } // retorna os dados atualizados
    );
    
    res.json(user); // ← IMPORTANTE! Retorna o usuário atualizado
  } catch (err) {
    console.error('Erro ao salvar imagem:', err);
    res.status(500).json({ error: 'Erro ao salvar imagem' });
  }
});
router.delete('/:id', userController.deleteUser);
module.exports = router;
