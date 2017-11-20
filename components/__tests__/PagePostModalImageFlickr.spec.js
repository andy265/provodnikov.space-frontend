const { createLocalVue, shallow } = require('vue-test-utils')
const PagePostModalImageFlickr = require('~/components/PagePostModalImageFlickr')

describe('PagePostModalImageFlickr.vue', () => {
  let localVue
  let mocks
  let options
  let embedData = {
    small: {
      html: '<a data-flickr-embed="true"  href="https://www.flickr.com/photos/146658938@N03/36524434961/in/dateposted-public/" title="Цветочная пачка"><img src="https://farm5.staticflickr.com/4336/36524434961_c6acafcc32_b.jpg" width="1024" height="379" alt="Цветочная пачка"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>',
      parsed: {
        src: 'https://farm5.staticflickr.com/4336/36524434961_c6acafcc32_b.jpg',
        width: 1024,
        height: 379,
        href: 'https://www.flickr.com/photos/146658938@N03/36524434961/',
        alt: 'Цветочная пачка',
        caption: '<p>Цветочная пачка</p>'
      }
    },
    big: {
      html:              '<a data-flickr-embed="true" href="https://www.flickr.com/photos/146658938@N03/36524434961/in/dateposted-public/" title="Цветочная пачка"><img src="https://farm5.staticflickr.com/4336/36524434961_26c8ba1b97_o.jpg" width="1636" height="606" alt="Цветочная пачка"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>', // eslint-disable-line
      htmlWithoutSrc:    '<a data-flickr-embed="true" href="https://www.flickr.com/photos/146658938@N03/36524434961/in/dateposted-public/" title="Цветочная пачка"><img                                                                        width="1636" height="606" alt="Цветочная пачка"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>', // eslint-disable-line
      htmlWithoutWidth:  '<a data-flickr-embed="true" href="https://www.flickr.com/photos/146658938@N03/36524434961/in/dateposted-public/" title="Цветочная пачка"><img src="https://farm5.staticflickr.com/4336/36524434961_26c8ba1b97_o.jpg"              height="606" alt="Цветочная пачка"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>', // eslint-disable-line
      htmlWithoutHeight: '<a data-flickr-embed="true" href="https://www.flickr.com/photos/146658938@N03/36524434961/in/dateposted-public/" title="Цветочная пачка"><img src="https://farm5.staticflickr.com/4336/36524434961_26c8ba1b97_o.jpg" width="1636"              alt="Цветочная пачка"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>',
      htmlWithoutHref:   '<a data-flickr-embed="true"                                                                                      title="Цветочная пачка"><img src="https://farm5.staticflickr.com/4336/36524434961_26c8ba1b97_o.jpg" width="1636" height="606" alt="Цветочная пачка"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>', // eslint-disable-line
      parsed: {
        src: 'https://farm5.staticflickr.com/4336/36524434961_26c8ba1b97_o.jpg',
        width: 1636,
        height: 606,
        href: 'https://www.flickr.com/photos/146658938@N03/36524434961/',
        alt: 'Цветочная пачка',
        caption: '<p>Цветочная пачка</p>'
      }
    }
  }

  beforeEach(() => {
    localVue = createLocalVue()
    mocks = {
      $modal: {
        hide: jest.fn()
      },
      $validator: {
        extend: jest.fn(),
        validateAll: jest.fn()
      },
      errors: {
        first: jest.fn(),
        count: () => 0
      }
    }
    options = {
      localVue,
      mocks
    }
  })

  it('can be opened by name by other components', () => {
    let Component = Object.assign({}, PagePostModalImageFlickr, { components: {} })
    let wrapper = shallow(Component, options)
    expect(wrapper.find('AppModal').hasAttribute('name', 'page-post-modal-image-flickr')).toBe(true)
  })

  it('set flickr embed data validator', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    expect(wrapper.vm.$validator.extend.mock.calls[0][0]).toBe('page-post-modal-image-flickr__data')
  })

  it('validate all after open', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    wrapper.vm.onOpened()
    expect(wrapper.vm.$validator.validateAll.mock.calls).toHaveLength(1)
  })

  it('can parse embed data if (correct HTML structure) and (valid attributes)', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    expect(wrapper.vm.parseEmbedData(embedData.big.html)).toEqual({
      value: embedData.big.parsed,
      isValid: true
    })
  })

  it('can`t parse embed data if (incorrect HTML structure)', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    expect(wrapper.vm.parseEmbedData(`<div>${embedData.big.html}</div>`).isValid).toBe(false)
  })

  it('can`t parse embed data if (invalid attribute — src)', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    expect(wrapper.vm.parseEmbedData(embedData.big.htmlWithoutSrc).isValid).toBe(false)
  })

  it('can`t parse embed data if (invalid attribute — width)', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    expect(wrapper.vm.parseEmbedData(embedData.big.htmlWithoutWidth).isValid).toBe(false)
  })

  it('can`t parse embed data if (invalid attribute — height)', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    expect(wrapper.vm.parseEmbedData(embedData.big.htmlWithoutHeight).isValid).toBe(false)
  })

  it('can`t parse embed data if (invalid attribute — href)', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    expect(wrapper.vm.parseEmbedData(embedData.big.htmlWithoutHref).isValid).toBe(false)
  })

  it('emit "init" event on "init" button click', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    wrapper.vm.onInitClick()
    expect(wrapper.emitted().init).toHaveLength(1)
  })

  it('and emitted "init" event has parsed data (in="small as preview", out="small as preview")', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    wrapper.vm.imageEmbedData = embedData.big.html
    wrapper.vm.previewEmbedData = embedData.small.html
    wrapper.vm.onInitClick()
    expect(wrapper.emitted().init[0][0]).toEqual({
      ...embedData.big.parsed,
      previewSrc: embedData.small.parsed.src,
      previewWidth: embedData.small.parsed.width,
      previewHeight: embedData.small.parsed.height
    })
  })

  it('and emitted "init" event has parsed data (in="big as preview", out="small as preview")', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    wrapper.vm.imageEmbedData = embedData.small.html
    wrapper.vm.previewEmbedData = embedData.big.html
    wrapper.vm.onInitClick()
    expect(wrapper.emitted().init[0][0]).toEqual({
      ...embedData.big.parsed,
      previewSrc: embedData.small.parsed.src,
      previewWidth: embedData.small.parsed.width,
      previewHeight: embedData.small.parsed.height
    })
  })

  it('and emitted "init" event has parsed data (in="no preivew", out="no preivew")', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    wrapper.vm.imageEmbedData = embedData.big.html
    wrapper.vm.onInitClick()
    expect(wrapper.emitted().init[0][0]).toEqual(embedData.big.parsed)
  })

  it('close on "init" button click', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    wrapper.vm.onInitClick()
    expect(wrapper.vm.$modal.hide.mock.calls).toHaveLength(1)
  })

  it('close on "close" button click', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    wrapper.vm.onCloseClick()
    expect(wrapper.vm.$modal.hide.mock.calls).toHaveLength(1)
  })

  it('clear data after close', () => {
    let wrapper = shallow(PagePostModalImageFlickr, options)
    wrapper.vm.imageEmbedData = 'some flikcr embed data'
    wrapper.vm.previewEmbedData = 'some flikcr embed data'
    wrapper.vm.onClosed()
    expect(wrapper.vm.imageEmbedData).toHaveLength(0)
    expect(wrapper.vm.previewEmbedData).toHaveLength(0)
  })
})
