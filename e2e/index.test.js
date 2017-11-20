import test from 'ava'
import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'

function testPage (t, document) {
  t.not(document.querySelector('.the-header'), null)
  t.not(document.querySelector('.the-scroll'), null)
  t.not(document.querySelector('.the-sidebar'), null)
  t.not(document.querySelector('.the-footer'), null)
}

function find (elements, isEqualFn) {
  for (let i = 0; i < elements.length; i++) {
    if (isEqualFn(elements[i])) {
      return elements[i]
    }
  }
  return null
}

function button (document, text) {
  return find(document.querySelectorAll('.app-button'), button => (button.textContent === text))
}

let nuxt = null

test.before('Init Nuxt.js', async t => {
  const rootDir = resolve(__dirname, '..')
  let config = {}
  try { config = require(resolve(rootDir, 'nuxt.config.js')) } catch (e) {}
  config.rootDir = rootDir // project folder
  config.dev = true // development build
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  await nuxt.listen(4000, 'localhost')
})

test('Open index', async t => {
  const { document } = await nuxt.renderAndGetWindow('http://localhost:4000/')
  testPage(t, document)
  t.not(document.querySelectorAll('.page-post'), null)
  t.is(document.querySelectorAll('.page-post').length, 5)
  t.not(document.querySelector('.page-pagination'), null)
})

test('Open second page', async t => {
  const { document } = await nuxt.renderAndGetWindow('http://localhost:4000/page/2')
  testPage(t, document)
  t.not(document.querySelectorAll('.page-post'), null)
  t.is(document.querySelectorAll('.page-post').length, 5)
  t.not(document.querySelector('.page-pagination'), null)
})

test('Open tag page', async t => {
  const { document } = await nuxt.renderAndGetWindow('http://localhost:4000/tag/photo')
  testPage(t, document)
  t.not(document.querySelectorAll('.page-post'), null)
  t.is(document.querySelectorAll('.page-post').length, 5)
  t.not(document.querySelector('.page-pagination'), null)
})

test('Open tag page second page', async t => {
  const { document } = await nuxt.renderAndGetWindow('http://localhost:4000/tag/photo/page/2')
  testPage(t, document)
  t.not(document.querySelectorAll('.page-post'), null)
  t.is(document.querySelectorAll('.page-post').length, 5)
  t.not(document.querySelector('.page-pagination'), null)
})

test('Open list', async t => {
  const { document } = await nuxt.renderAndGetWindow('http://localhost:4000/list')
  testPage(t, document)
  t.not(document.querySelectorAll('.app-list > *'), null)
  t.is(document.querySelectorAll('.app-list > *').length > 5, true)
})

test('Open create post', async t => {
  const { document } = await nuxt.renderAndGetWindow('http://localhost:4000/create')
  testPage(t, document)
  t.not(document.querySelector('input[placeholder="Заголовок"]'), null)
  t.not(document.querySelector('input[placeholder="Ссылка"]'), null)
  t.not(button(document, 'создать'), null)
  t.is(button(document, 'создать').disabled, true)
})

test('Open edit post', async t => {
  const { document } = await nuxt.renderAndGetWindow('http://localhost:4000/edit/asel_3_foto')
  testPage(t, document)
  t.not(document.querySelector('input[placeholder="Заголовок"]'), null)
  t.not(document.querySelector('input[placeholder="Заголовок"]').value.length, null)
  t.is(document.querySelector('input[placeholder="Ссылка"]'), null)
  t.not(button(document, 'сохранить'), null)
  t.not(button(document, 'перейти к посту'), null)
  t.is(button(document, 'перейти к посту').disabled, false)
})

test('Open post', async t => {
  const { document } = await nuxt.renderAndGetWindow('http://localhost:4000/post/asel_3_foto')
  testPage(t, document)
  t.not(document.querySelectorAll('.page-post'), null)
  t.is(document.querySelectorAll('.page-post').length, 1)
  t.not(document.querySelector('.page-post__title'), null)
  t.not(document.querySelector('.page-post__datetime'), null)
  t.not(document.querySelector('.page-post__item'), null)
  t.not(document.querySelector('.page-post-tags'), null)
  t.not(document.querySelector('.page-post-share'), null)
})

test.after('Closing server and nuxt.js', t => {
  nuxt.close()
})
