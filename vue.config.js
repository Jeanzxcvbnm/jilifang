const Timestamp = new Date().getTime();

module.exports = {
        //加入以下
    devServer: {
        proxy: {
            '/api': {
                target: 'https://psi.meibangtech.com',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/',//调用接口直接写‘/api/user/add’即可
                }
            }
        }
    },
    // outputDir: 'psi_web',
    configureWebpack: { // webpack 配置
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `[name].${Timestamp}.js`,
            chunkFilename: `[name].${Timestamp}.js`
        },
    },
}
