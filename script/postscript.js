const axios = require('axios')
const chalk = require('chalk')
const RSS = require('rss')
const sm = require('sitemap')
const moment = require('moment')
const fs = require('fs')
const util = require('util')
const rename = util.promisify(fs.rename)
const rmdir = util.promisify(fs.rmdir)
const unlink = util.promisify(fs.unlink)
const writeFile = util.promisify(fs.writeFile)
const resolve = require('path').resolve
const distDir = resolve(__dirname, '../dist')
const routes = require(resolve(__dirname, 'routes.js'))
const app = require(resolve(__dirname, '../config/app.production.json'))
const rssData = require(resolve(__dirname, '../config/rss.json'))

log('Start')
log(`Variable distDir is "${distDir}"`)
log('Rename page 404')
renamePage404()
  .then(() => log('Remove page create'))
  .then(() => removePageCreate())
  .then(() => log('Create sitemap.xml'))
  .then(() => createSitemapXML())
  .then(() => log('Create rss.xml'))
  .then(() => createRSSXML())
  .then(() => log('End'))
  .catch(e => {
    error(e)
    error('End with error')
    process.exit(1)
  })

function log (message) {
  console.log(chalk.magentaBright('  postscript ') + message)
}

function error (message) {
  console.error(chalk.magentaBright('  postscript ') + chalk.red(message))
}

function renamePage404 () {
  return rename(resolve(distDir, '404/index.html'), resolve(distDir, '404.html'))
    .then(() => rmdir(resolve(distDir, '404')))
}

function removePageCreate () {
  return unlink(resolve(distDir, 'create/index.html'))
    .then(() => rmdir(resolve(distDir, 'create')))
}

function createSitemapXML () {
  let urls = []

  urls.push({ url: routes.getIndex(), changefreq: 'daily', priority: 1 })
  urls.push({ url: routes.get404(), changefreq: 'monthly', priority: 0.2 })
  urls.push({ url: routes.getList(), changefreq: 'weekly', priority: 0.8 })

  return routes.getPosts()
    .then(postRoutes => {
      urls = urls.concat(postRoutes.map(url => ({ url: url, changefreq: 'monthly', priority: 0.9 })))
    })
    .then(() => routes.getPages())
    .then(pageRoutes => {
      urls = urls.concat(pageRoutes.map(url => ({ url: url, changefreq: 'weekly', priority: 0.8 })))
    })
    .then(() => routes.getTags())
    .then(tagRoutes => {
      urls = urls.concat(tagRoutes.map(url => ({ url: url, changefreq: 'weekly', priority: 0.8 })))
    })
    .then(() => {
      let sitemap = sm.createSitemap({
        hostname: app.siteUrl,
        cacheTime: 600 * 1000, // 600 sec
        urls: urls
      })
      return writeFile(resolve(distDir, 'sitemap.xml'), sitemap.toString())
    })
}

function createRSSXML () {
  let feed = new RSS({
    title: rssData.title,
    description: rssData.description,
    feed_url: `${app.siteUrl}${rssData.feedPath}`,
    site_url: app.siteUrl,
    image_url: `${app.siteUrl}${rssData.imagePath}`,
    copyright: rssData.copyright,
    language: rssData.language,
    author: rssData.author
  })

  return axios.get(app.apiUrl + '/posts?_sort=timestamp&_order=desc')
    .then(({data}) => {
      data.map(post => {
        feed.item({
          title: post.name,
          description: post.description,
          url: `${app.siteUrl}/post/${post.id}`,
          guid: post.id,
          date: moment.unix(post.timestamp).utcOffset(0).toString(),
          author: rssData.author
        })
      })
    })
    .then(() => writeFile(resolve(distDir, 'rss.xml'), feed.xml()))
}
