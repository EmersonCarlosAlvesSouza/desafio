import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pendente');
    const [editingTaskId, setEditingTaskId] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
    };

    const startEditingTask = (task) => {
        setEditingTaskId(task.id);
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
    };

    const updateTask = async () => {
        if (editingTaskId) {
            await axios.put(`http://localhost:5000/tasks/${editingTaskId}`, { title, description, status });
            fetchTasks();
            setTitle('');
            setDescription('');
            setStatus('pendente');
            setEditingTaskId(null);
            toast.success('Tarefa editada com sucesso!');
        }
    };

    const createTask = async () => {
        await axios.post('http://localhost:5000/tasks', { title, description, status });
        fetchTasks();
        setTitle('');
        setDescription('');
        setStatus('pendente');
        setEditingTaskId(null);
        toast.success('Tarefa criada com sucesso!');
    };

    const deleteTask = async (id) => {
        await axios.delete(`http://localhost:5000/tasks/${id}`);
        fetchTasks();
        toast.success('Tarefa deletada com sucesso!');
    };

    return (
        <div className="app-container">
            <h1>Gerenciamento de Tarefas</h1>
            <div className="task-form">
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="pendente">Pendente</option>
                    <option value="concluída">Concluída</option>
                </select>
                <button onClick={editingTaskId ? updateTask : createTask}>
                    {editingTaskId ? 'Atualizar Tarefa' : 'Criar Tarefa'}
                </button>
            </div>

            <div className="task-list">
                {tasks.map(task => (
                    <div key={task.id} className="task-item">
                        <h2>{task.title}</h2>
                        <p>{task.description}</p>
                        <p>Status: {task.status}</p>
                        <p>Criado em: {new Date(task.createdAt).toLocaleString()}</p>
                        <p>Atualizado em: {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'Não atualizado'}</p>
                        <button onClick={() => startEditingTask(task)} className="edit-button">✏️</button>
                        <button onClick={() => deleteTask(task.id)} className="delete-button">🗑️</button>
                    </div>
                ))}
            </div>

            <ToastContainer />
        </div>
    );
}

export default App;
