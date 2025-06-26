const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload');
const User = require('../models/User');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.put('/password/:id', userController.updatePassword);
router.post('/upload/:id', upload.single('fotoPerfil'), async (req, res) => {
  try {
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fotoPerfil: imageUrl },
      { new: true } 
    );
    
    res.json(user);
  } catch (err) {
    console.error('Erro ao salvar imagem:', err);
    res.status(500).json({ error: 'Erro ao salvar imagem' });
  }
});
router.delete('/:id', userController.deleteUser);
module.exports = router;
