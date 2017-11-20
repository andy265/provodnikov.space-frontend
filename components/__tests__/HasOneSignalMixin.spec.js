const { shallow } = require('vue-test-utils')
const HasOneSignalMixin = require('~/components/HasOneSignalMixin')
jest.mock('OneSignal')

describe('HasOneSignalMixin.vue', () => {
  let OneSignal = require('OneSignal')

  it('register for push notification', () => {
    let emit = jest.fn()
    global.OneSignal = new OneSignal({
      emit
    })
    let wrapper = shallow(HasOneSignalMixin)
    wrapper.vm.registerForPushNotifications()
    expect(emit.mock.calls[0][0]).toEqual(['registerForPushNotifications'])
  })

  it(`can't subecribe if push notifications does't supported`, () => {
    global.OneSignal = new OneSignal({
      isSupported: false,
      isEnabled: false
    })
    let wrapper = shallow(HasOneSignalMixin)
    expect.assertions(1)
    return expect(wrapper.vm.ifCanSubscribe()).rejects.toEqual(new Error('push notifications doesn`t supported'))
  })

  it(`can't subecribe if push notifications enabled`, () => {
    global.OneSignal = new OneSignal({
      isSupported: true,
      isEnabled: true
    })
    let wrapper = shallow(HasOneSignalMixin)
    expect.assertions(1)
    return expect(wrapper.vm.ifCanSubscribe()).rejects.toEqual(new Error('push notifications is enabled'))
  })

  it(`can subecribe if push notifications disabled`, () => {
    global.OneSignal = new OneSignal({
      isSupported: true,
      isEnabled: false
    })
    let wrapper = shallow(HasOneSignalMixin)
    expect.assertions(1)
    return expect(wrapper.vm.ifCanSubscribe()).resolves.toBeTruthy()
  })

  afterEach(() => {
    delete global.OneSignal
  })
})
