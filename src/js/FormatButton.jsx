var FormatButton = React.createClass({

    propTypes: {
        format: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func
    },

    onClick: function () {
        if (this.props.onClick) {
            this.props.onClick(this.props.format);
        }
    },

    render: function () {
        return (
            <button className="coloreditor-formatbutton" onClick={this.onClick}>{this.props.format[0]}</button>
        );
    }

});

module.exports = FormatButton;