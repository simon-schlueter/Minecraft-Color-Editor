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