const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('project_management', 'root', 'admin', {
    host: 'localhost',
    port: 3307, // Definindo a porta como 3307
    dialect: 'mysql'
});

// Definir o modelo de Tarefa
const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM('pendente', 'concluída'),
        defaultValue: 'pendente',
    },
}, {
    timestamps: true,
});

// Definir o modelo de Usuário
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

// Sincronizar os modelos com o banco de dados
sequelize.sync();

// Rotas para o CRUD de Tarefas

// Criar uma nova tarefa
app.post('/tasks', async (req, res) => {
    const { title, description, status } = req.body;
    const task = await Task.create({ title, description, status });
    res.json(task);
});

// Ler todas as tarefas
app.get('/tasks', async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
});

// Atualizar uma tarefa
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    await Task.update({ title, description, status }, { where: { id } });
    res.send('Task updated');
});

// Deletar uma tarefa
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await Task.destroy({ where: { id } });
    res.send('Task deleted');
});

// Rotas de Autenticação

// Registrar um novo usuário
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword,
            email,
        });

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar o usuário' });
    }
});

// Login do usuário
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign({ id: user.id }, 'secreta-chave-jwt', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao autenticar o usuário' });
    }
});

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado, token ausente' });
    }

    try {
        const decoded = jwt.verify(token, 'secreta-chave-jwt');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token inválido' });
    }
};

// Exemplo de rota protegida
app.get('/dashboard', authMiddleware, (req, res) => {
    res.send('Acesso concedido ao dashboard');
});

// Iniciar o servidor
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
