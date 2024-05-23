import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:5000/users");
    const data = await response.json();
    setUsers(data);
  };

  return (
    <div>
      <h2>Users List</h2>
      <button>
        <Link to="/new">Create New User</Link>
      </button>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>P5 Balance</th>
            <th>Reward Balance</th>
            <th>Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.p5Balance}</td>
              <td>{user.rewardBalance}</td>
              <td>
                <Link to={`/${user.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
