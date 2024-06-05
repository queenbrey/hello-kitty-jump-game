const hello = document.querySelector('.hello');
const yut = document.querySelector('.yut');

const jump = () => {
    hello.classList.add('jump');

    setTimeout(() => {

    hello.classList.remove('jump');

    } , 500)
}

const loop = setInterval(() => {

    const yutPosition = yut.offsetLeft;
    const helloPosition = +window.getComputedStyle(hello).bottom.replace('px', '');

    if (yutPosition <= 55 && yutPosition > 0 && helloPosition < 65) {

        yut.style.animation = 'none';
        yut.style.left = `${yutPosition}px`;

        hello.style.animation = 'none';
        hello.style.bottom = `${helloPosition}px`;

        hello.src = './images/game-over.gif';
        hello.style.width = '100px'
        hello.style.bottom = '75px'

        clearInterval(loop);
    } 
}, 10)

document.addEventListener('keydown', jump);
