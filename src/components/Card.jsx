// src/components/Card.jsx
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const COLORS = ['#800080', '#008000', '#FF0000']; // Purple, Green, Red
const SHAPES = ['squiggle', 'oval', 'diamond'];
const SHADES = ['filled', 'outline', 'striped'];

const Symbol = ({ color, shape, shade }) => {
  const strokeColor = COLORS[color];
  const shapeId = `#${SHAPES[shape]}`;
  const shadeName = SHADES[shade];

  const fill = shadeName === 'outline' ? 'transparent' : strokeColor;
  const mask = shadeName === 'striped' ? 'url(#mask-stripe)' : '';

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
      <use href={shapeId} stroke={strokeColor} fill="none" strokeWidth={18} />
    </svg>
  );
};

Symbol.propTypes = {
    color: PropTypes.number.isRequired,
    shape: PropTypes.number.isRequired,
    shade: PropTypes.number.isRequired,
};

const Card = forwardRef(({ value, isSelected, onClick, animation }, ref) => {
  const [color, shape, shade, number] = value.split('').map(Number);

  const animationClass = animation === 'correct' ? 'card-correct' : animation === 'incorrect' ? 'card-incorrect' : '';
  const selectedClass = isSelected ? 'is-selected' : '';

  return (
    <div
      ref={ref}
      className={`card ${selectedClass} ${animationClass}`}
      onClick={onClick}
    >
      <div className="card-symbols">
        {Array.from({ length: number + 1 }).map((_, i) => (
          <Symbol
            key={i}
            color={color}
            shape={shape}
            shade={shade}
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
    animation: PropTypes.oneOf(['correct', 'incorrect', null]),
};

Card.defaultProps = {
  isSelected: false,
  onClick: null,
  animation: null,
};

export default Card;
