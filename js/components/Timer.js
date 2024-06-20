class Timer {
    constructor() {
        this.timerInterval = null;
    }

    start() {
        let eTimer = document.querySelector('.timer');
        this.timerInterval = setInterval(() => {
            game.gGame.secsPassed++;

            let timeArray = new Date(game.gGame.secsPassed * 1000).toString().split(':');
            let minutes = timeArray[1];
            let seconds = timeArray[2].split(' ')[0];
            eTimer.innerText = `${minutes}:${seconds}`;
        }, 1000);
    }

    stop() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    setBestTime() {
        let levelSize = game.gLevel.size
        let level = levelSize === 4 ? 'bestTimeEasy' : levelSize ? 'bestTimeMedium' : 'bestTimeHard';

        let currentTime = game.gGame.secsPassed;

        if (!localStorage[level] || currentTime < localStorage[level]) {
            localStorage.setItem(level, currentTime);
            game.gLevel.bestTime = localStorage[level];
            this.renderBestTime();
        }
    }

    renderBestTime() {
        const bestTime = game.gLevel.bestTime;
        if (bestTime < 60)
            gBestTime.innerText = `😱 ${bestTime} seconds`;
        else if (bestTime > 60) {
            let mins = (bestTime / 60).toFixed(2);
            gBestTime.innerText = `😱 ${mins} minutes`;
        }
    }
}