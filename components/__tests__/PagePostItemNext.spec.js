const { createRenderer } = require('vue-server-renderer')
const { createLocalVue, shallow } = require('vue-test-utils')
jest.mock('~/components/HasModelMixin', () => require('HasModelMixin'))
const PagePostItemNext = require('~/components/PagePostItemNext')

Object.defineProperty(global.location, 'href', {
  writable: true
})

describe('PagePostItemNext.vue', () => {
  let localVue
  let mocks
  let propsData
  let options

  beforeEach(() => {
    localVue = createLocalVue()
    mocks = {
      $router: {
        replace: jest.fn()
      },
      $route: {
        path: '/post/some_post',
        hash: ''
      },
      $scrollTo: jest.fn()
    }
    propsData = {
      state: 'index',
      isPreview: true,
      postId: 'some_post',
      postUrl: 'http://localhost:3000/post/some_post',
      value: {}
    }
    options = {
      localVue,
      mocks,
      propsData
    }
  })

  it('has same HTML structure when state is "index" and it is preview', () => {
    let Component = Object.assign({}, PagePostItemNext, { components: {} })
    let wrapper = shallow(Component, options)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('has same HTML structure when state is "index" and it isn`t preview', () => {
    options.propsData.isPreview = false
    let Component = Object.assign({}, PagePostItemNext, { components: {} })
    let wrapper = shallow(Component, options)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('scroll page to its element and remove "#next" from path if (state is "index") and (it isn`t preview) and (hash is "#next")', () => {
    options.propsData.isPreview = false
    mocks.$route.hash = '#next'
    let wrapper = shallow(PagePostItemNext, options)
    expect(wrapper.vm.$router.replace.mock.calls[0][0]).toBe(wrapper.vm.$route.path)
    expect(wrapper.vm.$scrollTo.mock.calls).toHaveLength(1)
  })

  it('change route on "next" button click', () => {
    let wrapper = shallow(PagePostItemNext, options)
    wrapper.vm.onNextClick()
    expect(global.location.href).toBe('http://localhost:3000/post/some_post#next')
  })
})
