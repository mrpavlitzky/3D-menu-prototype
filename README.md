# 3D Menu Prototype

An interactive 3D menu prototype built with Three.js, featuring smooth animations and hover effects.

## Features

- **3D Interactive Menu Items**: Five menu items rendered in 3D space with Three.js
- **Hover Effects**: Menu items scale up and move forward when hovered
- **Click Interactions**: Visual feedback when menu items are clicked
- **Smooth Animations**: GSAP-powered animations for fluid transitions
- **Particle Background**: Ambient particles for visual depth
- **Responsive Design**: Adapts to different screen sizes

## Menu Items

- Home (Blue)
- About (Red)
- Services (Green)
- Portfolio (Orange)
- Contact (Purple)

## Technologies Used

- **Three.js** (r128): 3D rendering and scene management
- **GSAP** (3.11.4): Animation library for smooth transitions
- **Vanilla JavaScript**: Core interaction logic
- **CSS3**: Styling and layout

## How to Use

1. Open `index.html` in a modern web browser
2. Hover over menu items to see them scale and move forward
3. Click on menu items to select them (displays selection feedback)
4. The menu items gently float and rotate for a dynamic effect

## File Structure

```
3D-menu-prototype/
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── menu.js         # Three.js 3D menu implementation
└── README.md       # Project documentation
```

## Browser Compatibility

Works best in modern browsers with WebGL support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Local Development

Simply open `index.html` in your browser. No build process or server required as all dependencies are loaded from CDN.

## Future Enhancements

- Add navigation functionality to different pages
- Implement touch controls for mobile devices
- Add sound effects for interactions
- Create more complex 3D shapes and animations
- Add customizable themes and color schemes