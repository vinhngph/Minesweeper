class SoundManage {
    constructor() {
        this.win = new Audio('./assets/audio/win.mp3');
        this.lose = new Audio('./assets/audio/lose.wav');
        this.bomb = new Audio('./assets/audio/bomb.mp3');
    }

    winSound() {
        this.win.play();
    }

    loseSound() {
        this.lose.play();
    }

    bombSound() {
        this.bomb.play();
    }
}