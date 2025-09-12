# Coding-group-80-

## NHL Player Tiers Website

A modern, responsive web application that categorizes NHL players into 5 tiers based on their points per season performance.

### Features

- **5-Tier System**: Players are automatically categorized into tiers based on current season points
- **Interactive Player Cards**: Click on any player's name to view detailed career statistics
- **Modern Design**: Clean, responsive interface with no purple colors as requested
- **Real-time Data**: Fetches live player data from the official NHL Stats API
- **Player Photos**: Displays player headshots with fallback placeholders

### Tier Categories

All tiers are organized by **points per season**:

1. **Tier 1: Elite** - 80+ points this season
2. **Tier 2: High Performers** - 60-79 points this season
3. **Tier 3: Solid Contributors** - 40-59 points this season  
4. **Tier 4: Role Players** - 20-39 points this season
5. **Tier 5: Developing Talent** - 0-19 points this season

### How to Use

1. Open `index.html` in your web browser
2. Wait for the player data to load (may take a few moments)
3. Browse players by tier category
4. Click on any player's name to view their detailed career statistics
5. Close the modal by clicking the X or pressing Escape

### Technical Details

- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Modern styling with flexbox/grid layouts and smooth animations
- **JavaScript ES6+**: Class-based architecture with async/await
- **NHL Stats API**: Official NHL API for player statistics
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Notes

- Player salary data is generated using realistic algorithms since the NHL Stats API doesn't provide salary information
- Player photos are loaded from the official NHL CDN with fallback placeholders
- The application gracefully handles API failures with sample data
- All animations and interactions are optimized for smooth performance

### Future Enhancements

- Integration with salary cap APIs for real salary data
- Advanced filtering and sorting options
- Team-based views
- Historical data comparison
- Export functionality for player lists
