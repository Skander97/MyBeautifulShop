import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Sales from './components/Sales/Sales';
import Analytics from './components/Analytics/Analytics';
import Finance from './components/Finance/Finance';
import Admin from './components/Admin';  // Importer le composant Admin
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login/:view" element={<Login />} />
                        <Route path="/sales" element={<ProtectedRoute component={Sales} role="sales" />} />
                        <Route path="/analytics" element={<ProtectedRoute component={Analytics} role="analytics" />} />
                        <Route path="/finance" element={<ProtectedRoute component={Finance} role="finance" />} />
                        <Route path="/admin" element={<ProtectedRoute component={Admin} role="admin" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
