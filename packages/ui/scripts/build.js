const minimist = require('minimist');

const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs);
const webpack = require('webpack');
const path = require('path');
const webpackConfig = require('../webpack.config');

// 获取外部依赖配置
function getExternals(deps) {
    const { peerDependencies } = deps;
    const externals = [];
    if (peerDependencies) {
        Object.keys(peerDependencies).forEach(p => {
            // 默认peerDependencies
            externals.push(p);
        });
    }
    return externals;
}

// 遍历所有的包生成配置参数
const { name, peerDependencies, dependencies } = require(path.resolve(
    __dirname,
    '../package.json'
));

const packageWebpackConfig = {
    name,
    externals: getExternals({
        peerDependencies,
        dependencies
    }),
    watch: args.watch,
    build: args.build
};

console.log('\n===> running build');

webpack(webpackConfig(packageWebpackConfig), (err, stats) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(
        stats.toString({
            chunks: false, // 使构建过程更静默无输出
            colors: true // 在控制台展示颜色
        })
    );
    if (stats.hasErrors()) {
        return;
    }
    console.log(`${packageWebpackConfig.name} build successed!`);
});
