import React, { useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([
    { name: "admin", email: "admin@teste.com", phone: "65656565" },
    { name: "gerente", email: "gerente@teste.com", phone: "78787878" },
  ]);

  return (
    <div className="App">
      <div className="container">
        <h2>USUÁRIOS</h2>
        <form className="user-form">
          <input type="text" placeholder="Nome" />
          <input type="email" placeholder="E-mail" />
          <input type="text" placeholder="Telefone" />
          <input type="date" placeholder="Data de Nascimento" />
          <button type="submit">SALVAR</button>
        </form>
        <div className="user-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Fone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button className="edit-btn">✎</button>
                    <button className="delete-btn">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
