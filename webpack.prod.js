const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

function dependencyValue(request, root) {
    return {
        root,
        commonjs: request,
        commonjs2: request,
        amd: request,
    }
}

function dependencyEntry(request, root) {
    return {
        [request]: dependencyValue(request, root),
    }
}

module.exports = merge(common, {
    mode: 'production',

    externals: [
        function rxjsExternals({ request }, callback) {
            const root = request.split('/')
            if (root[0] === 'rxjs') {
                return callback(null, dependencyValue(request, root))
            } else {
                callback()
            }
        },
        dependencyEntry('structural-comparison', 'structuralComparison'),
    ],

    output: {
        filename: 'deep-rxjs.js',
        library: 'deep',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
})
