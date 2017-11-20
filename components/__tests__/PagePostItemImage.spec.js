const { createRenderer } = require('vue-server-renderer')
const { createLocalVue, shallow } = require('vue-test-utils')
jest.mock('~/components/HasModelMixin', () => require('HasModelMixin'))
jest.mock('~/components/HasPathIdMixin', () => require('HasPathIdMixin'))
const PagePostItemImage = require('~/components/PagePostItemImage')

describe('PagePostItemImage.vue', () => {
  let localVue
  let mocks
  let propsData
  let options
  let captionChanges = {
    html: '<p>line 1</p><p>line 2</p><p></p>',
    text: 'line 1\nline 2\n'
  }

  beforeEach(() => {
    localVue = createLocalVue()
    mocks = {
      $bus: {
        $emit: jest.fn()
      }
    }
    propsData = {
      state: 'index',
      isPreview: false,
      postUrl: 'http://localhost/post/post_url',
      postId: 'post_id',
      value: {
        src: 'https://farm5.staticflickr.com/4336/36524434961_26c8ba1b97_o.jpg',
        alt: 'Цветочная пачка',
        caption: '<p>Цветочная пачка</p>',
        width: 1636,
        height: 606,
        href: 'https://www.flickr.com/photos/146658938@N03/36524434961/',
        previewSrc: 'https://farm5.staticflickr.com/4336/36524434961_c6acafcc32_b.jpg',
        previewWidth: 1024,
        previewHeight: 379
      }
    }
    options = {
      localVue,
      mocks,
      propsData
    }
  })

  it('has same HTML structure when state is "index" and no errors', () => {
    let Component = Object.assign({}, PagePostItemImage, { components: {} })
    let wrapper = shallow(Component, options)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('has same HTML structure when state is "index" and was load error', () => {
    let Component = Object.assign({}, PagePostItemImage, { components: {} })
    let wrapper = shallow(Component, options)
    wrapper.vm.isLoadError = true
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('set msrc = previewSrc', () => {
    let wrapper = shallow(PagePostItemImage, options)
    expect(wrapper.vm.msrc).toBe(wrapper.vm.model.previewSrc)
  })

  it('set msrc = src if (previewSrc is empty)', () => {
    options.propsData.value.previewSrc = ''
    let wrapper = shallow(PagePostItemImage, options)
    expect(wrapper.vm.msrc).toBe(wrapper.vm.model.src)
  })

  it('emit image-zoom event on image click', () => {
    let wrapper = shallow(PagePostItemImage, options)
    wrapper.vm.onImageClick({
      target: {}
    })
    expect(wrapper.vm.$bus.$emit.mock.calls[0]).toEqual(['image-zoom', {
      gid: wrapper.vm.postId,
      pid: '34',
      target: {},
      h: wrapper.vm.model.height,
      msrc: wrapper.vm.msrc,
      src: wrapper.vm.model.src,
      w: wrapper.vm.model.width
    }])
  })

  it('change alt on caption change', () => {
    let wrapper = shallow(PagePostItemImage, options)
    wrapper.vm.onCaptionChange(captionChanges)
    expect(wrapper.vm.model.alt).toBe('line 1 line 2')
  })

  it('emit "input" event on caption change', () => {
    let wrapper = shallow(PagePostItemImage, options)
    wrapper.vm.onCaptionChange(captionChanges)
    expect(wrapper.emitted().input[0][0]).toEqual({
      ...options.propsData.value,
      alt: 'line 1 line 2',
      caption: '<p>line 1</p><p>line 2</p><p></p>'
    })
  })
})
