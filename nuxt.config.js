const path = require("path")

const apiBaseUrl = "https://api.shooo.shop"
const isDev = process.env.NODE_ENV !== "production"

export default {
    ssr: true,
    target: "static",
    components: true,
    ...(!isDev && {
        modern: "client",
    }),
    rootDir: __dirname,
    head: {
        titleTemplate: "%s – Шо",
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                hid: "description",
                name: "description",
                content: process.env.npm_package_description || "",
            },
        ],
        link: [
            { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
            { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
            { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
            {
                rel: "icon",
                type: "image/png",
                sizes: "192x192",
                href: "/android-chrome-192x192.png",
            },
            { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        ],
    },
    loading: {
        color: "#1890ff",
    },
    css: ["ress/dist/ress.min.css", { src: "~assets/styles/all.scss", lang: "sass" }],
    plugins: [],
    buildModules: ["@nuxtjs/eslint-module"],
    modules: ["@nuxtjs/axios", "@nuxtjs/pwa"],

    axios: {
        baseURL: apiBaseUrl,
        retry: { retries: 1 },
    },
    router: {
        middleware: [],
        linkActiveClass: "active",
        prefetchLinks: false,
        // custom stringify for array-like query
        parseQuery(query) {
            return require("qs").parse(query)
        },
        stringifyQuery(query) {
            const result = require("qs").stringify(query, {
                arrayFormat: "brackets",
                addQueryPrefix: true,
                encode: false,
            })
            return result || ""
        },
    },
    build: {
        extractCSS: true,
        terser: {
            extractComments: false,
        },
        optimization: {
            minimize: !isDev,
            usedExports: true,
            splitChunks: {
                minSize: 100000,
                maxSize: 250000,
                cacheGroups: {
                    vendor: {
                        chunks: "all",
                        test: path.resolve(__dirname, "node_modules"),
                        name: "vendor",
                        enforce: true,
                    },
                    styles: {
                        name: "styles",
                        test: /\.(css|vue)$/,
                        chunks: "all",
                        enforce: true,
                    },
                },
            },
        },
        ...(!isDev && {
            html: {
                minify: {
                    collapseBooleanAttributes: true,
                    decodeEntities: true,
                    minifyCSS: true,
                    minifyJS: true,
                    processConditionalComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    trimCustomFragments: true,
                    useShortDoctype: true,
                },
            },
        }),
        extend(config, ctx) {
            const svgRule = config.module.rules.find(rule => rule.test.test(".svg"))

            svgRule.test = /\.(png|jpe?g|gif|webp)$/

            config.module.rules.push({
                test: /\.svg$/,
                use: [
                    "babel-loader",
                    {
                        loader: "vue-svg-loader",
                        options: {
                            svgo: {
                                plugins: [{ prefixIds: true }],
                            },
                        },
                    },
                ],
            })
        },
    },
}
