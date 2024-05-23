import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const NewReward = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [recipientId, setRecipientId] = useState("");
  const [points, setPoints] = useState("");

  useEffect(() => {
    // Fetch all users
    fetch("/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setCurrentUser(data.find((user) => user.id === id));
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/users/${id}/p5`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipientId, points: parseInt(points, 10) }),
    }).then(() => navigate(`/${id}/p5`));
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div>
      <h1>Create New Reward</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipient:</label>
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a user
            </option>
            {users
              .filter((user) => user.id !== id)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Points:</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            min="1"
            max="100"
            required
          />
        </div>
        <div>
          <p>Current P5 Balance: {currentUser.p5Balance}</p>
        </div>
        <button
          type="submit"
          disabled={
            points > 100 || points <= 0 || points > currentUser.p5Balance
          }
        >
          Submit
        </button>
        <button type="button" onClick={() => navigate(`/${id}/p5`)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default NewReward;
