// src/components/FoundSetsCounter.jsx
import React from 'react';
import PropTypes from 'prop-types';

const FoundSetsCounter = ({ found, total }) => {
  return (
    <div className="found-sets-counter">
      <p>Found: {found} / {total}</p>
    </div>
  );
};

FoundSetsCounter.propTypes = {
  found: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default FoundSetsCounter;
