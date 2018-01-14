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