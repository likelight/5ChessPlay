/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file
 * @author shenruoliang@baidu.com
 */
const event = __webpack_require__(2);
const GoChess = __webpack_require__(3);
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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * @file
 * @author shenruoliang@baidu.com
 */
let eventDeal = {};
eventDeal.emitter = (function () {
    let eventCallback = {};
    return {
        emit: (event) => {
            if (event) {
                let event = '$' + event;
                let cbs = eventCallback[event];
                const args = [].slice.call(arguments, 1);
                if (cbs) {
                    for (let i = 0; i < cbs.length; i++) {
                        cbs[i].apply(null, args);
                    }
                }
            }
        },
        on: (event, fn) => {
            if (event) {
                let event = '$' + event;
                if (eventCallback[event]) {
                    eventCallback[event].push(fn);
                } else {
                    eventCallback[event] = [fn];
                }
            }
        },
        off: (event, fn) =>{
            if (event) {
                event = '$' + event;
                const cbs = eventCallback[event];
                if (cbs && cbs.length) {
                    if (!fn) {
                        eventCallback[event] = null;
                    } else {
                        for (let i = 0; i < cbs.length; i++) {
                            let cb = cbs[i];
                            if (cb === fn) {
                                cbs.splice(i, 1);
                            }
                            return;
                        }
                    }
                }
            }

        }

    }
})();

module.exports = eventDeal;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * @file
 * @author shenruoliang@baidu.com
 */
const BLACKCHESS = 1;
const WHITECHESS = 2;

class GoChess {
    constructor(options) {
        this.options = options;
        this.num = this.options.num || 15; // 默认为15* 15棋盘
        this.width = this.options.width || 30; // 默认宽度30
        this.root = this.options.root;
        this.chessContainer = this.options.chessContainer;
        this.wins = [];
        this.playMode = options.mode || 1;  // 1, 默认为人人对战,  2 为人机对战
        this.init();
    };

    init() {
        // 表示是否一方获胜
        this.winFlag = false;
        // 表示走到哪一步
        this.current = 0;

        // 棋盘偏移X位置
        this.boardX = 0;

        // 棋盘偏移Y位置
        this.boardY = 0;

        this.wins = [];

        this.machineWin = [];
        this.manWin = [];


        // 表示下期历史
        this.stepHistory = [];

        this.turn = BLACKCHESS; // 默认黑子为先 1 黑子, 2 白子
        // 二维数组表示棋盘每一个棋盘可下的位置是否已被下, 0 为空 1 已下
        this.boardFlag = new Array();
        // 实际可以下的格数比棋盘多一个
        for (let i = 0; i < this.num; i++) {
            this.boardFlag[i] = new Array();
            for (let j = 0; j < this.num; j++) {
                this.boardFlag[i][j] = 0;
            }
        }

        this.initChessBorad();
        this.initChessContainer();
        if (this.playMode === 2) {
            this.manWin = [];  // 计数人赢规则数组
            this.machineWin = []; // 计数机器赢数组
            // 人机模式下获取赢法统计
            this.winCount = this.makeWins(this.num);
            for (let i = 0; i < this.winCount; i++) {
                this.manWin[i] = 0;
                this.machineWin[i] = 0;
            }
            console.log(this.winCount);
        }
        this.bindChessBoard();
        this.initComputer();

    }

    // 初始化ai
    initComputer() {
        this.makeWins(this.num);
    }

    // 初始化棋盘
    initChessBorad() {
        document.querySelector(this.root).innerHTML = '';
        this.drawBoard(this.num, this.width);
        this.boardX = document.querySelector(this.root).getBoundingClientRect().left;
        this.boardY = document.querySelector(this.root).getBoundingClientRect().top;
    }


    // 初始化棋子摆放容器
    initChessContainer() {
        document.querySelector(this.chessContainer).innerHTML = '';
        var len = this.num * this.width;
        document.querySelector(this.chessContainer).style.left = this.boardX + 'px';
        document.querySelector(this.chessContainer).style.top = this.boardY + 'px';
        document.querySelector(this.chessContainer).style.width = len + 'px';
        document.querySelector(this.chessContainer).style.height = len + 'px';
    }

