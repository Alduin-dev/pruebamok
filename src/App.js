import React, { useEffect, useState, useMemo } from 'react';
import './App.css';
import styled from "styled-components"

function App() {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortByName, setSortByName] = useState(false);
  const [sortByLastName, setSortByLastName] = useState(false);
  const [sortByCountry, setSortByCountry] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://randomuser.me/api/?results=100');
      const data = await response.json();
      setUsers(data.results);
      setOriginalUsers(data.results);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  const handleDeleteUser = (index) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers.splice(index, 1);
      return updatedUsers;
    });
  };

  const memoizedUsers = useMemo(() => {
    if (filter.trim() === '') {
      return users;
    } else {
      return users.filter(user => user.location.country.toLowerCase().includes(filter.toLowerCase()));
    }
  }, [users, filter]);

  const restoreUsers = () => {
    setUsers(originalUsers);
    setFilter('');
    setSortByName(false);
    setSortByLastName(false);
    setSortByCountry(false);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortByName = () => {
    setSortByName(!sortByName);
    setUsers((prevUsers) => {
      const sortedUsers = [...prevUsers];
      sortedUsers.sort((a, b) =>
        sortByName
          ? a.name.first.localeCompare(b.name.first)
          : b.name.first.localeCompare(a.name.first)
      );
      return sortedUsers;
    });
  };

  const handleSortByLastName = () => {
    setSortByLastName(!sortByLastName);
    setUsers((prevUsers) => {
      const sortedUsers = [...prevUsers];
      sortedUsers.sort((a, b) =>
        sortByLastName
          ? a.name.last.localeCompare(b.name.last)
          : b.name.last.localeCompare(a.name.last)
      );
      return sortedUsers;
    });
  };

  const handleSortByCountry = () => {
    setSortByCountry(!sortByCountry);
    setUsers((prevUsers) => {
      const sortedUsers = [...prevUsers];
      sortedUsers.sort((a, b) =>
        sortByCountry
          ? a.location.country.localeCompare(b.location.country)
          : b.location.country.localeCompare(a.location.country)
      );
      return sortedUsers;
    });
  };

  return (
    <div className="App">
      <h1>Lista de Usuarios</h1>

      <Header>
        <button>Colorear filas</button>
        <button onClick={handleSortByCountry}>
          {sortByCountry ? "Ordenar por país ↑" : "Ordenar por país ↓"}
        </button>
        <button onClick={restoreUsers}>Restaurar Estado Inicial</button>
        <input type="text" value={filter} onChange={handleFilterChange} placeholder="Filtrar por país" />
      </Header>

      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>
              <button onClick={handleSortByName}>
                {sortByName ? "Nombre ↑" : "Nombre ↓"}
              </button>
            </th>
            <th>
              <button onClick={handleSortByLastName}>
                {sortByLastName ? "Apellido ↑" : "Apellido ↓"}
              </button>
            </th>
            <th>
              <button onClick={handleSortByCountry}>
                {sortByCountry ? "País ↑" : "País ↓"}
              </button>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {memoizedUsers.map((user, index) => (
            <tr key={index}>
              <td>
                <img src={user.picture.thumbnail} alt="User" />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => handleDeleteUser(index)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

const Header = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 32px;
`;