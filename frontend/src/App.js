import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UsersList from "./components/UsersList";
import UserForm from "./components/UserForm";
import UserView from "./components/UserView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersList />} />
        <Route path="/new" element={<UserForm />} />
        <Route path="/:id" element={<UserView />} />
      </Routes>
    </Router>
  );
}

export default App;