    /**
     * 判断在水平方向上是否5子连线
     *
     * @param {number} x  x轴坐标
     * @param {number} y  y轴坐标
     * @param {number} turn  执棋顺序
     * @return {bool}  表示是否水平连线
     */
    checkHorizon(x, y, turn) {
        let match = false;
        let start, end;

        // 处于最左侧
        for (let index = 0; index < 5; index++) {
            start = x - index;
            end = x + 4 - index;

            if (start < 0 || end > this.num) {
                continue;
            }
            for (var i = start; i <= end; i++) {
                if (!this.boardFlag[i][y]) {
                    break;
                }
                if (this.boardFlag[i][y] !== turn) {
                    break;
                }
            }
            if (i === end + 1) {
                match = true;
                return true;
            }
        }

        return false;
    }

    /**
     * 判断在竖直方向上是否5子连线
     *
     * @param {number} x  x轴坐标
     * @param {number} y  y轴坐标
     * @param {number} turn  执棋顺序
     * @return {bool}  表示是否竖直连线
     */

    checkVertical(x, y, turn) {
        let match = false;
        let start, end;

        // 处于最上侧
        for (let index = 0; index < 5; index++) {
            start = y - index;
            end = y + 4 - index;

            if (start < 0 || end > this.num) {
                continue;
            }
            for (var i = start; i <= end; i++) {
                if (!this.boardFlag[x][i]) {
                    break;
                }
                if (this.boardFlag[x][i] !== turn) {
                    break;
                }
            }
            if (i === end + 1) {
                match = true;
                return true;
            }
        }
        return false;
    }

    /**
     * 判断在正斜线方向上是否5子连线
     *
     * @param {number} x  x轴坐标
     * @param {number} y  y轴坐标
     * @param {number} turn  执棋顺序
     * @return {bool}  表示是否正斜线连线5子
     */

    checkSlant(x, y, turn) {
        let match = false;
        let start, end;

        // 处于最左上角侧
        for (let index = 0; index < 5; index++) {
            start = x - index;
            end = x + 4 - index;
            if (start < 0 || end > this.num) {
                continue;
            }

            for (var i = start; i <= end; i++) {
                if (!this.boardFlag[i][y + i - x]) {
                    break;
                }
                if (this.boardFlag[i][y + i - x] !== turn) {
                    break;
                }
            }
            if (i === end + 1) {
                match = true;
                return true;
            }
        }

        return false;
    }

    /**
     * 判断在反斜线方向上是否5子连线
     *
     * @param {number} x  x轴坐标
     * @param {number} y  y轴坐标
     * @param {number} turn  执棋顺序
     * @return {bool}  表示是否反斜线连线5子
     */

    checkBackSlant(x, y, turn) {
        let match = false;
        let start, end;

        // 处于最左下角侧
        for (let index = 0; index < 5; index++) {
            start = x - index;
            end = x + 4 - index;
            if (start < 0 || end > this.num) {
                continue;
            }

            for (var i = start; i <= end; i++) {
                if (!this.boardFlag[i][y + x - i]) {
                    break;
                }
                if (this.boardFlag[i][y + x - i] !== turn) {
                    break;
                }
            }
            if (i === end + 1) {
                match = true;
                return true;
            }
        }

        return false;
    }

    /**
     * 判断一方是否获胜,在每次下棋之后判断
     *
     * @param {number} x  x轴坐标
     * @param {number} y  y轴坐标
     * @return {bool} flag 表示是否获胜
     */

    checkIsWin(x, y, turn) {
        let flag = false;
        flag = (
        this.checkHorizon(x, y, turn)  // 水平判断
        || this.checkVertical(x, y, turn)  // 纵向判断
        || this.checkSlant(x, y, turn)     // 斜线判断
        || this.checkBackSlant(x, y, turn));  // 反斜向判断
        return flag;
    };

    // 悔棋响应
    reset() {
        if (this.playMode === 1) {
            this.resetStep();
        } else if (this.playMode === 2) {
            // 在人机模式下悔棋返回到上一个人走的模式
            this.resetStep();
            this.resetStep();
        }
    }

    // 撤销悔棋响应
    reBack() {
        if (this.playMode === 1) {
            this.recoverReset();
        } else if (this.playMode === 2) {
            // 在人机模式下悔棋返回到上一个人走的模式
            this.recoverReset();
            this.recoverReset();
        }
    }

