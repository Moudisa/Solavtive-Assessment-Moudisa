import React, { useState } from "react";

const P5TransferModal = ({ users, onClose, onTransfer, id }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Recipient:", recipient);
    console.log("Amount:", amount);
    if (recipient && amount > 0) {
      onTransfer(recipient, parseInt(amount, 10));
    } else {
      console.error("Recipient and amount must be selected");
    }
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
            {users
              .filter((user) => user._id !== id)
              .map((user) => (
                <option key={user.id} value={user.id}>
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
