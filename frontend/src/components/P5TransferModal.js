// P5TransferModal.js

import React, { useState } from "react";

const P5TransferModal = ({ users, onClose, onTransfer }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform validation and call onTransfer function
    onTransfer(recipient, parseInt(amount, 10)); // Parse amount to ensure it's a number
  };

  return (
    <div>
      <h2>Transfer P5 Points</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Recipient:
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            <option value="">Select recipient</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {" "}
                {/* Use user._id instead of user.id */}
                {user.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <button type="submit">Transfer</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default P5TransferModal;