    // 悔棋操作
    resetStep() {
        if (this.stepHistory.length && !this.winFlag) {
            const step = this.stepHistory[this.current - 1];
            if (step) {
                // 撤销落子
                let dom = document.getElementById('X_' + step.x + 'Y_' + step.y + 'T_' + step.turn);
                dom.parentNode.removeChild(dom);
                this.boardFlag[step.x][step.y] = 0;
                this.current--;
                this.turn = step.turn;
            } else {
                alert('无可悔的步数');
            }
        }

    };

    // 撤销悔棋操作
    recoverReset() {
        const step = this.stepHistory[this.current];
        if (step && !this.winFlag) {
            this.drawChess(step.x, step.y, step.turn);
            this.boardFlag[step.x][step.y] = step.turn;
            this.current++;
            this.turn = step.turn === BLACKCHESS ? WHITECHESS : BLACKCHESS;
        } else {
            alert('无可撤销的悔棋');
        }
    };

    // 绑定监听
    bindChessBoard() {
        document.querySelector(this.chessContainer).onclick = event => {
            let clickX = event.offsetX;
            let clickY = event.offsetY;
            let offSetX = Math.round(clickX / this.width);
            let offSetY = Math.round(clickY / this.width);
            if (this.boardFlag[offSetX][offSetY] !== 0) {
                // 已有棋子情况下点击无效
                return;
            } else {
                if (this.winFlag) {
                    return;
                }
                this.boardFlag[offSetX][offSetY] = this.turn;
                this.drawChess(offSetX, offSetY, this.turn);


                if (this.checkIsWin(offSetX, offSetY, this.turn)) {
                    alert(this.turn === 1 ? '黑旗' + ': win!' : '白旗' + ': win!');
                    this.winFlag = true;
                }


                // 重置历史
                this.stepHistory.length = this.current;
                // 把下棋历史保存
                this.stepHistory.push({
                    x: offSetX,
                    y: offSetY,
                    turn: this.turn
                });
                this.current++;
                this.turn = (this.turn === BLACKCHESS ? WHITECHESS : BLACKCHESS);

                if (this.playMode === 2) {
                    let position = {};
                    for (let k = 0; k < this.winCount; k++) {
                        if (this.wins[offSetX][offSetY][k]) {
                            // 如果存在赢法,则玩家此赢法胜算+1(赢法为5胜取胜)
                            this.manWin[k]++;
                            // 如果存在赢法,则电脑此赢法胜算赋值为6(永远不等于5,永远无法在此处取胜)
                            this.machineWin[k] = 6;
                        }

                    }
                    // ai计算
                    position = this.aiCalc(this.winCount, this.num);
                    this.boardFlag[position.x][position.y] = 2;

                    this.drawChess(position.x, position.y, 2);
                    if (this.checkIsWin(position.x, position.y, 2)) {
                        alert('计算机赢了!');
                        this.winFlag = true;
                    }

                    for (let k = 0; k < this.winCount; k++) {
                        if (this.wins[position.x][position.y][k]) {
                            this.machineWin[k]++;
                            debugger;
                            this.manWin[k] = 6;
                        }
                    }

                    this.stepHistory.length = this.current;
                    // 把下棋历史保存
                    this.stepHistory.push({
                        x: position.x,
                        y: position.y,
                        turn: 2
                    });
                    console.log(this.stepHistory);
                    this.current++;

                    // 自动变为人的顺序
                    this.turn = BLACKCHESS;
                }


            }
        }
    };

    // 画棋子
    drawChess(x, y, order) {
        let dom = document.createElement('div');
        dom.setAttribute('id', 'X_' + x + 'Y_' + y + 'T_' + order);

        let leftOffset = this.width * x - this.width * 0.3;
        let topOffset = this.width * y - this.width * 0.3;

        dom.setAttribute('style', 'width:' + this.width * 0.6 + 'px; '
            + 'height:' + this.width * 0.6 + 'px; '
            + 'left:' + leftOffset + 'px; '
            + 'top:' + topOffset + 'px;');

        dom.className = 'chess ' + (order === BLACKCHESS ? 'black-chess' : 'white-chess');
        document.querySelector(this.chessContainer).appendChild(dom);

    };


    /**
     * 绘制棋盘
     *
     * @param {number} num 棋盘单边个数
     * @return {number} count 赢法总计
     */

    drawBoard(num, width) {
        let fragment = document.createDocumentFragment();
        for (let i = 1; i < num; i++) {
            let cell = document.createElement('div');
            cell.ClassName = 'row';
            for (let j = 1; j < num; j++) {
                let div = document.createElement('div');
                div.className = "square";
                cell.appendChild(div);
            }
            fragment.appendChild(cell);
        }
        document.querySelector(this.root).appendChild(fragment);
    }


