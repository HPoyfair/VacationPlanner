import React from 'react';
import './style.css';

// Footer component in TypeScript
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div>
        <p>&copy; {currentYear} VacationPlanner LLC. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;