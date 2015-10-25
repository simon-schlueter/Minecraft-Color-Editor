var Constants = require('../Constants.jsx');

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

FormatParser.prototype.removeValue = function (arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
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
            var formats = parentFormats.slice();

            if (node.hasAttribute('color')) {
                color = this.parseColor(node.getAttribute('color'));
            }

            if (node.hasAttribute('style')) {
                if (node.style.color) {
                    color = this.parseColor(getComputedStyle(node).color);
                }

                var fontWeight = node.style.fontWeight;
                if (fontWeight == 'bold') {
                    this.addUniqueValue(formats, this.getFormatCode('bold'));
                } else if (fontWeight == 'normal' || fontWeight == 'initial' || fontWeight == '400') {
                    this.removeValue(formats, 'bold');
                }

                var fontStyle = node.style.fontStyle;
                if (fontStyle == 'italic') {
                    this.addUniqueValue(formats, this.getFormatCode('italic'));
                } else if (fontStyle == 'normal' || fontStyle == 'initial') {
                    this.removeValue(formats, 'italic');
                }

                var textDecoration = node.style.textDecoration;
                if (textDecoration) {
                    var decorations = textDecoration.split(' ');

                    this.removeValue(formats, 'underline');
                    this.removeValue(formats, 'strikethrough');

                    decorations.forEach(function (decoration) {
                        if (decoration == 'underline') {
                            this.addUniqueValue(formats, this.getFormatCode('underline'));
                        } else if (decoration == 'line-through') {
                            this.addUniqueValue(formats, this.getFormatCode('strikethrough'));
                        }
                    });
                }
            }

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

FormatParser.prototype.componentToHex = function componentToHex (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

FormatParser.prototype.rgbToHex = function rgbToHex (r, g, b) {
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