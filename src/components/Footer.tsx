import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <small>
          &copy; {new Date().getFullYear()} <strong>UnaHur Anti-Social Net</strong> — Proyecto de CIU (Grupo 7)
        </small>
      </div>
    </footer>
  );
};

export default Footer;