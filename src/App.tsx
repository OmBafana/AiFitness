import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import WorkoutPlanner from './pages/WorkoutPlanner';
import DietPlanner from './pages/DietPlanner';
import AIChat from './pages/AIChat';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedPlans from './pages/SavedPlans';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/workout-planner" element={<WorkoutPlanner />} />
            <Route path="/diet-planner" element={<DietPlanner />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-plans" element={<SavedPlans />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;