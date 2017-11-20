import _ from 'lodash'
import axios from 'axios'
const app = require(`~/config/app.${process.env.NODE_ENV}.json`)

export const actions = {
  add (state, post) {
    return axios.post(`${app.apiUrl}/posts`, post)
  },

  save (state, post) {
    return axios.put(`${app.apiUrl}/posts/${post.id}`, post)
  },

  get (state, id) {
    return axios.get(`${app.apiUrl}/posts/${id}`)
      .then((res) => { return res.data })
  },

  getList (state, { pageNumber, ids }) {
    let params = {
      ids: _.isArray(ids) ? `id=${ids.join('&id=')}` : '',
      start: (pageNumber - 1) * app.itemsPerPage,
      limit: app.itemsPerPage,
      sort: 'timestamp',
      order: 'desc'
    }

    return axios.get(`${app.apiUrl}/posts/?${params.ids}&_start=${params.start}&_limit=${params.limit}&_sort=${params.sort}&_order=${params.order}`)
      .then((res) => {
        return res.data.map(post => {
          let isNextFound = false
          delete post.description
          post.content = post.content.filter(post => {
            if (post.type === 'next') {
              isNextFound = true
              return true
            }
            return !isNextFound
          })
          return post
        })
      })
  },

  getAll (state, rows) {
    return axios.get(app.apiUrl + '/posts?_sort=timestamp&_order=desc').then(res => {
      let posts = res.data
      if (_.isEmpty(rows)) {
        return posts
      }
      return posts.map(post => {
        let postData = {}
        rows.map(row => { postData[row] = post[row] })
        return postData
      })
    })
  }
}
