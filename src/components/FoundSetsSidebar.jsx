// src/components/FoundSetsSidebar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const FoundSetsSidebar = ({ foundSets }) => {
  // Helper function to split a set string (e.g., "012011212212") into an array of cards (e.g., ["0120", "1121", "2212"])
  const splitSetString = (setString) => {
    const cards = [];
    for (let i = 0; i < setString.length; i += 4) {
      cards.push(setString.substring(i, i + 4));
    }
    return cards;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p className="sidebar-title">Found Sets</p>
      </div>
      <div className="sidebar-content">
        {foundSets.length === 0 ? (
          <p className="no-sets-found">No sets found yet!</p>
        ) : (
          <ul className="found-sets-list">
            {foundSets.map((set, index) => (
              <li key={index} className="found-set-item">
                {splitSetString(set).map((cardValue, cardIndex) => (
                  <div className="mini-card" key={cardIndex}>
  <Card value={cardValue} mini />
</div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

FoundSetsSidebar.propTypes = {
  foundSets: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FoundSetsSidebar;

