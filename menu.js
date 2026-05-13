// 3D Interactive Menu using Three.js
let scene, camera, renderer, menuItems = [];
let raycaster, mouse;
let hoveredItem = null;

// Constants
const MESSAGE_DISPLAY_DURATION = 2000; // milliseconds
const MS_TO_SECONDS = 0.001;

// Menu configuration
const menuConfig = [
    { label: 'Home', color: 0x3498db, position: { x: -3, y: 2, z: 0 } },
    { label: 'About', color: 0xe74c3c, position: { x: -1, y: 2, z: 0 } },
    { label: 'Services', color: 0x2ecc71, position: { x: 1, y: 2, z: 0 } },
    { label: 'Portfolio', color: 0xf39c12, position: { x: 3, y: 2, z: 0 } },
    { label: 'Contact', color: 0x9b59b6, position: { x: 0, y: -1, z: 0 } }
];

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x667eea, 10, 50);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 8;
    camera.position.y = 0;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.getElementById('menu-container').appendChild(renderer.domElement);

    // Raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 5, 10);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(-5, 5, 5);
    scene.add(spotLight);

    // Create menu items
    createMenuItems();

    // Add background particles
    createParticles();

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onMouseClick, false);

    // Start animation
    animate();
}

function createMenuItems() {
    menuConfig.forEach((config, index) => {
        // Create geometry for menu item
        const geometry = new THREE.BoxGeometry(1.5, 1, 0.3);
        const material = new THREE.MeshPhongMaterial({
            color: config.color,
            emissive: config.color,
            emissiveIntensity: 0.2,
            shininess: 100,
            specular: 0x444444
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(config.position.x, config.position.y, config.position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Store original properties
        mesh.userData = {
            label: config.label,
            originalColor: config.color,
            originalScale: { x: 1, y: 1, z: 1 },
            originalPosition: { ...config.position },
            index: index
        };

        // Create text sprite for label
        const sprite = createTextSprite(config.label);
        sprite.position.set(0, 0, 0.2);
        mesh.add(sprite);

        scene.add(mesh);
        menuItems.push(mesh);
    });
}

function createTextSprite(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;

    // Draw text
    context.fillStyle = 'white';
    context.font = 'Bold 40px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 128, 64);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 1, 1);

    return sprite;
}

function createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
}

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections
    const intersects = raycaster.intersectObjects(menuItems);

    // Reset previously hovered item
    if (hoveredItem && (!intersects.length || intersects[0].object !== hoveredItem)) {
        resetMenuItem(hoveredItem);
        hoveredItem = null;
    }

    // Highlight new hovered item
    if (intersects.length > 0) {
        const item = intersects[0].object;
        if (item !== hoveredItem) {
            hoveredItem = item;
            highlightMenuItem(item);
        }
    }
}

function onMouseClick(event) {
    if (hoveredItem) {
        selectMenuItem(hoveredItem);
    }
}

function highlightMenuItem(item) {
    // Animate scale up
    gsap.to(item.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 0.3,
        ease: 'power2.out'
    });

    // Animate position forward
    gsap.to(item.position, {
        z: item.userData.originalPosition.z + 1,
        duration: 0.3,
        ease: 'power2.out'
    });

    // Increase emissive intensity
    gsap.to(item.material, {
        emissiveIntensity: 0.5,
        duration: 0.3
    });
}

function resetMenuItem(item) {
    // Animate scale back to normal
    gsap.to(item.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
        ease: 'power2.out'
    });

    // Animate position back
    gsap.to(item.position, {
        z: item.userData.originalPosition.z,
        duration: 0.3,
        ease: 'power2.out'
    });

    // Reset emissive intensity
    gsap.to(item.material, {
        emissiveIntensity: 0.2,
        duration: 0.3
    });
}

function selectMenuItem(item) {
    // Create a pulse effect
    const originalScale = { x: item.scale.x, y: item.scale.y, z: item.scale.z };
    
    gsap.to(item.scale, {
        x: 1.4,
        y: 1.4,
        z: 1.4,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
        onComplete: () => {
            gsap.to(item.scale, {
                x: originalScale.x,
                y: originalScale.y,
                z: originalScale.z,
                duration: 0.2
            });
        }
    });

    // Flash effect
    gsap.to(item.material, {
        emissiveIntensity: 1,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });

    // Update info display
    const infoElement = document.querySelector('#info p');
    infoElement.textContent = `Selected: ${item.userData.label}`;
    setTimeout(() => {
        infoElement.textContent = 'Hover over menu items to interact • Click to select';
    }, MESSAGE_DISPLAY_DURATION);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate menu items slightly
    const time = Date.now() * MS_TO_SECONDS;
    menuItems.forEach((item, index) => {
        item.rotation.y = Math.sin(time + index) * 0.1;
        
        // Gentle floating animation
        const originalY = item.userData.originalPosition.y;
        item.position.y = originalY + Math.sin(time * 2 + index) * 0.1;
    });

    // Rotate camera slightly for dynamic view
    camera.position.x = Math.sin(time * 0.2) * 0.5;

    renderer.render(scene, camera);
}

// Check if GSAP is loaded - it's required for animations
if (typeof gsap === 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const infoElement = document.querySelector('#info p');
        if (infoElement) {
            infoElement.textContent = 'Error: Animation library failed to load. Please refresh the page.';
            infoElement.style.color = '#ff6b6b';
        }
    });
    throw new Error('GSAP library failed to load. Animations require GSAP to function properly.');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
