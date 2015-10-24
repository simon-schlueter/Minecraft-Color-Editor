var ColorButton = React.createClass({

    propTypes: {
        color: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func
    },

    onClick: function () {
        if (this.props.onClick) {
            this.props.onClick(this.props.color);
        }
    },

    render: function () {
        return (
            <button className="coloreditor-colorbutton" onClick={this.onClick} style={{backgroundColor: '#' + this.props.color}}></button>
        );
    }

});

module.exports = ColorButton;