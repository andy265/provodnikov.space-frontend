const Vue = require('vue')
const { createRenderer } = require('vue-server-renderer')
const { createLocalVue, shallow } = require('vue-test-utils')
const TheOneSignal = require('~/components/TheOneSignal')
jest.mock('OneSignal')

describe('TheOneSignal.vue', () => {
  let OneSignal = require('OneSignal')
  let server
  let permissions = [{
    name: 'granted',
    result: false
  }, {
    name: 'denied',
    result: false
  }, {
    name: 'default',
    result: true
  }]

  beforeEach(() => {
    server = new Vue()
  })

  it('has same HTML structure', () => {
    let wrapper = shallow(TheOneSignal)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('has initialization', () => {
    let emit = jest.fn()
    global.OneSignal = new OneSignal({
      emit
    })
    shallow(TheOneSignal)
    expect(emit.mock.calls[0][0][0]).toEqual('init')
  })

  it('and can be initialized after script will be loaded', () => {
    let emit = jest.fn()
    shallow(TheOneSignal)
    global.OneSignal = new OneSignal({
      emit,
      server
    })
    server.$emit('next-tick')
    expect(emit.mock.calls[0][0][0]).toEqual('init')
  })

  permissions.forEach(({ name, result }) => {
    it(`emit event if permission change to ${name}`, () => {
      global.OneSignal = new OneSignal({
        isSupported: true,
        server: server
      })
      let wrapper = shallow(TheOneSignal, {
        localVue: createLocalVue(),
        mocks: {
          $bus: {
            $emit: jest.fn()
          }
        }
      })
      server.$emit('server-event', {
        name: 'notificationPermissionChange',
        data: {
          to: name
        }
      })
      expect(wrapper.vm.$bus.$emit.mock.calls[0]).toEqual([ 'is-can-subscribe-changed', result ])
    })
  })

  afterEach(() => {
    delete global.OneSignal
  })
})
