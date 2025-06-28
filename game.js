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
    let dragClone = null;
    let originalPosition = null;
    
    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const shapesContainer = document.getElementById('shapes-container');
    const targetsContainer = document.getElementById('targets-container');
    const feedbackElement = document.getElementById('feedback');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    
    // Audio elements with error handling
    const successSound = document.getElementById('success-sound');
    const errorSound = document.getElementById('error-sound');
    
    // Game settings
    const SHAPE_TYPES = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];
    const COLORS = ['#FF5252', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF9800'];
    const BASE_POINTS = 100;
    const LEVEL_UP_THRESHOLD = 3;
    
    // Play sound with error handling
    function playSound(soundElement) {
        if (!soundElement) return;
        
        try {
            soundElement.currentTime = 0; // Rewind to start
            soundElement.play().catch(e => {
                console.error('Error playing sound:', e);
            });
        } catch (e) {
            console.error('Sound playback error:', e);
        }
    }
    
    // Initialize the game
    function initGame() {
        // Clear the containers
        shapesContainer.innerHTML = '';
        targetsContainer.innerHTML = '';
        
        // Set number of shapes based on level (3-6)
        const numShapes = Math.min(3 + Math.floor(level / 2), 6);
        const shapes = SHAPE_TYPES.slice(0, numShapes);
        
        // Reset game state
        totalPairs = shapes.length;
        matchedPairs = 0;
        
        // Update UI
        updateScore();
        updateLevelDisplay();
        
        // Create game elements
        createShapesAndTargets(shapes);
        setupEventListeners();
        
        // Show initial feedback
        feedbackElement.textContent = 'Drag the shapes to their matching holes!';
        feedbackElement.style.color = '#333';
    }
    
    // Update score display
    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }
    
    // Update level display
    function updateLevelDisplay() {
        levelElement.textContent = `Level: ${level}`;
    }
    
    // Create shapes and targets
    function createShapesAndTargets(shapes) {
        // Shuffle the shapes
        const shuffledShapes = [...shapes].sort(() => Math.random() - 0.5);
        
        // Create shapes and targets
        shapes.forEach((shapeType, index) => {
            createShape(shapeType, index);
            createTarget(shapeType, index);
        });
    }
    
    // Create a draggable shape
    function createShape(shapeType, index) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shape.draggable = true;
        shape.dataset.shape = shapeType;
        
        // Append to container
        shapesContainer.appendChild(shape);
    }
    
    // Create a target drop zone
    function createTarget(shapeType, index) {
        const target = document.createElement('div');
        target.className = 'target';
        target.dataset.shape = shapeType;
        
        targetsContainer.appendChild(target);
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Temporarily disable drag and drop event listeners for layout verification
        /*
        // Add event listeners to the document for mouse events
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        
        // Add event listeners to each shape for mouse down
        document.querySelectorAll('.shape').forEach(shape => {
            shape.addEventListener('mousedown', handleDragStart);
            shape.addEventListener('touchstart', handleTouchStart, { passive: false });
        });
        
        // Add touch event listeners to document
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        */
    }
    
    // Handle drag start (mouse)
    /*
    function handleDragStart(e) {
        const shape = e.target.closest('.shape');
        if (!shape) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        // Get the mouse position relative to the viewport
        const clientX = e.clientX;
        const clientY = e.clientY;
        
        // Calculate the offset from the mouse to the shape's top-left corner
        const shapeRect = shape.getBoundingClientRect();
        offsetX = clientX - shapeRect.left;
        offsetY = clientY - shapeRect.top;
        
        startDrag(shape, clientX, clientY);
    }
    */
    
    // Handle touch start
    /*
    function handleTouchStart(e) {
        const shape = e.target.closest('.shape');
        if (!shape) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const touch = e.touches[0];
        const clientX = touch.clientX;
        const clientY = touch.clientY;
        
        // Calculate the shape's position
        const shapeRect = shape.getBoundingClientRect();
        
        // Set the offset to be the center of the shape
        offsetX = shapeRect.width / 2;
        offsetY = shapeRect.height / 2;
        
        // Start dragging with the shape centered on the touch point
        startDrag(shape, clientX, clientY);
    }
    */
    
    // Start dragging
    /*
    function startDrag(element, clientX, clientY) {
        if (dragClone) return false;
        
        draggedItem = element;
        
        // Get the position and dimensions of the original element
        const rect = element.getBoundingClientRect();
        
        // Create a clone for dragging
        dragClone = element.cloneNode(true);
        dragClone.style.position = 'fixed';
        dragClone.style.width = `${rect.width}px`;
        dragClone.style.height = `${rect.height}px`;
        
        // Position the clone so that the touch point is at the center of the shape
        dragClone.style.left = `${clientX - offsetX}px`;
        dragClone.style.top = `${clientY - offsetY}px`;
        dragClone.style.margin = '0';
        dragClone.style.pointerEvents = 'none';
        dragClone.style.zIndex = '1000';
        dragClone.style.transform = 'scale(1.1)';
        dragClone.style.transition = 'none'; // Prevent any transitions during drag
        
        // Add to document
        document.body.appendChild(dragClone);
        
        // Hide original while dragging
        element.style.visibility = 'hidden';
        
        // Force a reflow to ensure the clone is in the DOM
        void dragClone.offsetHeight;
        
        // Store original position
        originalPosition = {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            parent: element.parentNode
        };
        
        // Initial position - use the current mouse position minus the offset
        // to ensure the shape stays under the cursor
        moveDrag(clientX, clientY);
        
        return true;
    }
    */
    
    // Handle drag move (mouse)
    /*
    function handleDragMove(e) {
        if (!dragClone) return;
        
        e.preventDefault();
        moveDrag(e.clientX, e.clientY);
    }
    */
    
    // Handle touch move
    /*
    function handleTouchMove(e) {
        if (!dragClone) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        moveDrag(touch.clientX, touch.clientY);
    }
    */
    
    // Move the dragged item
    /*
    function moveDrag(clientX, clientY) {
        if (!dragClone) return;
        
        // Update position, ensuring the shape stays under the cursor
        const x = clientX - offsetX;
        const y = clientY - offsetY;
        
        // Use transform for better performance
        dragClone.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
        
        // Highlight potential drop targets
        document.querySelectorAll('.target').forEach(target => {
            const targetRect = target.getBoundingClientRect();
            const isOver = clientX >= targetRect.left && 
                         clientX <= targetRect.right && 
                         clientY >= targetRect.top && 
                         clientY <= targetRect.bottom;
            
            target.style.boxShadow = isOver ? '0 0 10px 5px rgba(0, 150, 255, 0.5)' : 'none';
        });
    }
    */
    
    // Handle drag end (mouse)
    /*
    function handleDragEnd(e) {
        if (!dragClone) return;
        
        e.preventDefault();
        endDrag(e.clientX, e.clientY);
    }
    */
    
    // Handle touch end
    /*
    function handleTouchEnd(e) {
        if (!dragClone) return;
        
        e.preventDefault();
        const touch = e.changedTouches[0];
        endDrag(touch.clientX, touch.clientY);
    }
    */
    
    // End dragging
    /*
    function endDrag(clientX, clientY) {
        if (!dragClone || !draggedItem) return;
        
        // Reset target highlights
        document.querySelectorAll('.target').forEach(t => {
            t.style.boxShadow = 'none';
        });
        
        // Check for drop target
        const targets = document.elementsFromPoint(clientX, clientY);
        const target = targets.find(el => el.classList.contains('target'));
        
        if (target && checkMatch(target)) {
            // Don't reset drag here, let handleCorrectMatch handle it
            handleCorrectMatch(target);
        } else {
            handleIncorrectMatch();
            resetDrag();
        }
    }
    */
    
    // Check if shape matches target
    /*
    function checkMatch(target) {
        if (!draggedItem) return false;
        
        const shapeType = draggedItem.dataset.shape;
        const targetType = target.dataset.shape;
        
        return shapeType === targetType;
    }
    */
    
    // Handle correct match
    /*
    function handleCorrectMatch(target) {
        if (!draggedItem) return;
        
        // Play success sound
        playSound(successSound);
        
        // Calculate points
        const points = BASE_POINTS * level;
        score += points;
        
        // Update UI
        updateScore();
        
        // Move shape to target
        const rect = target.getBoundingClientRect();
        draggedItem.style.position = 'absolute';
        draggedItem.style.left = `${rect.left}px`;
        draggedItem.style.top = `${rect.top}px`;
        draggedItem.style.transform = 'none';
        draggedItem.style.pointerEvents = 'none';
        document.body.appendChild(draggedItem);
        
        // Store reference to draggedItem to prevent null reference
        const draggedElement = draggedItem;
        
        // Animate to target
        setTimeout(() => {
            try {
                if (!draggedElement || !target) return;
                
                draggedElement.style.transition = 'all 0.3s ease';
                draggedElement.style.left = '0';
                draggedElement.style.top = '0';
                draggedElement.style.transform = 'scale(0.8)';
                
                target.appendChild(draggedElement);
                
                // Update matched pairs
                matchedPairs++;
                
                // Check level completion
                if (matchedPairs >= totalPairs) {
                    level++;
                    
                    if (level > 5) {
                        // Game completed
                        feedbackElement.textContent = 'Congratulations! You completed all levels!';
                        feedbackElement.style.color = '#4CAF50';
                        createConfetti();
                        gameActive = false;
                    } else {
                        // Next level
                        feedbackElement.textContent = 'Level complete! Starting next level...';
                        feedbackElement.style.color = '#2196F3';
                        setTimeout(initGame, 1500);
                    }
                } else {
                    feedbackElement.textContent = 'Correct! Keep going!';
                    feedbackElement.style.color = '#4CAF50';
                }
            } finally {
                // Always reset the drag state after animation
                resetDrag();
            }
        }, 10);
    }
    */
    
    // Handle incorrect match
    /*
    function handleIncorrectMatch() {
        if (!draggedItem) return;
        
        // Play error sound
        playSound(errorSound);
        
        // Shake animation
        draggedItem.style.animation = 'shake 0.5s';
        
        // Reset animation and restore pointer events
        setTimeout(() => {
            if (draggedItem) {
                draggedItem.style.animation = '';
                draggedItem.style.pointerEvents = 'auto';
            }
            resetDrag();
        }, 500);
        
        // Update feedback
        feedbackElement.textContent = 'Try again!';
        feedbackElement.style.color = '#F44336';
    }
    */
    
    // Reset drag state
    /*
    function resetDrag() {
        if (dragClone) {
            if (dragClone.parentNode) {
                document.body.removeChild(dragClone);
            }
            dragClone = null;
        }
            
        if (draggedItem) {
            // Only reset position if the shape wasn't matched
            if (originalPosition && originalPosition.parent) {
                // Make sure the shape is visible and interactive
                draggedItem.style.visibility = 'visible';
                draggedItem.style.position = '';
                draggedItem.style.left = '';
                draggedItem.style.top = '';
                draggedItem.style.transform = '';
                draggedItem.style.pointerEvents = 'auto';
                draggedItem.style.transition = '';
                    
                // Only append if not already attached to a parent
                if (draggedItem.parentNode !== originalPosition.parent) {
                    originalPosition.parent.appendChild(draggedItem);
                }
            }
            draggedItem = null;
        }
    }
    */
    
    // Create confetti effect
    function createConfetti() {
        const colors = ['#ff9e7d', '#8ac4d0', '#a05cdf', '#ffd166', '#06d6a0'];
        const container = document.body;
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-20px';
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '1000';
            
            container.appendChild(confetti);
            
            // Animate
            const duration = Math.random() * 3 + 2;
            confetti.animate([
                { transform: `translateY(0) rotate(0)`, opacity: 1 },
                { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                easing: 'cubic-bezier(0.1, 0.8, 0.9, 1)',
                fill: 'forwards'
            });
            
            // Remove after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, duration * 1000);
        }
    }
    
    // Start the game
    initGame();
});
