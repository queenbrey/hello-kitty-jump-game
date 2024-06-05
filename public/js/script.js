document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('background-music');
    const startButton = document.getElementById('start-game');
    const scoreElement = document.getElementById('score');
    let score = 0;
    let gameLoop;

    const startGame = () => {
        backgroundMusic.play();
        startButton.style.display = 'none';
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        gameLoop = setInterval(updateGame, 100);
    };

    startButton.addEventListener('click', startGame);

    const hello = document.querySelector('.hello');
    const yut = document.querySelector('.yut');

    const jump = () => {
        hello.classList.add('jump');

        setTimeout(() => {
            hello.classList.remove('jump');
        }, 500);
    };

    const updateGame = () => {
        const yutPosition = yut.offsetLeft;
        const helloPosition = +window.getComputedStyle(hello).bottom.replace('px', '');

        if (yutPosition <= 55 && yutPosition > 0 && helloPosition < 65) {
            yut.style.animation = 'none';
            yut.style.left = `${yutPosition}px`;

            hello.style.animation = 'none';
            hello.style.bottom = `${helloPosition}px`;

            hello.src = './images/game-over.gif';
            hello.style.width = '100px';
            hello.style.bottom = '75px';

            clearInterval(gameLoop);
        } else {
            score++;
            scoreElement.textContent = `Score: ${score}`;
        }
    };

    document.addEventListener('keydown', jump);
});
