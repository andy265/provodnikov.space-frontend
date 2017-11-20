const _ = require('lodash')
const axios = require('axios')
const resolve = require('path').resolve
const app = require(resolve(__dirname, '../config/app.production.json'))

module.exports = {
  getPosts: () => {
    return axios.get(`${app.apiUrl}/posts`).then(({ data }) => data.map(post => `/post/${post.id}`))
  },

  getPages: () => {
    return axios.get(`${app.apiUrl}/posts`).then(({ data }) => {
      let pageCount = Math.ceil(data.length / app.itemsPerPage)
      return _.range(2, 2 + (pageCount - 1)).map(pageNumber => `/page/${pageNumber}`)
    })
  },

  getTags: () => {
    return axios.get(`${app.apiUrl}/posts`).then(({ data }) => {
      let tagRoutes = []

      let postCountByTag = new Map()
      data.forEach(post => {
        post.tags.forEach(tag => {
          let postCount = postCountByTag.has(tag) ? postCountByTag.get(tag) : 0
          postCountByTag.set(tag, postCount + 1)
        })
      })

      postCountByTag.forEach((postCount, tag) => {
        tagRoutes.push(`/tag/${tag}`)
        let pageCount = Math.ceil(postCount / app.itemsPerPage)
        _.range(2, 2 + (pageCount - 1)).map(pageNumber => {
          tagRoutes.push(`/tag/${tag}/page/${pageNumber}`)
        })
      })

      return tagRoutes
    })
  },

  getIndex: () => {
    return '/'
  },

  getList: () => {
    return '/list'
  },

  get404: () => {
    return '/404.html'
  }
}
