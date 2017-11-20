const { shallow } = require('vue-test-utils')
const PagePostPanel = require('~/components/PagePostPanel')

describe('PagePostPanel.vue', () => {
  let componentTypes = [
    'text',
    'image',
    'iframe',
    'poem'
  ]
  let options

  beforeEach(() => {
    options = {
      propsData: {
        content: [{}, {}, {}],
        item: {
          type: ''
        },
        index: 0
      }
    }
  })

  componentTypes.forEach(type => {
    it(`has title for component type ${type}`, () => {
      options.propsData.item.type = type
      let wrapper = shallow(PagePostPanel, options)
      expect(wrapper.vm.componentTitle).not.toHaveLength(0)
    })
  })

  it('emit "up-click" event on up button click', () => {
    let wrapper = shallow(PagePostPanel, options)
    wrapper.vm.onUpClick()
    expect(wrapper.emitted()['up-click']).toHaveLength(1)
  })

  it('emit "down-click" event on down button click', () => {
    let wrapper = shallow(PagePostPanel, options)
    wrapper.vm.onDownClick()
    expect(wrapper.emitted()['down-click']).toHaveLength(1)
  })

  it('emit "remove-click" event on remove button click', () => {
    let wrapper = shallow(PagePostPanel, options)
    wrapper.vm.onRemoveClick()
    expect(wrapper.emitted()['remove-click']).toHaveLength(1)
  })
})
