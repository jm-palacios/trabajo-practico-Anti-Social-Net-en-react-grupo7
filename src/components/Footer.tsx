import React from 'react';
export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto border-top border-secondary">
      <div className="container text-center small text-muted">
        <p className="mb-0">
          © {new Date().getFullYear()} UnaHur Anti-Social Net — Trabajo Práctico 2 (CIU)
        </p>
      </div>
    </footer>
  );
};