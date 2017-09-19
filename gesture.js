(function(ui, $) {
    var gestureMap = {
        'up': {
            finger: 1,
            checkAction: function(startEvent, moveEvent, isSingle, distance) {
                return direction('up', startEvent[0], moveEvent[0], isSingle, distance);
            }
        },
        'down': {
            finger: 1,
            checkAction: function(startEvent, moveEvent, isSingle, distance) {
                return direction('down', startEvent[0], moveEvent[0], isSingle, distance);
            }
        },
        'left': {
            finger: 1,
            checkAction: function(startEvent, moveEvent, isSingle, distance) {
                return direction('left', startEvent[0], moveEvent[0], isSingle, distance);
            }
        },
        'right': {
            finger: 1,
            checkAction: function(startEvent, moveEvent, isSingle, distance) {
                return direction('right', startEvent[0], moveEvent[0], isSingle, distance);
            }
        },
        // 缩放
        'scale': {
            finger: 2,
            checkAction: function(startEvent, moveEvent, isSingle, distance) {
                
            }
        },
        // 旋转
        'rotat': {
            finger: 2
        },
        // 捏
        'pinch': {
            finger: 3
        },
        // 放
        'drop': {
            finger: 3
        },
    }

    function direction(prefer, fromEvent, endEvent, isSingle, distance) {
        var y = fromEvent.clientY - endEvent.clientY,
            absY = Math.abs(y),
            dirY = y > 0 ? 'up' : 'down',
            disY = absY > distance;
        var x = fromEvent.clientX - endEvent.clientX,
            absX = Math.abs(x),
            dirX = x > 0 ? 'left' : 'right',
            disX = absX > distance;
        // 如果距离够了
        if (disX || disY) {
            if (isSingle) {
                return prefer == dirY || prefer == dirX ? 1 : -1;
            } else {
                return prefer == (absY > absX ? dirY : dirX) ? 1 : -1
            }
        } else {
            return 0;
        }
    }
    ui.gesture = function(opt) {
        var param = {
            type: opt.type, // 手势名称
            handle: opt.handle,
            distance: opt.distance || 10,
            duration: opt.duration || 300,
            selector: opt.selector || '',
            isSingle: opt.isSingle, // 是否单个方向
            onMove: opt.onMove,
            onEnd: opt.onEnd,
        };
        var gesture = gestureMap[param.type];
        var touches_start = [],
            touches_move = [],
            touches_end = [];
        $(param.handle).on("touchstart", opt.selector, start);
        $(param.handle).on("touchmove", opt.selector, move);
        $(param.handle).on('touchend', opt.selector, end)

        function start(event) {
            if (event.touches.length >= gesture.finger) {
                gesture.state = 1;
                touches_start = event.touches;
            }
        }

        function move(event) {
            var that = this;
            touches_move = event.touches;
            if (gesture.state == 1) {
                var dir = gesture.checkAction(touches_start, touches_move, param.isSingle, param.distance);
                // 足够距离后方向错误，停止判断
                if (dir === -1) {
                    gesture.state = 0;
                }
                // 足够距离后方向正确，修改状态
                else if (dir === 1) {
                    gesture.state = 2;
                }
            }
            if (gesture.state == 2) {
                param.onMove && param.onMove.call(that, touches_start[0], touches_move[0]);
                event.stopPropagation();
                event.preventDefault();
            }
        }

        function end(event) {
            var that = this;
            if (gesture.state == 2) {
                touches_end = event.touches;
                param.onEnd && param.onEnd.call(that, touches_start[0], touches_end[0]);
            }
        }
    }
    return ui;
})(window.bui = window.bui || {}, window.jQuery);