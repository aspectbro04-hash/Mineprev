
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Contest from './pages/Contest';
import PrivateChat from './pages/PrivateChat';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-zinc-950 font-sans text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/private" element={<PrivateChat />} />
              <Route path="/contest" element={<Contest />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
