const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

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

// Sincronizar o modelo com o banco de dados
sequelize.sync();

// Rotas para o CRUD

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

// Iniciar o servidor
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
