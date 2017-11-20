const { createLocalVue, shallow } = require('vue-test-utils')
const PagePostModalItemRemove = require('~/components/PagePostModalItemRemove')

describe('PagePostModalItemRemove.vue', () => {
  let localVue
  let mocks
  let options

  beforeEach(() => {
    localVue = createLocalVue()
    mocks = {
      $modal: {
        hide: jest.fn()
      }
    }
    options = {
      localVue,
      mocks
    }
  })

  it('can be opened by name by other components', () => {
    let Component = Object.assign({}, PagePostModalItemRemove, { components: {} })
    let wrapper = shallow(Component, options)
    expect(wrapper.find('AppModal').hasAttribute('name', 'page-post-modal-item-remove')).toBe(true)
  })

  it('recive item index before open', () => {
    let wrapper = shallow(PagePostModalItemRemove, options)
    wrapper.vm.onBeforeOpen({ index: 1 })
    expect(wrapper.vm.itemIndex).toBe(1)
  })

  it('emit "remove" event on "remove" button click', () => {
    let wrapper = shallow(PagePostModalItemRemove, options)
    wrapper.vm.onBeforeOpen({ index: 9 })
    wrapper.vm.onRemoveClick()
    expect(wrapper.emitted().remove[0][0]).toBe(9)
  })

  it('close on "remove" button click', () => {
    let wrapper = shallow(PagePostModalItemRemove, options)
    wrapper.vm.onRemoveClick()
    expect(wrapper.vm.$modal.hide.mock.calls).toHaveLength(1)
  })

  it('close on "close" button click', () => {
    let wrapper = shallow(PagePostModalItemRemove, options)
    wrapper.vm.onCloseClick()
    expect(wrapper.vm.$modal.hide.mock.calls).toHaveLength(1)
  })
})
