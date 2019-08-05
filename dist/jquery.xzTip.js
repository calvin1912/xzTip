/*
	xzTip
		提供鼠标悬停、点击等事件的信息提示，支持图片、文本风格展示。

	Copyright (c) 2019 calvin

	MIT License
	http://www.opensource.org/licenses/mit-license.php

    version	: v0.1.1
    data    : 2019-8-5
	author	: calvin
	email	: bwcui@qq.com
 */

(function ($) {
	var methods = {
        init: function (options) { // 初始化方法
            // 定时器ID关联数组，数组键保存 XZTIP_INDEX，值为定时器 ID
            var TIME_ID         = new Array();
            // tip 索引，每当为控件绑定此插件时，索引+1
            var XZTIP_INDEX     = (window.xzTip_INDEX = (window.xzTip_INDEX ? (window.xzTip_INDEX + 1) : 1));
            
            // 入口参数默认值
            var defOptions = {
                open            : 'mouseIn',
                showOpenBtn     : false,
                close           : 'mouseOut',
                showCloseBtn    : false,
                delayCloseTime  : 500,
                dataType        : 'text',
                style           : 'adsorption',
                adsorptionPos   : 'LL|LU',
                overlay         : false
            };
            var opts = jQuery.extend(defOptions, options);
            if(opts.style != 'window'){
                opts.overlay = false;
            }

            // 遮罩层
            if(opts.overlay){
                $('<div class="xztip-overlay" data-xztip-index="' + XZTIP_INDEX + '" data-xztip-state="close"></div>').appendTo('body');
            }
            // 弹出层
            var div = $('<div class="xztip" style="display:none;" data-xztip-index="' + XZTIP_INDEX + '"></div>').appendTo('body');
            // 弹出层标题
            if(opts.header){
                div.append('<div class="xztip-header">' + opts.header + '</div>');
            }
            // 弹出层关闭按钮
            if(opts.showCloseBtn){
                div.append('<div class="xztip-' + (opts.header ? 'header' : 'icon') + '-close"></div>');
            }
            // 弹出层容器
            var bodyCls = 'xztip-body' + (opts.bodyCls ? (' ' + opts.bodyCls) : '');
            div.append('<div class="' + bodyCls + '" style="' + ((opts.dataType != 'image') ? 'padding:5px 10px;' : 'padding:1px;') + '"></div>');
            
            // 获取 tip 状态：close、open、closing
            function getState(index){
                return $('.xztip[data-xztip-index="' + index + '"]').attr('data-xztip-state');
            }

            // 显示提示控件
            function openTip(target, value){
                var index = target.attr('data-xztip-index');
                if(value == undefined || value == null || value == ''){
                    return;
                }
                
                // 鼠标重复移入控件时忽略本次操作
                if(target.hasClass('xztip-actived')){
                    clearTimeout(TIME_ID[index]);
                    return;
                }

                // 移除旧控件“激活”样式
                $('.xztip-actived[data-xztip-index="' + index + '"]').removeClass('xztip-actived');
                // 为新控件增加“激活”样式
                target.addClass('xztip-actived');

                // 显示遮罩层
                if(opts.overlay) $('.xztip-overlay[data-xztip-index="' + index + '"]').show();
                
                // 加载弹出层
                switch(opts.dataType){
                case 'image':
                    loadImage(value, target, index);
                    break;
                case 'text':
                default:
                    loadText(value, target, index);
                    break;
                }
            }
            
            // 加载文本
            function loadText(text, target, index){
                var w, h;
                if(opts.width && opts.height){
                    w = opts.width, h = opts.height;
                }else if(opts.width){
                    w = opts.width;
                    h = target.outerHeight(true) * 3;
                }else if(opts.height){
                    h = opts.height;
                    w = target.outerWidth(true);
                }else{
                    w = target.outerWidth(true);
                    h = target.outerHeight(true) * 3;
                }
                
                var pos = getPosition(target, w, h);
                var span = $('<span>' + text + '</span>');
                if(opts.onClick){
                    span.click = function(){
                        opts.onClick(this);
                    };
                }
                $('.xztip[data-xztip-index="' + index + '"]')
                    .stop()
                    .attr('data-xztip-state', 'open')
                    .css({width: w, height: h, left: pos.left, top: pos.top})
                    .children('.xztip-body').html('').append(span)
                    .parent().slideDown();
            }
            // 获取坐标
            function getPosition(target, tipWidth, tipHeight){
                switch(opts.style){
                case 'window':
                    return _getPositionForWindow(target, tipWidth, tipHeight);
                case 'adsorption':
                default:
                    return _getPositionForAdsorption(target, tipWidth, tipHeight);
                }
            }
            // 获取居于浏览器中间的坐标
            function _getPositionForWindow(target, tipWidth, tipHeight) {
                var result = {
                    top    : Math.ceil(($(window).height() - tipHeight) / 2 + $(document).scrollTop()),
                    left   : Math.ceil(($(window).width() - tipWidth) / 2)
                };
                if(result.top < 0) result.top = 0;
                if(result.left < 0) result.left = 0;
                
                return result;  
            };
            // 获取吸附于指定控件的坐标
            function _getPositionForAdsorption(target, tipWidth, tipHeight) {
                var tarSize = { width: target.outerWidth(true), height: target.outerHeight(true) };
                var origin  = { top: target.offset().top, left: target.offset().left };
                var posArr  = (opts.adsorptionPos.indexOf('|') > 0 ? opts.adsorptionPos : 'LL|LU').split('|');
                var tarPos  = _getAddCoordinate(origin, posArr[0], tarSize);
                var tipPos  = _getLessCoordinate(tarPos, posArr[1], { width: tipWidth, height: tipHeight });                
                
                if(((tipPos.top + tipHeight) > $(document).height()) && ((origin.top - tipHeight) >= 0)){
                    tipPos.top = origin.top - tipHeight;
                }
                
                return tipPos;  
            };
            
            // 获取相对某个坐标原点的加值操作
            function _getAddCoordinate(origin, pos, size){
                var result = { top: origin.top, left: origin.left };
                switch(pos){ // LU、LL、RU、RL
                case 'LU': // 左上
                    break;
                case 'LL': // 左下
                    result.top  += size.height;
                    break;
                case 'RU': // 右上
                    result.left += size.width;
                    break;
                case 'RL': // 右下
                    result.top  += size.height;
                    result.left += size.width;
                    break;
                default:
                    break;
                }
                return result;
            }
            // 获取相对某个坐标原点的减值操作
            function _getLessCoordinate(origin, pos, size){
                var result = { top: origin.top, left: origin.left };
                switch(pos){ // LU、LL、RU、RL
                case 'LU': // 左上
                    break;
                case 'LL': // 左下
                    result.top  -= size.height;
                    break;
                case 'RU': // 右上
                    result.left -= size.width;
                    break;
                case 'RL': // 右下
                    result.top  -= size.height;
                    result.left -= size.width;
                    break;
                default:
                    break;
                }
                return result;
            }
            
            // 加载图片
            function loadImage(url, target, index) {
                var img = new Image();
                img.src = url;
                if(opts.onClick){
                    img.onclick = function(){
                        opts.onClick(img);
                    };
                }
                if (img.complete) {
                    insertImage(target, img, index);
                } else {
                    img.onload = function () {
                        insertImage(target, img, index);
                        img.onload = null;
                    };
                };
            };
            // 向弹出层中插入图片并显示
            function insertImage(target, image, index){
                var w, h;
                if(opts.width && opts.height){
                    w = opts.width, h = opts.height;
                }else if(opts.width){
                    w = opts.width;
                    h = Math.ceil((opts.width * image.height) / image.width);
                }else if(opts.height){
                    h = opts.height;
                    w = Math.ceil((opts.height * image.width) / image.height);
                }else{
                    var autoSize = getImageAutoSize(target, image.width, image.height);
                    w = autoSize.width;
                    h = autoSize.height;
                }
                
                // 补偿边缘
                w += 4;
                h += 4;

                var pos = getPosition(target, w, h);
                if((image.width + 4) > w || (image.height + 4) > h){
                    image.width = w - 4;
                    image.height = h - 4;
                }
                $('.xztip[data-xztip-index="' + index + '"]')
                    .stop()
                    .attr('data-xztip-state', 'open')
                    .css({width: w, height: h, left: pos.left, top: pos.top})
                    .children('.xztip-body').html('').append(image)
                    .parent().slideDown();
            }
            function getImageAutoSize(target, width, height){
                var ctlWidth = target.outerWidth(true) - 4;
                var winWidth = $(window).width(), winHeight = $(window).height();
                
                // 根据吸附控件计算大小
                var w = ctlWidth > width ? width : ctlWidth;
                var h = Math.ceil((w * height) / width);
                
                // 根据大小及与 window 比例，计算实际大小
                var widthRatio = w / winWidth, heightRatio = h / winHeight;
                if(widthRatio > heightRatio && widthRatio > 0.5){
                    w = Math.ceil(winWidth / 2);
                    h = Math.ceil((w * height) / width);
                }else if(heightRatio > widthRatio && heightRatio > 0.5){
                    h = Math.ceil(winHeight / 2);
                    w = Math.ceil((h * width) / height);
                }
                
                return {width: w, height: h};
            }
            
            // 关闭弹出层
            function closeTip(index, delay){
                var tip = $('.xztip[data-xztip-index="' + index + '"]');
                if(delay){
                    _closeTipForDelay(tip, index);
                } else {
                    _closeTipForInstant(tip, index);
                }
            }
            // 延时关闭弹出层
            function _closeTipForDelay(tip, index){
                tip.attr('data-xztip-state', 'closing');

                TIME_ID[index] = setTimeout(function(){
                    if(tip.attr('data-xztip-state') == 'closing'){
                        _closeTipForInstant(tip, index); 
                    }
                }, opts.delayCloseTime);
            }
            // 立即关闭弹出层
            function _closeTipForInstant(tip, index){
                TIME_ID[index] = false;
                $('.xztip-actived[data-xztip-index="' + index + '"]').removeClass('xztip-actived');
                tip.slideUp('fast').attr('data-xztip-state', 'close');
                if(opts.overlay){
                    $('.xztip-overlay[data-xztip-index="' + index + '"]').hide();
                }
            }
            // 移除延迟关闭（动画）
            function removeDelayClose(index){
                if(TIME_ID[index]){
                    clearTimeout(TIME_ID[index]);
                }
            }
            
            // 窗口标题绑定拖动事件
            if(opts.header){
                $('.xztip[data-xztip-index="' + XZTIP_INDEX + '"] .xztip-header').mousedown(function(ev){
                    var win         = $(this).parent();
                    var evtX        = ev.clientX || ev.pageX;   // 点击坐标
                    var evtY        = ev.clientY || ev.pageY;
                    var winLeft     = win.offset().left;        // 弹出层坐标
                    var winTop      = win.offset().top;
                    var flag        = true;                     // 拖动开关
                    $(document).mousemove(function(e){     // 绑定鼠标移动事件
                        if(flag){
                            var left= (e.clientX || e.pageX) - evtX + winLeft;
                            var top = (e.clientY || e.pageY) - evtY + winTop;
                            win.css({"left": left + "px","top": top + "px"});
                        }
                    }).mouseup(function(){
                        flag = false;
                    });
                });
            }
            // 监听鼠标移入、移出弹层事件，以及关闭按钮事件
            $('.xztip[data-xztip-index="' + XZTIP_INDEX + '"]').hover(
                function(){
                    removeDelayClose($(this).attr('data-xztip-index'));
                },
                function(){
                    if(opts.close == 'mouseOut'){
                        closeTip($(this).attr('data-xztip-index'), true);
                    }
                }
            ).children('.xztip-icon-close,.xztip-header-close').on('click', function(){
                closeTip($(this).parent().attr('data-xztip-index'), false);
            });
            // 监听 ESC 按钮
            if(opts.escClose){
                $(document).keyup(function(e){
                    if((e.which || e.keyCode) == 27){
                        $('.xztip:visible').each(function(){
                            closeTip($(this).attr('data-xztip-index'), false);
                        });
                        e.stopPropagation();
                    }
                });
            }
            
            // 遍历所有绑定控件
            return this.each(function () {
                var _this = $(this);
                var target = _this;
                switch(typeof(opts.adsorptionTo)){
                case 'function':
                    var label = opts.adsorptionTo(_this);
                    if(label != null){
                        target = label;
                    }
                    break;
                case 'object':
                    target = opts.adsorptionTo;
                    break;
                case 'string':
                    target = $(opts.adsorptionTo);
                    break;
                }
                
				// 保存索引
				_this.attr('data-xztip-index', XZTIP_INDEX);
                target.attr('data-xztip-index', XZTIP_INDEX).addClass('xztip-field');
                if(opts.showOpenBtn){
                    target.addClass('xztip-btn-open');
                }

                // 绑定打开事件
                switch(opts.open){
                case 'mouseIn':
                    target.on('mouseover', function(){
                        var value = opts.data? opts.data : (_this.is('input') ? _this.val() : _this.html());
                        openTip($(this), value);
                    });
                    break;
                case 'click':
                    target.on('click', function(){
                        var value = opts.data? opts.data : (_this.is('input') ? _this.val() : _this.html());
                        openTip($(this), value);
                    });
                    break;
                }
                
                // 绑定关闭事件
                switch(opts.close){
                case 'mouseOut':
                    target.on('mouseout', function(){
                        var index = $(this).attr('data-xztip-index');
                        var state = $('.xztip[data-xztip-index="' + index + '"]').attr('data-xztip-state')
                        if(state == 'open'){
                            closeTip(index, true);
                        }
                    });
                    break;
                }
                
            });
            
        },
        title: function (str) { // 标题获取/设置 方法
			var index = this.attr('data-xztip-index');
			var header  = $('.xztip[data-xztip-index="' + index + '"] .xztip-header');
			if(str == undefined){
				return header.length <= 0 ? null : header.text();
			}else{
				if(header.length > 0) header.html(str);
			}
        }
    };

    $.fn.xzTip = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method' + method + 'does not exist on jQuery.xzTip');
        }
    };

})(jQuery);