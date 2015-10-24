var ColorButton = require('./ColorButton.jsx');
var FormatButton = require('./FormatButton.jsx');
var ResultPane = require('./ResultPane.jsx');
var FormatParser = require('./conversion/FormatParser.jsx');
var FormatImporter = require('./conversion/FormatImporter.jsx');
var Constants = require('./Constants.jsx');

var ColorEditor = React.createClass({

    propTypes: {
        colors: React.PropTypes.object,
        formats: React.PropTypes.object,
        importFromUrl: React.PropTypes.bool
    },

    getInitialState: function () {
        return {
            value: ''
        };
    },

    getDefaultProps: function () {
        return {
            colors: Constants.colors,
            formats: Constants.formats,
            importFromUrl: false
        };
    },

    getImporter: function () {
        return new FormatImporter(this.props.colors, this.props.formats);
    },

    setValue: function (value) {

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

    componentDidMount: function () {
        this.getEditable().addEventListener('paste', this.onPaste);

        if (this.props.importFromUrl) {
            var urlImport = FormatImporter.getCodeFromUrl();
            if (urlImport) {
                this.setValue(urlImport);
            }
        }
    },

    componentWillUnmount: function () {
        this.getEditable().removeEventListener('paste', this.onPaste);

        if (this.urlTask) {
            clearTimeout(this.urlTask);
        }
    },

    onPaste: function (e) {
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

    onSelectFormat: function (format) {
        switch (format) {
            case 'bold': {
                this.execCommand('bold');
                break;
            }
            case 'italic': {
                this.execCommand('italic');
                break;
            }
            case 'reset': {
                this.execCommand('removeFormat');
                break;
            }
            case 'strikethrough': {
                this.execCommand('strikeThrough');
                break;
            }
            case 'underline': {
                this.execCommand('underline');
                break;
            }
        }
    },

    onSelectColor: function (color) {
        this.execCommand('foreColor', '#' + color);
    },

    execCommand: function (command, argument) {
        document.execCommand(command, false, argument);

        this.getEditable().focus();
    },

    updateUrl: function () {
        clearTimeout(this.urlTask);

        if (!this.props.importFromUrl) {
            return;
        }

        window.location.hash = '/editor_message=' + encodeURIComponent(this.state.value);
    },

    onInput: function (event) {
        //console.log('Res:', this.parseHtml());

        if (this.urlTask) {
            clearTimeout(this.urlTask);
        }

        this.urlTask = setTimeout(this.updateUrl, 350);

        this.setState({
            value: this.parseHtml()
        });
    },

    parseHtml: function () {
        return new FormatParser(this.props.colors, this.props.formats).parse(this.getEditable().childNodes);
    },

    getEditable: function () {
        return this.refs.editable;
    },

    render: function () {
        var buttons = [];

        for (var code in this.props.colors) {
            var color = this.props.colors[code];

            buttons.push(<li key={code}><ColorButton color={color} onClick={this.onSelectColor} /></li>);
        }

        for (var code in this.props.formats) {
            var format = this.props.formats[code];

            buttons.push(<li key={code}><FormatButton format={format} onClick={this.onSelectFormat} /></li>);
        }

        return (
            <div {...this.props} className="coloreditor">
                <div className="coloreditor-buttons">
                    <ul>
                        {buttons}
                    </ul>
                </div>

                <div className="coloreditor-editable" onInput={this.onInput} autoCapitalize="off" autoCorrect="off" contentEditable={true} spellCheck={false} ref="editable"></div>

                <ResultPane value={this.state.value} />
            </div>
        );
    }

});

module.exports = ColorEditor;