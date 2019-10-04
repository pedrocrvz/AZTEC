const path = require('path');

module.exports = {
    output: {
        path: path.resolve(__dirname, './src/ui/styles'),
    },
    theme: {
        colorMap: {
            primary: '#808DFF',
            'primary-light': 'rgba(137, 139, 246, 0.7)',
            'primary-lighter': 'rgba(137, 139, 246, 0.45)',
            'primary-lightest': 'rgb(244, 245, 254)',
            'white-lightest': 'rgba(255, 255, 255, 0.15)',
        },
        // defaultTextColor: '#221635',
        // defaultLabelColor: '#ABA4B6',
        defaultLinkColorName: 'primary',
    },
};