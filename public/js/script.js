document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const backgroundMusic = document.getElementById('background-music');
    const gameOverSound = new Audio('./audio/gameover.mp3');
    const jumpSound = new Audio('./audio/sound5.mp3'); // Add jump sound
    const buttonClickSound = new Audio('./audio/buttonclick.mp3');
    const startButton = document.getElementById('start-game');
    const resetButton = document.getElementById('reset-game');
    const scoreElement = document.getElementById('score');
    const playerNameInput = document.getElementById('player-name');
    const hello = document.querySelector('.hello');
    const yut = document.querySelector('.yut');
    const batbat = document.querySelector('.batbat');
    const clouds = document.querySelector('.clouds');
    const speedMessage = document.getElementById('speed-message');

    // Game variables
    let score = 0;
    let gameLoop;
    let isGameOver = false;
    let isJumping = false;
    let jumpTimeout;
    let startTime;
    let currentSpeed = 1;
    let gameTimer = 0;
    let gameTimerInterval;
    let isGameRunning = false; // Add this to track if game is running

    // Initialize - load saved name
    playerNameInput.value = localStorage.getItem('hk_playerName') || '';

    // Function to play button click sound
    const playButtonSound = () => {
        buttonClickSound.currentTime = 0;
        buttonClickSound.play();
    };

    const handleKeyPress = (event) => {
        if ((event.code === 'Space' || event.key === ' ') && !isGameOver && isGameRunning) {
            event.preventDefault(); // Prevent page scrolling
            jump();
        }
    };

    const updateSpeed = () => {
        const currentTime = Date.now();
        const elapsedSeconds = (currentTime - startTime) / 1000;
        
        if (elapsedSeconds >= 40 && currentSpeed === 1.5) {
            currentSpeed = 2;
            // Update animation speeds for second speed increase
            yut.style.animation = 'none';
            void yut.offsetWidth;
            yut.style.animation = `yut-animation ${3/currentSpeed}s infinite linear`;
            
            batbat.style.animation = 'none';
            void batbat.offsetWidth;
            batbat.style.animation = `batbat-animation ${4/currentSpeed}s infinite linear`;
            
            clouds.style.animation = 'none';
            void clouds.offsetWidth;
            clouds.style.animation = `clouds-animation ${8/currentSpeed}s infinite linear`;
            
            // Show speed message
            showSpeedMessage("Super Speed Mode!");
        }
        else if (elapsedSeconds >= 20 && currentSpeed === 1) {
            currentSpeed = 1.5;
            // Update animation speeds
            yut.style.animation = 'none';
            void yut.offsetWidth;
            yut.style.animation = `yut-animation ${3/currentSpeed}s infinite linear`;
            
            batbat.style.animation = 'none';
            void batbat.offsetWidth;
            batbat.style.animation = `batbat-animation ${4/currentSpeed}s infinite linear`;
            
            clouds.style.animation = 'none';
            void clouds.offsetWidth;
            clouds.style.animation = `clouds-animation ${8/currentSpeed}s infinite linear`;
            
            // Show speed message
            showSpeedMessage("Speed Up!");
        }
    };
    
    // Function to show speed message
    const showSpeedMessage = (message) => {
        speedMessage.textContent = message;
        speedMessage.classList.add('show');
        
        // Hide message after 1.5 seconds
        setTimeout(() => {
            speedMessage.classList.remove('show');
        }, 1500);
    };

    const startGame = () => {
        playButtonSound();
        const title = document.getElementById('game-title');
        title.style.opacity = '0';
        // Save player name
        const playerName = playerNameInput.value.trim() || 'Anonymous';
        localStorage.setItem('hk_playerName', playerName);
        setTimeout(() => {
            title.classList.add('hide-title');
        }, 300);
        // Start game
        resetGame();
        isGameRunning = true; // Set game as running
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
        startButton.style.display = 'none';
        resetButton.style.display = 'none';
        startTime = Date.now();
        currentSpeed = 1;
        gameLoop = setInterval(updateGame, 100);
    };

    const resetGame = () => {
        const title = document.getElementById('game-title');
        title.classList.remove('hide-title');
        title.style.opacity = '1';

        document.getElementById('game-over-title').classList.remove('show-game-over');

        clearInterval(gameLoop);
        isGameOver = false;
        isJumping = false; // Reset jumping state
        isGameRunning = false; // Reset game running state
        score = 0;
        scoreElement.textContent = `Score: 0`;

        // Reset character
        hello.src = './images/42Bx.gif';
        hello.style.width = '100px';
        hello.style.bottom = '0';
        hello.classList.remove('jump');
        void hello.offsetWidth;

        // Reset obstacles with base speed
        yut.style.animation = 'none';
        void yut.offsetWidth;
        yut.style.animation = 'yut-animation 3s infinite linear';
        yut.style.right = '-80px';
        
        batbat.style.animation = 'none';
        void batbat.offsetWidth;
        batbat.style.animation = 'batbat-animation 4s infinite linear';
        batbat.style.right = '-80px';

        // Reset clouds
        clouds.style.animation = 'none';
        void clouds.offsetWidth;
        clouds.style.animation = 'clouds-animation 8s infinite linear';

        // Reset sounds
        gameOverSound.pause();
        gameOverSound.currentTime = 0;
        
        // Reset button states
        startButton.style.display = 'block';
        resetButton.style.display = 'none';
    };

    const endGame = () => {
        if (isGameOver) return;
        
        isGameOver = true;
        isGameRunning = false; // Game is no longer running
        clearInterval(gameLoop);
        backgroundMusic.pause();
        gameOverSound.play();
        
        // Stop animations
        yut.style.animation = 'none';
        batbat.style.animation = 'none';
        clouds.style.animation = 'none';
        
        // Game over state
        hello.src = './images/game-over.gif';
        resetButton.style.display = 'block';
        
        // Show game over text
        document.getElementById('game-over-title').classList.add('show-game-over');
        
        // Save score
        window.addToLeaderboard(score);
    };

    const updateGame = () => {
        const yutPosition = yut.offsetLeft;
        const batbatPosition = batbat.offsetLeft;
        const helloPosition = +window.getComputedStyle(hello).bottom.replace('px', '');

        // Update speed based on time
        updateSpeed();

        // Collision detection
        if ((batbatPosition <= 85 && helloPosition < 65) || 
            (yutPosition <= 55 && yutPosition > 0 && helloPosition < 65)) {
            endGame();
        } else if (!isGameOver) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
        }
    };

    const jump = () => {
        if (isGameOver || isJumping || !isGameRunning) return;
        
        isJumping = true;
        
        // Play jump sound
        jumpSound.currentTime = 0;
        jumpSound.play();
        
        // Remove jump class first to reset animation
        hello.classList.remove('jump');
        void hello.offsetWidth; // Force reflow to restart animation
        hello.classList.add('jump');
        
        jumpTimeout = setTimeout(() => {
            hello.classList.remove('jump');
            isJumping = false;
        }, 700); // Match this to your CSS animation duration
    };

    // Event listeners
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', () => {
        playButtonSound();
        resetGame();
    });
    
    // Add both keydown and click/touch events for jumping
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', () => {
        if (!isGameOver && isGameRunning && !isJumping) {
            jump();
        }
    });
    
    // Add touch support for mobile
    document.addEventListener('touchstart', (event) => {
        if (!isGameOver && isGameRunning && !isJumping) {
            event.preventDefault();
            jump();
        }
    }, { passive: false });
});
