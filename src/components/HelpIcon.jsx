// src/components/HelpIcon.jsx
import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import './HelpIcon.css';

const HelpIcon = () => {
  return (
    <a href="https://setwithfriends.com/help" target="_blank" rel="noopener noreferrer" className="help-icon-link">
      <FaQuestionCircle className="help-icon-svg" />
    </a>
  );
};

export default HelpIcon;
