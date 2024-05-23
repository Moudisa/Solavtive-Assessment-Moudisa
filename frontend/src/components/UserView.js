// UserView.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import P5TransferModal from "./P5TransferModal";

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [p5Balance, setP5Balance] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/${id}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setName(data.name);
          setP5Balance(data.p5Balance); // Set P5 balance
          setRewardBalance(data.rewardBalance); // Set reward balance
          setLoading(false);
        } else {
          console.error("Failed to fetch user");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.filter((u) => u.id !== id)); // Exclude current user
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUser();
    fetchUsers();
  }, [id]);

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleTransferPoints = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTransferP5Points = async (recipientId, amount) => {
    try {
      const response = await fetch(
        `http://localhost:5000/users/${id}/transfer-p5`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recipientId, amount }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setP5Balance(updatedUser.p5Balance);
        setRewardBalance(updatedUser.rewardBalance);
        setShowModal(false);
        navigate("/"); // Navigate back to home page
      } else {
        console.error("Failed to transfer P5 points");
      }
    } catch (error) {
      console.error("Error transferring P5 points:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSave}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button type="button" onClick={handleDeleteUser}>
          Delete User
        </button>
      </form>
      <button onClick={handleTransferPoints}>Transfer P5 Points</button>
      {showModal && (
        <P5TransferModal
          users={users} // Pass list of other users
          onClose={handleCloseModal}
          onTransfer={handleTransferP5Points}
        />
      )}
      <div>
        <h3>P5 Balance: {p5Balance}</h3>
        <h3>Reward Balance: {rewardBalance}</h3>
      </div>
    </div>
  );
};

export default UserView;
