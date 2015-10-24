(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ColorEditor"] = factory();
	else
		root["ColorEditor"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var ColorButton = __webpack_require__(1);
	var FormatButton = __webpack_require__(2);
	var ResultPane = __webpack_require__(3);
	var FormatParser = __webpack_require__(5);
	var FormatImporter = __webpack_require__(6);
	var Constants = __webpack_require__(4);
	
	var ColorEditor = React.createClass({
	    displayName: 'ColorEditor',
	
	    propTypes: {
	        colors: React.PropTypes.object,
	        formats: React.PropTypes.object,
	        importFromUrl: React.PropTypes.bool
	    },
	
	    getInitialState: function getInitialState() {
	        return {
	            value: ''
	        };
	    },
	
	    getDefaultProps: function getDefaultProps() {
	        return {
	            colors: Constants.colors,
	            formats: Constants.formats,
	            importFromUrl: false
	        };
	    },
	
	    getImporter: function getImporter() {
	        return new FormatImporter(this.props.colors, this.props.formats);
	    },
	
	    setValue: function setValue(value) {
	
	        console.log('Importing: ' + value);
	
	        var html = this.getImporter().createHtml(value);
	
	        var editable = this.getEditable();
	
	        editable.innerHTML = '';
	
	        html.forEach(function (node) {
	            editable.appendChild(node);
	        });
	
	        console.log('Imported: ' + editable.innerHTML);
	
	        this.setState({
	            value: value
	        });
	    },
	
	    componentDidMount: function componentDidMount() {
	        this.getEditable().addEventListener('paste', this.onPaste);
	
	        if (this.props.importFromUrl) {
	            var urlImport = FormatImporter.getCodeFromUrl();
	            if (urlImport) {
	                this.setValue(urlImport);
	            }
	        }
	    },
	
	    componentWillUnmount: function componentWillUnmount() {
	        this.getEditable().removeEventListener('paste', this.onPaste);
	
	        if (this.urlTask) {
	            clearTimeout(this.urlTask);
	        }
	    },
	
	    onPaste: function onPaste(e) {
	        e.preventDefault();
	
	        var text = e.clipboardData.getData('text/plain');
	
	        if (Constants.formatRegex.test(text)) {
	            var dummy = document.createElement('DIV');
	
	            this.getImporter().createHtml(text).forEach(function (node) {
	                dummy.appendChild(node);
	            });
	
	            text = dummy.innerHTML;
	
	            console.log('Inserting: ' + text);
	        }
	
	        document.execCommand("insertHTML", false, text);
	    },
	
	    onSelectFormat: function onSelectFormat(format) {
	        switch (format) {
	            case 'bold':
	                {
	                    this.execCommand('bold');
	                    break;
	                }
	            case 'italic':
	                {
	                    this.execCommand('italic');
	                    break;
	                }
	            case 'reset':
	                {
	                    this.execCommand('removeFormat');
	                    break;
	                }
	            case 'strikethrough':
	                {
	                    this.execCommand('strikeThrough');
	                    break;
	                }
	            case 'underline':
	                {
	                    this.execCommand('underline');
	                    break;
	                }
	        }
	    },
	
	    onSelectColor: function onSelectColor(color) {
	        this.execCommand('foreColor', '#' + color);
	    },
	
	    execCommand: function execCommand(command, argument) {
	        document.execCommand(command, false, argument);
	
	        this.getEditable().focus();
	    },
	
	    updateUrl: function updateUrl() {
	        clearTimeout(this.urlTask);
	
	        if (!this.props.importFromUrl) {
	            return;
	        }
	
	        window.location.hash = '/editor_message=' + encodeURIComponent(this.state.value);
	    },
	
	    onInput: function onInput(event) {
	        //console.log('Res:', this.parseHtml());
	
	        if (this.urlTask) {
	            clearTimeout(this.urlTask);
	        }
	
	        this.urlTask = setTimeout(this.updateUrl, 350);
	
	        this.setState({
	            value: this.parseHtml()
	        });
	    },
	
	    parseHtml: function parseHtml() {
	        return new FormatParser(this.props.colors, this.props.formats).parse(this.getEditable().childNodes);
	    },
	
	    getEditable: function getEditable() {
	        return this.refs.editable;
	    },
	
	    render: function render() {
	        var buttons = [];
	
	        for (var code in this.props.colors) {
	            var color = this.props.colors[code];
	
	            buttons.push(React.createElement(
	                'li',
	                { key: code },
	                React.createElement(ColorButton, { color: color, onClick: this.onSelectColor })
	            ));
	        }
	
	        for (var code in this.props.formats) {
	            var format = this.props.formats[code];
	
	            buttons.push(React.createElement(
	                'li',
	                { key: code },
	                React.createElement(FormatButton, { format: format, onClick: this.onSelectFormat })
	            ));
	        }
	
	        return React.createElement(
	            'div',
	            _extends({}, this.props, { className: 'coloreditor' }),
	            React.createElement(
	                'div',
	                { className: 'coloreditor-buttons' },
	                React.createElement(
	                    'ul',
	                    null,
	                    buttons
	                )
	            ),
	            React.createElement('div', { className: 'coloreditor-editable', onInput: this.onInput, autoCapitalize: 'off', autoCorrect: 'off', contentEditable: true, spellCheck: false, ref: 'editable' }),
	            React.createElement(ResultPane, { value: this.state.value })
	        );
	    }
	
	});
	
	module.exports = ColorEditor;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	var ColorButton = React.createClass({
	    displayName: "ColorButton",
	
	    propTypes: {
	        color: React.PropTypes.string.isRequired,
	        onClick: React.PropTypes.func
	    },
	
	    onClick: function onClick() {
	        if (this.props.onClick) {
	            this.props.onClick(this.props.color);
	        }
	    },
	
	    render: function render() {
	        return React.createElement("button", { className: "coloreditor-colorbutton", onClick: this.onClick, style: { backgroundColor: '#' + this.props.color } });
	    }
	
	});
	
	module.exports = ColorButton;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var FormatButton = React.createClass({
	    displayName: "FormatButton",
	
	    propTypes: {
	        format: React.PropTypes.string.isRequired,
	        onClick: React.PropTypes.func
	    },
	
	    onClick: function onClick() {
	        if (this.props.onClick) {
	            this.props.onClick(this.props.format);
	        }
	    },
	
	    render: function render() {
	        return React.createElement(
	            "button",
	            { className: "coloreditor-formatbutton", onClick: this.onClick },
	            this.props.format[0]
	        );
	    }
	
	});
	
	module.exports = FormatButton;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Constants = __webpack_require__(4);
	
	var ResultPane = React.createClass({
	    displayName: 'ResultPane',
	
	    propTypes: {
	        value: React.PropTypes.string.isRequired
	    },
	
	    getInitialState: function getInitialState() {
	        return {
	            prefix: Constants.colorPrefixBukkit
	        };
	    },
	
	    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	        return nextProps.value !== this.props.value || nextState.prefix !== this.state.prefix;
	    },
	
	    setPrefix: function setPrefix(prefix) {
	        this.setState({
	            prefix: prefix
	        });
	    },
	
	    render: function render() {
	
	        var result = this.props.value;
	
	        result = result.replace(Constants.formatRegex, '<span class="highlight">' + this.state.prefix + '$2</span>');
	        result = result.replace(/\n/g, '<br />');
	
	        return React.createElement(
	            'div',
	            { className: 'coloreditor-result' },
	            React.createElement('div', { className: 'coloreditor-code', dangerouslySetInnerHTML: { __html: result } }),
	            React.createElement(
	                'div',
	                { className: 'coloreditor-prefix' },
	                React.createElement(
	                    'button',
	                    { className: this.state.prefix === Constants.colorPrefixVanilla && 'active', onClick: this.setPrefix.bind(this, Constants.colorPrefixVanilla) },
	                    'Vanilla ',
	                    Constants.colorPrefixVanilla
	                ),
	                React.createElement(
	                    'button',
	                    { className: this.state.prefix === Constants.colorPrefixBukkit && 'active', onClick: this.setPrefix.bind(this, Constants.colorPrefixBukkit) },
	                    'Bukkit ',
	                    Constants.colorPrefixBukkit
	                )
	            )
	        );
	    }
	
	});
	
	module.exports = ResultPane;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	var Constants = {
	    colors: {
	        '0': '000000',
	        '1': '0000AA',
	        '2': '00AA00',
	        '3': '00AAAA',
	        '4': 'AA0000',
	        '5': 'AA00AA',
	        '6': 'FFAA00',
	        '7': 'AAAAAA',
	        '8': '555555',
	        '9': '5555FF',
	        'a': '55FF55',
	        'b': '55FFFF',
	        'c': 'FF5555',
	        'd': 'FF55FF',
	        'e': 'FFFF55',
	        'f': 'FFFFFF'
	    },
	    formats: {
	        'l': 'bold',
	        'n': 'underline',
	        'o': 'italic',
	        'm': 'strikethrough',
	        'r': 'reset'
	    },
	    defaultColor: 'f',
	    colorPrefixBukkit: '&',
	    colorPrefixVanilla: '§',
	    formatRegex: /([&|§])([0-9a-flmnor])/g
	};
	
	module.exports = Constants;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Constants = __webpack_require__(4);
	
	function FormatParser(colors, formats, prefix) {
	    this.colors = colors;
	    this.formats = formats;
	    this.prefix = prefix || '&';
	
	    this.lastColor = Constants.defaultColor;
	    this.lastFormats = [];
	    this.lastDivBreak = false;
	    this.hasWrittenContent = false;
	}
	
	FormatParser.prototype.parse = function (nodes) {
	    return this.parseNodeTree(nodes, Constants.defaultColor, [], 0);
	};
	
	FormatParser.prototype.addLastFormat = function (format) {
	    this.addUniqueValue(this.lastFormats, format);
	};
	
	FormatParser.prototype.addUniqueValue = function (arr, value) {
	    if (arr.indexOf(value) === -1) {
	        arr.push(value);
	    }
	};
	
	FormatParser.prototype.parseNodeTree = function (nodes, parentColor, parentFormats, tree) {
	    var res = '';
	
	    for (var i = 0; i < nodes.length; ++i) {
	        var node = nodes[i];
	        var type = node.nodeType;
	
	        if (type === 3) {
	            if (this.lastColor != parentColor) {
	                res += this.prefix + parentColor;
	
	                this.lastColor = parentColor;
	                this.lastFormats = [];
	            }
	
	            if (parentFormats.length > 0) {
	                var needsReset = false;
	
	                if (this.lastFormats.length > parentFormats.length) {
	                    needsReset = true;
	                } else {
	                    for (var i2 = 0; i2 < this.lastFormats.length; ++i2) {
	                        if (parentFormats.indexOf(this.lastFormats[i2]) === -1) {
	                            needsReset = true;
	                            break;
	                        }
	                    }
	                }
	
	                if (needsReset) {
	                    res += this.prefix + parentColor;
	
	                    this.lastFormats = [];
	                }
	
	                parentFormats.forEach((function (format) {
	                    if (this.lastFormats.indexOf(format) !== -1) {
	                        return;
	                    }
	
	                    res += this.prefix + format;
	
	                    this.addLastFormat(format);
	                }).bind(this));
	            } else if (this.lastFormats.length > 0) {
	                res += this.prefix + parentColor;
	
	                this.lastFormats = [];
	            }
	
	            this.lastDivBreak = false;
	            this.hasWrittenContent = true;
	
	            res += node.textContent.replace(/\n/, '');
	        } else if (type === 1) {
	            var color = parentColor;
	
	            if (node.hasAttribute('color')) {
	                color = this.parseColor(node.getAttribute('color'));
	            }
	            if (node.hasAttribute('style')) {
	                if (node.style.color) {
	                    color = this.parseColor(getComputedStyle(node).color);
	                }
	            }
	
	            var formats = parentFormats.slice();
	
	            if (node.tagName == 'B') {
	                this.addUniqueValue(formats, this.getFormatCode('bold'));
	            } else if (node.tagName == 'I') {
	                this.addUniqueValue(formats, this.getFormatCode('italic'));
	            } else if (node.tagName == 'U') {
	                this.addUniqueValue(formats, this.getFormatCode('underline'));
	            } else if (node.tagName == 'STRIKE') {
	                this.addUniqueValue(formats, this.getFormatCode('strikethrough'));
	            } else if (node.tagName == 'BR') {
	                res += '\n';
	
	                continue;
	            }
	
	            // Don't break before a div a div already added a line or no content has been written before yet
	            if (res != '' && node.tagName == 'DIV' && !this.lastDivBreak && this.hasWrittenContent) {
	                this.lastDivBreak = true;
	
	                res += '\n';
	            }
	
	            res += this.parseNodeTree(node.childNodes, color, formats, tree + 1);
	        }
	    }
	
	    return res;
	};
	
	FormatParser.prototype.parseColor = function (colorString) {
	    if (colorString.indexOf('#') === 0) {
	        return this.getColorCode(colorString);
	    }
	
	    var rgb = colorString.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
	    var hex = this.rgbToHex(parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3]));
	
	    return this.getColorCode(hex);
	};
	
	FormatParser.prototype.componentToHex = function componentToHex(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	};
	
	FormatParser.prototype.rgbToHex = function rgbToHex(r, g, b) {
	    return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
	};
	
	FormatParser.prototype.getColorCode = function (color) {
	    for (var code in this.colors) {
	        if (this.colors[code] == color.replace('#', '').toUpperCase()) {
	            return code;
	        }
	    }
	
	    return '?';
	};
	
	FormatParser.prototype.getFormatCode = function (format) {
	    for (var code in this.formats) {
	        if (this.formats[code] == format) {
	            return code;
	        }
	    }
	
	    return '?';
	};
	
	module.exports = FormatParser;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Constants = __webpack_require__(4);
	
	function FormatImporter(colors, formats) {
	    this.colors = colors;
	    this.formats = formats;
	}
	
	FormatImporter.prototype.createHtml = function (raw) {
	    var lines = raw.split(/\n/);
	    var color = this.colors[Constants.defaultColor];
	    var formats = {};
	    var res = [];
	
	    for (var i = 0; i < lines.length; ++i) {
	        var line = lines[i];
	
	        var nodes = this.createLine(line, color, formats);
	
	        color = nodes[1];
	        formats = nodes[2];
	
	        // for pasting purposes
	        if (i == 0) {
	            nodes[0].forEach(function (node) {
	                res.push(node);
	            });
	        } else {
	            var div = document.createElement('DIV');
	
	            nodes[0].forEach(function (node) {
	                div.appendChild(node);
	            });
	
	            res.push(div);
	        }
	    }
	
	    return res;
	};
	
	FormatImporter.prototype.createLine = function (raw, oldColor, oldFormats) {
	    var skipNext = false;
	
	    var currentString = '';
	
	    var currentColor = oldColor;
	    var currentFormats = oldFormats;
	    var lastType = 'code';
	    var children = [];
	    var element = 0;
	
	    for (var i = 0; i < raw.length; ++i) {
	        var char = raw[i];
	
	        if (skipNext) {
	            skipNext = false;
	
	            continue;
	        }
	
	        var appendChar = false;
	
	        if (char == Constants.colorPrefixBukkit || char == Constants.colorPrefixVanilla) {
	
	            var code = raw[i + 1];
	            var type = '';
	
	            if (code == 'r') {
	                code = Constants.defaultColor;
	            }
	
	            var previousColor = currentColor;
	            var previousFormats = {};
	
	            for (var key in currentFormats) {
	                previousFormats[key] = currentFormats[key];
	            }
	
	            if (this.colors[code]) {
	                type = 'color';
	                currentColor = this.colors[code];
	            } else if (this.formats[code]) {
	                type = 'format';
	                currentFormats[this.formats[code]] = true;
	            } else {
	                appendChar = true;
	            }
	
	            // it's definitely an existing formatting code!
	            if (!appendChar) {
	                if (lastType == 'char') {
	                    children.push(this.createFormattedNode(element, currentString, previousColor, previousFormats));
	
	                    currentString = '';
	                    ++element;
	                }
	
	                if (code == 'r' || type == 'color') {
	                    currentFormats = {};
	                }
	
	                lastType = 'code';
	                skipNext = true;
	            }
	        } else {
	            appendChar = true;
	        }
	
	        if (appendChar) {
	            lastType = 'char';
	            currentString += char;
	        }
	    }
	
	    var lonelyBr = false;
	
	    if (element === 0 && currentString.trim() == '') {
	        children.push(document.createElement('BR'));
	    } else if (currentString != '' || element == 0) {
	        children.push(this.createFormattedNode(element, currentString, currentColor, currentFormats));
	    }
	
	    return [children, currentColor, currentFormats, lonelyBr];
	};
	
	FormatImporter.prototype.createFormattedNode = function (element, text, color, formatting) {
	    var parent = document.createElement('FONT');
	    parent.setAttribute('color', '#' + color);
	
	    var deepest = parent;
	
	    for (var format in formatting) {
	        var tag = '';
	
	        switch (format) {
	            case 'bold':
	                {
	                    tag = 'B';
	                    break;
	                }
	            case 'italic':
	                {
	                    tag = 'I';
	                    break;
	                }
	            case 'underline':
	                {
	                    tag = 'U';
	                    break;
	                }
	            case 'strikethrough':
	                {
	                    tag = 'STRIKE';
	                    break;
	                }
	        }
	
	        var e = document.createElement(tag);
	
	        deepest.appendChild(e);
	
	        deepest = e;
	    }
	
	    deepest.innerHTML = text;
	
	    return parent;
	};
	
	FormatImporter.getUrlQuery = function () {
	    var queryString = window.location.hash.substr(2).split('&');
	
	    if (queryString == '') {
	        return {};
	    }
	
	    var query = {};
	
	    for (var i = 0; i < queryString.length; ++i) {
	        var parts = queryString[i].split('=', 2);
	        if (parts.length == 1) {
	            query[parts[0]] = "";
	        } else {
	            query[parts[0]] = decodeURIComponent(parts[1].replace(/\+/g, " "));
	        }
	    }
	
	    return query;
	};
	
	FormatImporter.getCodeFromUrl = function () {
	    var code = FormatImporter.getUrlQuery().editor_message;
	
	    if (!code) {
	        return null;
	    }
	
	    return code;
	};
	
	module.exports = FormatImporter;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=coloreditor.js.map