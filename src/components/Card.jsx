// src/components/Card.jsx
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const COLORS = ['#9966CC', '#22CC22', '#FF3333']; // Brighter Purple, Green, Red
const SHAPES = ['squiggle', 'oval', 'diamond'];
const SHADES = ['filled', 'outline', 'striped'];

const Symbol = ({ color, shape, shade, mini }) => {
  const strokeColor = COLORS[color];
  const shapeId = `#${SHAPES[shape]}`;
  const shadeName = SHADES[shade];

  const fill = shadeName === 'outline' ? 'transparent' : strokeColor;
  const mask = shadeName === 'striped' ? 'url(#mask-stripe)' : '';
  const strokeWidth = mini ? 12 : 18;


  return (
    <svg
      className="card-symbol-svg"
      viewBox="0 0 200 400"
    >
      <use
        href={shapeId}
        fill={fill}
        mask={mask}
      />
      <use href={shapeId} stroke={strokeColor} fill="none" strokeWidth={strokeWidth} />
    </svg>
  );
};

Symbol.propTypes = {
  color: PropTypes.number.isRequired,
  shape: PropTypes.number.isRequired,
  shade: PropTypes.number.isRequired,
  mini: PropTypes.bool,
};

const Card = forwardRef(({ value, isSelected, onClick, animation, mini }, ref) => {
  const [color, shape, shade, number] = value.split('').map(Number);

  const animationClass = animation === 'correct' ? 'card-correct' : animation === 'incorrect' ? 'card-incorrect' : animation === 'already-found' ? 'card-already-found' : '';
  const selectedClass = isSelected ? 'is-selected' : '';
  const miniClass = mini ? 'mini' : '';

  return (
    <div
      ref={ref}
      className={`card ${selectedClass} ${animationClass} ${miniClass}`}
      onClick={onClick}
    >
      <div className="card-symbols">
        {Array.from({ length: number + 1 }).map((_, i) => (
          <Symbol
            key={i}
            color={color}
            shape={shape}
            shade={shade}
            mini={mini}
          />
        ))}
      </div>
    </div>
  );
});

Card.propTypes = {
  value: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  animation: PropTypes.oneOf(['correct', 'incorrect', 'already-found', null]),
  mini: PropTypes.bool,
};

Card.defaultProps = {
  isSelected: false,
  onClick: null,
  animation: null,
  mini: false,
};

export default Card;
