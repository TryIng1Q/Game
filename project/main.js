(() => {
    let openTiles;
    let banTiles;
    let oldTiles;
    let oldTimer;
    let score;

    const PNG_STORAGE = [
        '1.png',
        '2.png',
        '3.png',
        '4.png',
        '5.png',
        '6.png',
        '7.png',
        '8.png',
        '9.png',
        '10.png',
        '11.png',
        '12.png',
        '13.png',
        '14.png',
        '15.png',
        '16.png',
        '17.png',
        '18.png',
        '19.png',
        '20.png',
        '21.png',
        '22.png',
        '23.png',
        '24.png',
        '25.png',
        '26.png',
        '27.png',
        '28.png',
        '29.png',
        '30.png',
        '31.png',
        '32.png',
        '33.png',
        '34.png',
        '35.png',
        '36.png',
        '37.png',
        '38.png',
        '39.png',
        '40.png',
        '41.png',
        '42.png',
        '43.png',
        '44.png',
        '45.png',
        '46.png',
        '47.png',
        '48.png'
    ];

    const MyFunction = {
        createTimer: function(oldTimer) {
            if (oldTimer != undefined) clearInterval(oldTimer);
            document.querySelector('.game__timer-title').style.display = 'inline-block';

            let timer = document.querySelector('.game__timer-title');
            let timerValue = 60;

            let timerInterval = setInterval(() => {
                if (timerValue <= 0) {
                    document.querySelector('.game-block').style.filter = 'blur(15px)';
                    document.querySelector('.menu').style.display = 'flex';
                    clearInterval(timerInterval);
                };
                timer.textContent = String(`${timerValue}s`);
                timerValue--;
            }, 1000);

            return timerInterval;
        },

        getRandomInt: (max) => Math.floor(Math.random() * max),

        createRandomArray: function(countTiles, iconArray) {
            let indexArray = [];

            while (indexArray.length != countTiles) {
                let randInt = this.getRandomInt(iconArray.length);
                if (!indexArray.includes(randInt)) indexArray.push(randInt, randInt);
            };
            return indexArray;
        },

        createShuffleArray: function(indexArray, countTiles, iconArray, oldTimer, playersCount) {
            let elementArray = [];

            for (let i of indexArray) {
                let element = document.createElement('div');

                element.setAttribute("id", i);
                element.classList.add('game-element');
                element.style.backgroundImage = `url(PNG-storage/${iconArray[i]})`;
                element.style.width = `${(900 - countTiles ** 0.5 * 40) / (Math.ceil(countTiles ** 0.5))}px`
                element.style.height = `${(860 - countTiles ** 0.5 * 40) / (Math.ceil(countTiles ** 0.5))}px`
                element.style.backgroundSize = '0px';
                element.addEventListener('click', this.getAnimationIcon(element, countTiles, oldTimer, playersCount));

                elementArray.push(element);
            };

            for (let i = elementArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [elementArray[i], elementArray[j]] = [elementArray[j], elementArray[i]];
            }

            return elementArray;
        },

        getAnimationIcon: function(element, maxTiles, oldTimer, playersCount) {
            return function() {
                let activPlayer = document.getElementById(score);
                activPlayer.style.backgroundColor = '#4DA8D5';
                openTiles++;
                element.classList.add('animation-style');
                setTimeout(() => {
                    console.log('open animation');
                    element.style.backgroundSize = '90%';
                }, 100);
                if (openTiles === 2) {
                    for (let item of document.querySelectorAll('.game-element')) {
                        item.style.pointerEvents='none';
                    };

                    if (oldTiles.id === element.id) {
                        if (score > playersCount) score = 1;
                        let activValue = activPlayer.textContent.split(' ');
                        activPlayer.textContent = `player ${score} : ${parseInt(parseInt(activValue[activValue.length - 1])) + 1}`;

                        banTiles.push(oldTiles, element);

                        setTimeout(() => {
                            if (banTiles.length == maxTiles) {
                                document.querySelector('.game__timer-title').textContent = '60s';
                                document.querySelector('.game-block').style.filter = 'blur(15px)';
                                document.querySelector('.menu').style.display = 'flex';
                                clearInterval(oldTimer);
                            }
                        }, 650)

                        setTimeout(() => {
                            activPlayer.style.backgroundColor = 'initial';
                            oldTiles.style.filter = `grayscale(100%)`;
                            element.style.filter = `grayscale(100%)`;
                        }, 400);
                    } else {
                        setTimeout(() => {
                            console.log('close animation');
                            activPlayer.style.backgroundColor = 'initial';
                            oldTiles.style.backgroundSize = '0';
                            oldTiles.classList.remove('animation-style');
                            oldTiles.classList.add('close-animation');
                            element.style.backgroundSize = '0';
                            element.classList.remove('animation-style');
                            element.classList.add('close-animation');
                        }, 600);
                    };

                    setTimeout(() => {
                        for (let item of document.querySelectorAll('.game-element')) {
                            if (!banTiles.includes(item)) {
                                item.style.pointerEvents= 'auto'
                            };
                        };
                    }, 600);
                    openTiles = 0;
                    score++
                    if (score > playersCount) score = 1;
                } else oldTiles = element;

                element.style.pointerEvents='none';
            }
        },

        removeOldElement: function() {
            for (let element of document.querySelectorAll('.game-element')) {
                element.remove();
            }
        },

        createGamesElement: function(shaffleArray, container) {
            this.removeOldElement();

            for (let element of shaffleArray) {
                container.append(element);
            };
        },

        createPlayers: function(countPlayers) {
            for (let element of document.querySelectorAll('.players-block__item')) {
                element.remove();
            };

            for (let i = 1; i <= countPlayers; ++i) {
                let item = document.createElement('em');
                item.textContent = `player ${i} : 0`;
                item.setAttribute('id', i);
                item.classList.add('players-block__item');
                document.querySelector('.players-block').append(item);
            };

            return document.querySelectorAll('.players-block__item');
        },

        startGame: function(countPlayers = 1, countTiles = 16, container, timer = false, iconArray) {
            openTiles = 0;
            banTiles = [];
            score = 1;

            if (timer === true) {
                oldTimer = this.createTimer(oldTimer);
            };
            let playersArray = this.createPlayers(countPlayers);
            let indexArray = this.createRandomArray(countTiles, iconArray);
            let shaffleArray = this.createShuffleArray(indexArray, countTiles, iconArray, oldTimer, countPlayers);
            this.createGamesElement(shaffleArray, container);
        }
    };



    document.addEventListener('DOMContentLoaded', () => {
        let container = document.querySelector('.container');

        MyFunction.startGame(1, 16, container, false, PNG_STORAGE);

        
        let startBtn = document.getElementById('gameStartBtn');
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();

            let blur = 15;
            let tiles = document.getElementById('tiles').value;
            let players = document.getElementById('players').value;
            let timer = document.getElementById('timerCheck').checked;

            if (tiles % 2 === 0) {
                document.querySelector('.menu').style.display = 'none';
                let blurInterval = setInterval(() => {
                    document.querySelector('.game-block').style.filter = `blur(${blur}px)`;
                    if (blur === 0) clearInterval(blurInterval);
                    blur--;
                }, 30);

                MyFunction.startGame(players, tiles, container, timer, PNG_STORAGE);
            } else {
                alert('Enter even number');
            };
        });
    });
})();