// src/components/FoundSetsSidebar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const FoundSetsSidebar = ({ foundSets, totalSets }) => {
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
        {/* <h2 className="sidebar-title">Found Sets</h2> */}
      </div>
      <div className="sidebar-content">
        {foundSets.length === 0 ? (
          <p className="no-sets-found"></p>
        ) : (
          <ul className="found-sets-list">
            {foundSets.map((set, index) => (
              <li key={index} className="found-set-item">
                {splitSetString(set).map((cardValue, cardIndex) => (
                  <div className="mini-card" key={cardIndex}>
                    <Card value={cardValue} size={14} />
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
  totalSets: PropTypes.number.isRequired,
};

export default FoundSetsSidebar;

