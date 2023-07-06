import React, { useEffect, useState, useMemo } from 'react';
import '../../App.css';
import styled from "styled-components"
import endpoint from '../../utils/endpoint';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortByName, setSortByName] = useState(false);
  const [sortByLastName, setSortByLastName] = useState(false);
  const [sortByCountry, setSortByCountry] = useState(false);
  const [colorRows, setColorRows] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${endpoint.listuser}`);
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

  const handleColorRows = () => {
    setColorRows(!colorRows);
  };

  return (
    <div className="App">
      <h1>Lista de Usuarios</h1>

      <Header>
        <ButtonControls onClick={handleColorRows}>
          {colorRows ? "Decolorar filas" : "Colorear filas"}
        </ButtonControls>
        <ButtonControls onClick={handleSortByCountry}>
          {sortByCountry ? "Ordenar por país ↑" : "Ordenar por país ↓"}
        </ButtonControls>
        <ButtonControls onClick={restoreUsers}>Restaurar Estado Inicial</ButtonControls>
        <input type="text" value={filter} onChange={handleFilterChange} placeholder="Filtrar por país" />
      </Header>

      <StyledTable>
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
              <StyledTableRow key={index} colorRows={colorRows}>
                <td>
                  <img src={user.picture.thumbnail} alt="User" />
                </td>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td>
                  <ButtonControls onClick={() => handleDeleteUser(index)}>Eliminar</ButtonControls>
                </td>
              </StyledTableRow>
            ))}
          </tbody>
        </table>
      </StyledTable>
    </div>
  );
}

const Header = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 32px;
`;

const StyledTable = styled.div`
  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead th {
    background-color: #f2f2f2;
  }
`;

const StyledTableRow = styled.tr`

  ${({ colorRows }) =>
    colorRows &&
    `
    &:nth-child(odd) {
      background-color: #112233;
      color: #ffffff;
    }
    &:nth-child(even) {
      background-color: #556677;
      color: #ffffff;
    }
  `}
  
`;

const ButtonControls = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #f7f7f7;
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: #646cff;
  }

  &:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
}`;