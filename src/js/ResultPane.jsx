var Constants = require('./Constants.jsx');

var ResultPane = React.createClass({

    propTypes: {
        value: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
        return {
            prefix: Constants.colorPrefixBukkit
        };
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return nextProps.value !== this.props.value || nextState.prefix !== this.state.prefix;
    },

    setPrefix: function (prefix) {
        this.setState({
            prefix: prefix
        });
    },

    render: function () {

        var result = this.props.value;

        result = result.replace(Constants.formatRegex, '<span class="highlight">' + this.state.prefix + '$2</span>');
        result = result.replace(/\n/g, '<br />');

        return (
            <div className="coloreditor-result">
                <div className="coloreditor-code" dangerouslySetInnerHTML={{ __html: result }}></div>
                <div className="coloreditor-prefix">
                    <button className={this.state.prefix === Constants.colorPrefixVanilla && 'active'} onClick={this.setPrefix.bind(this, Constants.colorPrefixVanilla)}>Vanilla {Constants.colorPrefixVanilla}</button>
                    <button className={this.state.prefix === Constants.colorPrefixBukkit && 'active'} onClick={this.setPrefix.bind(this, Constants.colorPrefixBukkit)}>Bukkit {Constants.colorPrefixBukkit}</button>
                </div>
            </div>
        );
    }

});

module.exports = ResultPane;