import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const P5History = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [p5History, setP5History] = useState([]);

  useEffect(() => {
    fetch(`/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch(`/users/${id}/rewards`)
      .then((res) => res.json())
      .then((data) => setP5History(data));
  }, [id]);

  const handleDelete = (rewardId) => {
    fetch(`/rewards/${rewardId}`, {
      method: "DELETE",
    }).then(() => {
      setP5History(p5History.filter((r) => r.id !== rewardId));
    });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>P5 History</h1>
      <Link to={`/${id}/rewards/new`}>Create New Reward</Link>
      <p>P5 Balance: {user.p5Balance}</p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date-Time</th>
            <th>P5 Given</th>
            <th>User Name</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {p5History.map((reward, index) => (
            <tr key={reward.id}>
              <td>{index + 1}</td>
              <td>{reward.date}</td>
              <td>{reward.points}</td>
              <td>{reward.givenTo}</td>
              <td>
                <button onClick={() => handleDelete(reward.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default P5History;
