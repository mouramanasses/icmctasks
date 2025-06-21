const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante que a pasta uploads exista
const dir = path.join(__dirname, '../uploads');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
