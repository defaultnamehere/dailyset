# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a daily SET card game puzzle built with React and Vite. The game generates a daily puzzle using a seeded random number generator based on the Australia/Sydney timezone, ensuring all players get the same puzzle each day.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (base path: `/dailyset`)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture

### Core Game Logic (`src/utils/game.js`)
- **Card Representation**: Cards are encoded as 4-digit strings (e.g., "0123") representing color, shape, shade, and number
- **Set Validation**: Uses modular arithmetic to validate if three cards form a valid SET
- **Board Generation**: Algorithmically generates 12-card boards with exactly 6 valid sets
- **Seeded Randomness**: Uses `seedrandom` with daily seeds for consistent puzzles

### Main Application (`src/App.jsx`)
- **Game State**: Manages board, selected cards, found sets, and game completion
- **Daily Puzzles**: Seeds are generated from current date in Australia/Sydney timezone
- **Animations**: Includes confetti effects and card selection feedback
- **Local Storage**: Persists party mode preference
- **Debug Feature**: Press 'd' key to reveal all solutions

### Component Structure
- **Card**: Renders SET cards with SVG symbols, supports selection states and animations
- **FoundSetsSidebar**: Displays found sets using mini card representations
- **FoundSetsCounter**: Shows progress (X/6 sets found)
- **HelpIcon**: Game instructions and rules

### Card Encoding System
Cards use a 4-digit string where each digit (0-2) represents:
1. Color: Purple (0), Green (1), Red (2)
2. Shape: Squiggle (0), Oval (1), Diamond (2)
3. Shade: Filled (0), Outline (1), Striped (2)
4. Number: 1 (0), 2 (1), 3 (2)

### Set Validation Algorithm
A valid SET requires that for each attribute across three cards, the values are either all the same or all different. This is implemented using modular arithmetic: `(a + b + c) % 3 === 0` for each digit position.

## Styling
- CSS modules pattern with component-specific stylesheets
- Responsive design with mobile support
- Custom animations for correct/incorrect selections
- SVG-based card symbols with pattern masks for striped shading