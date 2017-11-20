const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const AppModal = require('~/components/AppModal')

describe('AppModal.vue', () => {
  let wrapper = shallow(AppModal, {
    propsData: {
      name: 'modal'
    },
    slots: {
      content: '<div>some content</div>',
      buttons: '<div>some buttons</div>'
    }
  })

  it('has same HTML structure', () => {
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('emit before-open event', () => {
    wrapper.vm.onBeforeOpen({
      params: {}
    })
    expect(wrapper.emitted()['before-open']).toBeTruthy()
  })

  it('emit opened event', () => {
    wrapper.vm.onOpened()
    expect(wrapper.emitted().opened).toBeTruthy()
  })

  it('emit closed event', () => {
    wrapper.vm.onClosed()
    expect(wrapper.emitted().closed).toBeTruthy()
  })
})
