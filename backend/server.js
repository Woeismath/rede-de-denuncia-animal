const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Caminho para pasta public (fora do backend)
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
app.use(bodyParser.json());

// Criar pasta db se não existir
const dbPath = path.resolve(__dirname, 'db');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

// Conexão com SQLite
const db = new sqlite3.Database(path.join(dbPath, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
  } else {
    console.log('Conectado ao banco SQLite.');
  }
});

// Criar tabela se não existir (com a coluna telefone)
db.run(`
  CREATE TABLE IF NOT EXISTS denuncias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    telefone TEXT,
    mensagem TEXT
  )
`);

// Configurar transporte de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Rota POST para receber denúncias (incluindo telefone)
app.post('/enviar-denuncia', (req, res) => {
  const { nome, email, telefone, mensagem } = req.body;

  if (!nome || !email || !telefone || !mensagem) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  const stmt = db.prepare('INSERT INTO denuncias (nome, email, telefone, mensagem) VALUES (?, ?, ?, ?)');
  stmt.run(nome, email, telefone, mensagem, function (err) {
    if (err) {
      console.error('Erro ao salvar denúncia:', err.message);
      return res.status(500).send('Erro ao salvar denúncia.');
    }

    console.log('✅ Denúncia salva com sucesso!');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmação de recebimento da denúncia',
      text: `Olá ${nome},\n\nRecebemos sua denúncia e ela está sendo analisada.\n\nObrigado por contribuir com a proteção dos animais.\n\n- Equipe S.O.S PET 🐾`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar e-mail:', error);
        return res.status(500).send('Denúncia salva, mas falha ao enviar e-mail.');
      } else {
        console.log('📨 E-mail de confirmação enviado:', info.response);
        return res.status(200).send('Denúncia recebida com sucesso e e-mail enviado!');
      }
    });
  });
});

// Rota GET para API de denúncias (incluindo telefone)
app.get('/api/denuncias', (req, res) => {
  db.all('SELECT * FROM denuncias ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).send('Erro ao buscar denúncias.');
    res.json(rows);
  });
});

// Rota GET para páginas HTML
app.get('/admin', (req, res) => {
  res.sendFile(path.join(publicPath, 'admin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'login.html'));
});

// ✅ Rota POST para login com usuário e senha
app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body;
  const USER_CORRETO = process.env.ADMIN_USER;
  const SENHA_CORRETA = process.env.ADMIN_PASS;

  if (usuario === USER_CORRETO && senha === SENHA_CORRETA) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
});