    /**
     * 设置游戏模式
     *
     * @param {number} mode  1 表示人人对战, 2 表示人机对战
     * @return {void} no return
     */

    setPlayMode(mode) {
        this.playMode = mode;
        this.init();
    }


    /**
     * 生成赢法汇总
     *
     * @param {number}  棋盘格数
     * @return {void} no return
     */
    makeWins(num) {
        let count = 0;
        for (let i = 0; i < num; i++) {
            this.wins[i] = [];
            for (let j = 0; j < num; j++) {
                this.wins[i][j] = [];
            }
        }

        // 横向
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num - 4; j++) {
                for (let k = 0; k < 5; k++) {
                    this.wins[i][j + k][count] = true;
                }
                count++;
            }
        }

        // 纵向
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num - 4; j++) {
                for (let k = 0; k < 5; k++) {
                    this.wins[j + k][i][count] = true;
                }
                count++;
            }
        }

        // 斜向
        for (let i = 0; i < num - 4; i++) {
            for (let j = 0; j < num - 4; j++) {
                for (let k = 0; k < 5; k++) {
                    this.wins[i + k][j + k][count] = true;
                }
                count++;
            }
        }

        // 反斜向
        for (let i = 0; i < num - 4; i++) {
            for (let j = num - 1; j > 3; j--) {
                for (let k = 0; k < 5; k++) {
                    this.wins[i + k][j - k][count] = true;
                }
                count++;
            }
        }

        return count;
        console.log(count);
    }


    /**
     * 计算计算机下棋位置
     *
     * @param {number} count 赢法总数
     * @param {number} num 棋盘数
     * @return {object} {x, y} 机器应该下的的坐标
     */

    aiCalc(count, num) {
        let manScore = []; // 玩家下棋的潜在评价分
        let machineScore = []; // 机器分数
        let max = 0;
        let machineX = 0;
        let machineY = 0;  // 机器要下的棋子的坐标

        for (let i = 0; i < num; i++) {
            manScore[i] = [];
            machineScore[i] = [];
            for (let j = 0; j < num; j++) {
                manScore[i][j] = 0;
                machineScore[i][j] = 0;
            }
        }


        // 通过赢法统计数组为两个二维数组分别计分
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                if (this.boardFlag[i][j] === 0) {
                    for (let k = 0; k < count; k++) {
                        if (this.wins[i][j][k]) {
                            // 如果人已经下了一个了,那么棋子在人赢的可能性进行要加分
                            if (this.manWin[k] === 1) {
                                manScore[i][j] += 100;
                            } else if (this.manWin[k] === 2) {
                                manScore[i][j] += 200;
                            } else if (this.manWin[k] === 3) {
                                // 下到三个了则赢的可能性大大增加
                                manScore[i][j] += 1000;
                            } else if (this.manWin[k] === 4) {
                                // 下到4个一定要继续下
                                manScore[i][j] += 10000;
                            }

                            // 机器分数类似, 要比人略高
                            if (this.machineWin[k] === 1) {
                                machineScore[i][j] += 120;
                            } else if (this.machineWin[k] === 2) {
                                machineScore[i][j] += 250;
                            } else if (this.machineWin[k] === 3) {
                                machineScore[i][j] += 1500;
                            } else if (this.machineWin[k] === 4) {
                                machineScore[i][j] += 15000;
                            }
                        }
                    }

                    // 先计算阻碍人的最高分位置
                    if (manScore[i][j] > max) {
                        max = manScore[i][j];
                        machineX = i;
                        machineY = j;
                    } else if (manScore[i][j] === max) {
                        if (machineScore[i][j] > machineScore[machineX][machineY]) {
                            machineX = i;
                            machineY = j;
                        }
                    }

                    // 再计算机器自己的最高分位置
                    if (machineScore[i][j] > max) {
                        max = machineScore[i][j];
                        machineX = i;
                        machineY = j;
                    } else if (machineScore[i][j] === max) {
                        if (manScore[i][j] > manScore[machineX][machineY]) {
                            machineX = i;
                            machineY = j;
                        }
                    }
                }
            }
        }

        return {
            x: machineX,
            y: machineY
        }

    }
}

module.exports = GoChess;




/***/ })
/******/ ]);