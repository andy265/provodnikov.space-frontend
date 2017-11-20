const { createLocalVue, shallow } = require('vue-test-utils')
const PagePostModalIframeYoutube = require('~/components/PagePostModalIframeYoutube')

describe('PagePostModalIframeYoutube.vue', () => {
  let localVue
  let mocks
  let options
  let embedData = {
    html:              '<iframe width="560" height="315" src="https://www.youtube.com/embed/ak8kej76JQY" frameborder="0" allowfullscreen></iframe>', // eslint-disable-line
    htmlWithoutSrc:    '<iframe width="560" height="315"                                                 frameborder="0" allowfullscreen></iframe>', // eslint-disable-line
    htmlWithoutWidth:  '<iframe             height="315" src="https://www.youtube.com/embed/ak8kej76JQY" frameborder="0" allowfullscreen></iframe>', // eslint-disable-line
    htmlWithoutHeight: '<iframe width="560"              src="https://www.youtube.com/embed/ak8kej76JQY" frameborder="0" allowfullscreen></iframe>',
    parsed: {
      id: 'ak8kej76JQY',
      width: 560,
      height: 315
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
    let Component = Object.assign({}, PagePostModalIframeYoutube, { components: {} })
    let wrapper = shallow(Component, options)
    expect(wrapper.find('AppModal').hasAttribute('name', 'page-post-modal-iframe-youtube')).toBe(true)
  })

  it('set youtube embed data validator', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    expect(wrapper.vm.$validator.extend.mock.calls[0][0]).toBe('page-post-modal-iframe-youtube__data')
  })

  it('validate all after open', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    wrapper.vm.onOpened()
    expect(wrapper.vm.$validator.validateAll.mock.calls).toHaveLength(1)
  })

  it('can parse embed data if (correct HTML structure) and (valid attributes)', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    expect(wrapper.vm.parseEmbedData(embedData.html)).toEqual({
      value: embedData.parsed,
      isValid: true
    })
  })

  it('can`t parse embed data if (incorrect HTML structure)', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    expect(wrapper.vm.parseEmbedData(`<div>${embedData.html}</div>`).isValid).toBe(false)
  })

  it('can`t parse embed data if (invalid attribute — src)', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    expect(wrapper.vm.parseEmbedData(embedData.htmlWithoutSrc).isValid).toBe(false)
  })

  it('can`t parse embed data if (invalid attribute — width)', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    expect(wrapper.vm.parseEmbedData(embedData.htmlWithoutWidth).isValid).toBe(false)
  })

  it('can`t parse embed data if (invalid attribute — height)', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    expect(wrapper.vm.parseEmbedData(embedData.htmlWithoutHeight).isValid).toBe(false)
  })

  it('emit "init" event on "init" button click', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    wrapper.vm.onInitClick()
    expect(wrapper.emitted().init).toHaveLength(1)
  })

  it('and emitted "init" event has parsed data', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    wrapper.vm.iframeEmbedData = embedData.html
    wrapper.vm.onInitClick()
    expect(wrapper.emitted().init[0][0]).toEqual(embedData.parsed)
  })

  it('close on "init" button click', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    wrapper.vm.onInitClick()
    expect(wrapper.vm.$modal.hide.mock.calls).toHaveLength(1)
  })

  it('close on "close" button click', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    wrapper.vm.onCloseClick()
    expect(wrapper.vm.$modal.hide.mock.calls).toHaveLength(1)
  })

  it('clear data after close', () => {
    let wrapper = shallow(PagePostModalIframeYoutube, options)
    wrapper.vm.iframeEmbedData = 'some youtube embed data'
    wrapper.vm.onClosed()
    expect(wrapper.vm.iframeEmbedData).toHaveLength(0)
  })
})
