const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
jest.mock('~/components/HasModelMixin', () => require('HasModelMixin'))
const PagePostDatetime = require('~/components/PagePostDatetime')

describe('PagePostDatetime.vue', () => {
  let propsData
  let options

  beforeEach(() => {
    propsData = {
      state: 'index',
      value: {
        timestamp: 1510647540
      }
    }
    options = {
      propsData
    }
  })

  it('has same HTML structure when state is "index"', () => {
    let Component = Object.assign({}, PagePostDatetime, { components: {} })
    let wrapper = shallow(Component, options)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('doesn`t change timestamp if state is "index"', () => {
    let wrapper = shallow(PagePostDatetime, options)
    expect(wrapper.vm.interval).toBeUndefined()
  })

  it('doesn`t change timestamp if state is "edit"', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePostDatetime, options)
    expect(wrapper.vm.interval).toBeUndefined()
  })

  it('change timestamp if state is "create"', () => {
    options.propsData.state = 'create'
    options.propsData.value = {}
    let wrapper = shallow(PagePostDatetime, options)
    expect(wrapper.vm.interval).not.toBeUndefined()
  })

  it('emit "input" event on timestamp update', () => {
    let wrapper = shallow(PagePostDatetime, options)
    wrapper.vm.updateTimestamp()
    expect(wrapper.emitted().input).toHaveLength(1)
  })
})
