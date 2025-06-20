document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let draggedItem = null;
    let offsetX = 0;
    let offsetY = 0;
    let gameActive = true;
    let score = 0;
    let level = 1;
    let matchedPairs = 0;
    let totalPairs = 0;
    
    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const feedbackElement = document.getElementById('feedback');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const successSound = document.getElementById('success-sound');
    const errorSound = document.getElementById('error-sound');
    
    // Game settings
    const SHAPE_TYPES = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];
    const COLORS = ['#FF5252', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF9800'];
    const BASE_POINTS = 100;
    const LEVEL_UP_THRESHOLD = 3;
    
    // Initialize the game
    function initGame() {
        // Clear the game board
        gameBoard.innerHTML = '';
        
        // Determine number of shapes based on level
        const numShapes = Math.min(3 + Math.floor(level / 2), 6);
        const shapes = SHAPE_TYPES.slice(0, numShapes);
        totalPairs = shapes.length;
        matchedPairs = 0;
        
        // Update UI
        updateScore();
        updateLevelDisplay();
        
        // Create shapes and targets
        createShapesAndTargets(shapes);
        
        // Set up event listeners
        setupEventListeners();
        
        // Show initial message
        feedbackElement.textContent = 'Drag the shapes to their matching holes!';
        feedbackElement.style.color = '#333';
    }
    
    // Update score display
    function updateScore() {
        if (scoreElement) {
            scoreElement.textContent = `Score: ${score}`;
        }
    }
    
    // Update level display
    function updateLevelDisplay() {
        if (levelElement) {
            levelElement.textContent = `Level: ${level}`;
        }
    }
    
    // Create shapes and targets
    function createShapesAndTargets(shapes) {
        // Create shapes
        shapes.forEach((shape, index) => {
            createShape(shape, index);
        });
        
        // Create targets
        shapes.forEach((shape, index) => {
            createTarget(shape, index);
        });
    }
    
    // Create a draggable shape
    function createShape(shapeType, index) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shape.draggable = true;
        shape.dataset.shape = shapeType;
        
        // Style the shape
        shape.style.width = '80px';
        shape.style.height = '80px';
        shape.style.borderRadius = '10px';
        shape.style.backgroundColor = '#fff';
        shape.style.display = 'flex';
        shape.style.justifyContent = 'center';
        shape.style.alignItems = 'center';
        shape.style.cursor = 'grab';
        shape.style.position = 'absolute';
        shape.style.top = '50px';
        shape.style.left = `${100 + index * 100}px`;
        
        // Create inner shape
        const innerShape = document.createElement('div');
        innerShape.className = `inner-shape ${shapeType}`;
        
        // Style based on shape type
        innerShape.style.width = '60%';
        innerShape.style.height = '60%';
        innerShape.style.backgroundColor = COLORS[index % COLORS.length];
        
        switch(shapeType) {
            case 'circle':
                innerShape.style.borderRadius = '50%';
                break;
            case 'square':
                innerShape.style.borderRadius = '5px';
                break;
            case 'triangle':
                innerShape.style.width = '0';
                innerShape.style.height = '0';
                innerShape.style.backgroundColor = 'transparent';
                innerShape.style.borderLeft = '20px solid transparent';
                innerShape.style.borderRight = '20px solid transparent';
                innerShape.style.borderBottom = `40px solid ${COLORS[index % COLORS.length]}`;
                break;
            case 'star':
                innerShape.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
                break;
            case 'heart':
                innerShape.style.background = 'none';
                innerShape.innerHTML = '❤️';
                innerShape.style.fontSize = '40px';
                innerShape.style.lineHeight = '40px';
                break;
            case 'diamond':
                innerShape.style.transform = 'rotate(45deg)';
                break;
        }
        
        shape.appendChild(innerShape);
        gameBoard.appendChild(shape);
    }
    
    // Create a target drop zone
    function createTarget(shapeType, index) {
        const target = document.createElement('div');
        target.className = 'target';
        target.dataset.shape = shapeType;
        
        // Style the target
        target.style.width = '90px';
        target.style.height = '90px';
        target.style.border = '2px dashed #999';
        target.style.borderRadius = '15px';
        target.style.display = 'flex';
        target.style.justifyContent = 'center';
        target.style.alignItems = 'center';
        target.style.position = 'absolute';
        target.style.top = '200px';
        target.style.left = `${100 + index * 100}px`;
        
        gameBoard.appendChild(target);
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Mouse events
        document.addEventListener('mousedown', handleDragStart);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        
        // Touch events
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        
        // Reset button
        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', initGame);
        }
    }
    
    // Handle drag start (mouse)
    function handleDragStart(e) {
        if (e.button !== 0) return; // Only left click
        
        const element = e.target.closest('.shape');
        if (!element) return;
        
        e.preventDefault();
        startDrag(element, e.clientX, e.clientY);
    }
    
    // Handle touch start
    function handleTouchStart(e) {
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY).closest('.shape');
        if (!element) return;
        
        e.preventDefault();
        startDrag(element, touch.clientX, touch.clientY);
    }
    
    // Start dragging
    function startDrag(element, clientX, clientY) {
        if (!gameActive) return;
        
        draggedItem = element;
        const rect = element.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        
        element.style.zIndex = '1000';
        element.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    }
    
    // Handle drag move (mouse)
    function handleDragMove(e) {
        if (!draggedItem) return;
        e.preventDefault();
        moveDrag(e.clientX, e.clientY);
    }
    
    // Handle touch move
    function handleTouchMove(e) {
        if (!draggedItem) return;
        e.preventDefault();
        const touch = e.touches[0];
        moveDrag(touch.clientX, touch.clientY);
    }
    
    // Move the dragged item
    function moveDrag(clientX, clientY) {
        if (!draggedItem) return;
        
        draggedItem.style.left = `${clientX - offsetX}px`;
        draggedItem.style.top = `${clientY - offsetY}px`;
        
        // Highlight potential drop target
        const target = document.elementFromPoint(clientX, clientY)?.closest('.target');
        document.querySelectorAll('.target').forEach(t => t.classList.remove('highlight'));
        if (target && !target.classList.contains('matched')) {
            target.classList.add('highlight');
        }
    }
    
    // Handle drag end (mouse)
    function handleDragEnd(e) {
        if (!draggedItem) return;
        endDrag(e.clientX, e.clientY);
    }
    
    // Handle touch end
    function handleTouchEnd(e) {
        if (!draggedItem) return;
        const touch = e.changedTouches ? e.changedTouches[0] : e;
        endDrag(touch.clientX, touch.clientY);
    }
    
    // End dragging
    function endDrag(clientX, clientY) {
        if (!draggedItem) return;
        
        // Check for drop target
        const target = document.elementFromPoint(clientX, clientY)?.closest('.target');
        checkMatch(target);
        
        // Reset drag state
        resetDrag();
    }
    
    // Check if shape matches target
    function checkMatch(target) {
        if (!target || !draggedItem) return;
        
        const shapeType = draggedItem.dataset.shape;
        const targetType = target.dataset.shape;
        
        if (shapeType === targetType) {
            handleCorrectMatch(target);
        } else {
            handleIncorrectMatch();
        }
    }
    
    // Handle correct match
    function handleCorrectMatch(target) {
        target.classList.add('matched');
        target.innerHTML = '';
        target.style.border = 'none';
        target.style.background = 'transparent';
        
        // Animate shape to target
        const targetRect = target.getBoundingClientRect();
        draggedItem.style.transition = 'all 0.3s ease';
        draggedItem.style.left = `${targetRect.left}px`;
        draggedItem.style.top = `${targetRect.top}px`;
        draggedItem.style.transform = 'scale(0.9)';
        draggedItem.style.opacity = '0.8';
        
        // Update score
        const points = BASE_POINTS * level;
        score += points;
        updateScore();
        
        // Play success sound
        if (successSound) {
            successSound.currentTime = 0;
            successSound.play();
        }
        
        // Show feedback
        feedbackElement.textContent = `Correct! +${points} points`;
        feedbackElement.style.color = '#4CAF50';
        
        // Update match count
        matchedPairs++;
        
        // Check level completion
        setTimeout(() => {
            if (matchedPairs >= totalPairs) {
                if (level < 5) {
                    // Level up
                    level++;
                    updateLevelDisplay();
                    feedbackElement.textContent = `Level ${level} unlocked!`;
                    feedbackElement.style.color = '#FF9800';
                    
                    // Start next level
                    setTimeout(initGame, 1500);
                } else {
                    // Game complete
                    feedbackElement.textContent = `Congratulations! Final Score: ${score}`;
                    createConfetti();
                    gameActive = false;
                }
            }
        }, 500);
    }
    
    // Handle incorrect match
    function handleIncorrectMatch() {
        const points = -Math.floor(BASE_POINTS * 0.5);
        score = Math.max(0, score + points);
        updateScore();
        
        // Show feedback
        feedbackElement.textContent = `Try again! ${points} points`;
        feedbackElement.style.color = '#F44336';
        
        // Play error sound
        if (errorSound) {
            errorSound.currentTime = 0;
            errorSound.play();
        }
        
        // Shake animation
        if (draggedItem) {
            draggedItem.style.animation = 'shake 0.5s';
            setTimeout(() => {
                if (draggedItem) {
                    draggedItem.style.animation = '';
                }
            }, 500);
        }
    }
    
    // Reset drag state
    function resetDrag() {
        if (!draggedItem) return;
        
        // Remove highlights
        document.querySelectorAll('.target').forEach(t => t.classList.remove('highlight'));
        
        // Reset styles
        draggedItem.style.zIndex = '';
        draggedItem.style.boxShadow = '';
        draggedItem.style.transition = '';
        
        // Reset cursor
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        // Reset dragged item
        draggedItem = null;
    }
    
    // Create confetti effect
    function createConfetti() {
        const colors = ['#ff9e7d', '#8ac4d0', '#a05cdf', '#ffd166', '#06d6a0'];
        const container = document.body;
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.position = 'fixed';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '-20px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(confetti);
            
            // Animate
            const duration = Math.random() * 3 + 2;
            confetti.style.transition = `all ${duration}s ease-out`;
            
            setTimeout(() => {
                confetti.style.top = '100%';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                
                // Remove after animation
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.remove();
                    }
                }, duration * 1000);
            }, 0);
        }
    }
    
    // Start the game
    initGame();
});
