import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RewardHistory = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [rewardHistory, setRewardHistory] = useState([]);

  useEffect(() => {
    fetch(`/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch(`/users/${id}/rewards`)
      .then((res) => res.json())
      .then((data) => setRewardHistory(data));
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Reward History</h1>
      <p>Reward Balance: {user.rewardBalance}</p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date-Time</th>
            <th>Rewards Received</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody>
          {rewardHistory.map((reward, index) => (
            <tr key={reward.id}>
              <td>{index + 1}</td>
              <td>{reward.date}</td>
              <td>{reward.points}</td>
              <td>{reward.givenBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardHistory;
