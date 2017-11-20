const _ = require('lodash')
const resolve = require('path').resolve
const routes = require(resolve(__dirname, 'script/routes.js'))

let isDevelopment = process.env.NODE_ENV === 'development'

let cssDev = [
  'vue-multiselect/dist/vue-multiselect.min.css',
  'quill/dist/quill.bubble.css'
]
let cssAll = [
  'normalize.css/normalize.css',
  'photoswipe/dist/photoswipe.css',
  'photoswipe/dist/default-skin/default-skin.css',
  'css-ripple-effect/dist/ripple.css',
  '~/assets/sass/main.sass'
]
let css = [].concat((isDevelopment ? cssDev : []), cssAll)

let pluginsDev = [
  { src: '~/plugins/vue-autosize', ssr: false },
  { src: '~/plugins/vue-multiselect' },
  { src: '~/plugins/vue-quill-editor' }
]
let pluginsAll = [
  { src: '~/plugins/app-bus' },
  { src: '~/plugins/app-check-server-init-error' },
  { src: '~/plugins/app-leave-hook', ssr: false },
  { src: '~/plugins/app-storage', ssr: false },
  { src: '~/plugins/vue-js-modal' },
  { src: '~/plugins/vee-validate' },
  { src: '~/plugins/vue-scrollto', ssr: false },
  { src: '~/plugins/vue-simple-spinner', ssr: false },
  { src: '~/plugins/vue-social-sharing' }
]
let plugins = [].concat((isDevelopment ? pluginsDev : []), pluginsAll)

module.exports = {
  css: css,

  head: {
    htmlAttrs: {
      lang: 'ru'
    },

    title: 'Андрей Проводников / Блог',

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: 'Андрей Проводников / Блог' },

      { name: 'msapplication-config', content: '/favicon/browserconfig.xml?v3=Nm5o0y7G62' },
      { name: 'theme-color', content: '#101010' }
    ],

    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=PT+Serif%7CRaleway' },

      { rel: 'manifest', href: '/manifest.json?v3=Nm5o0y7G62' },

      { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png?v3=Nm5o0y7G62' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png?v3=Nm5o0y7G62' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png?v3=Nm5o0y7G62' },
      { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg?v3=Nm5o0y7G62', color: '#101010' },
      { rel: 'shortcut icon', href: '/favicon/favicon.ico?v3=Nm5o0y7G62' }
    ]
  },

  loading: { color: 'white' },

  plugins: plugins,

  modules: [
    '@nuxtjs/font-awesome',
    ['@nuxtjs/google-analytics', { id: 'UA-93753022-1' }]
  ],

  build: {
    extractCSS: true,

    vendor: [
      'axios',
      'moment',
      'lodash',
      'css-element-queries',
      'sticky-sidebar/dist/sticky-sidebar.js',
      'photoswipe',
      'photoswipe/dist/photoswipe-ui-default.js'
    ],

    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({ // Run ESLINT on save
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      const sassResourcesLoader = {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            resolve(__dirname, 'assets/sass/variables.sass'),
            resolve(__dirname, 'assets/sass/mixins.sass')
          ]
        }
      }

      config.module.rules.forEach((rule) => {
        if (rule.test.toString() === '/\\.vue$/') {
          rule.options.loaders.sass.push(sassResourcesLoader)
          rule.options.loaders.scss.push(sassResourcesLoader)
        }
        if (['/\\.sass$/', '/\\.scss$/'].indexOf(rule.test.toString()) !== -1) {
          rule.use.push(sassResourcesLoader)
        }
      })
    }
  },

  generate: {
    routes: function () {
      return Promise.all([routes.getPosts(), routes.getPages(), routes.getTags()]).then(all => _.flatten(all))
    }
  }
}
