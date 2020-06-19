const path = require('path');
const root = process.cwd();

const srcDir = path.join(root, 'static/js');

module.exports = {
    devtool: 'inline-sourcemap',
    mode: 'development',
    target: 'web',
    entry: {
        // For page
        'tag':     path.join(srcDir, 'tag.js'),
        'index':     path.join(srcDir, 'index.js'),
        'image':     path.join(srcDir, 'image.js'),
        'upload':    path.join(srcDir, 'upload.js'),
        'latest':    path.join(srcDir, 'latest.js'),
        'recommend': path.join(srcDir, 'recommend.js'),
        'account/signin':   path.join(srcDir, 'account/signin.js'),
        'account/signup':   path.join(srcDir, 'account/signup.js'),

        // For components
        'components/sidebar':     path.join(srcDir, 'components/sidebar.js'),
        'components/image-wall':  path.join(srcDir, 'components/image-wall.js'),
    },
    output: {
        path:     path.join(root, 'static/bundle'),
        filename: '[name].bundle.js',
    },
    resolve: {
        alias: {
            static:   path.join(root, 'static'),
        },
    },
    module:  {
        rules: [{
            test: /\.pug$/,
            use: [{
                loader:  'pug-loader',
                options: {
                    root: path.join( root, 'static/pug' ),
                },
            }],
        }],
    },
};