/**
 * @file
 * @author shenruoliang@baidu.com
 */
const event = require('./event');
const GoChess = require('./controller');
const goBang = new GoChess({
    num: 15,
    width: 60,
    root: '.play-container',
    chessContainer: '.chess-container',
    mode: 1
});

window.util = {
    // 默认人人对战
    mode: 1,
    init() {
        goBang.init();
    },
    resetStep() {
        goBang.reset();
    },
    recoverReset() {
        goBang.reBack();
    },
    setPlayMode(mode) {
        goBang.setPlayMode(mode);
    },
    toggleMode() {
        this.mode = this.mode === 1 ? 2 : 1;
        if (this.mode === 1) {
            document.getElementById('isMachine').innerText = '人机对战';
        } else if(this.mode === 2) {
            document.getElementById('isMachine').innerText = '人人对战';
        }
        this.setPlayMode(this.mode);
    }
};
