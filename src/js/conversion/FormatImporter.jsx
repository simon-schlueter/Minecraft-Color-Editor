var Constants = require('../Constants.jsx');

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

    return [
        children,
        currentColor,
        currentFormats,
        lonelyBr
    ];
};

FormatImporter.prototype.createFormattedNode = function (element, text, color, formatting) {
    var parent = document.createElement('FONT');
    parent.setAttribute('color', '#' + color);

    var deepest = parent;

    for (var format in formatting) {
        var tag = '';

        switch (format) {
            case 'bold': {
                tag = 'B';
                break;
            }
            case 'italic': {
                tag = 'I';
                break;
            }
            case 'underline': {
                tag = 'U';
                break;
            }
            case 'strikethrough': {
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

    for (var i = 0; i < queryString.length; ++i)
    {
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