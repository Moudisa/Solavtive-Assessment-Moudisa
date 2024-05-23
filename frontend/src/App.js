import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UsersList from "./components/UsersList";
import UserForm from "./components/UserForm";
import UserView from "./components/UserView";
import P5History from "./components/P5History";
import RewardHistory from "./components/RewardHistory";
import NewReward from "./components/NewReward";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersList />} />
        <Route path="/new" element={<UserForm />} />
        <Route path="/:id" element={<UserView />} />
        <Route path="/:id/p5" element={<P5History />} />
        <Route path="/:id/rewards" element={<RewardHistory />} />
        <Route path="/:id/rewards/new" element={<NewReward />} />
      </Routes>
    </Router>
  );
}

export default App;
