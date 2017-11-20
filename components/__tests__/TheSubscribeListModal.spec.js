const { createLocalVue, shallow } = require('vue-test-utils')
const nextTick = require('~/script/nextTickPromise')
jest.mock('~/components/HasOneSignalMixin', () => require('HasOneSignalMixin'))
const TheSubscribeListModal = require('~/components/TheSubscribeListModal')

describe('TheSubscribeListModal.vue', () => {
  let OneSignalMixinTest = require('HasOneSignalMixin').test
  let wrapper
  let localVue
  let mocks

  beforeEach(() => {
    localVue = createLocalVue()
    mocks = {
      $bus: {
        $on: jest.fn()
      },
      $router: {
        afterEach: jest.fn(),
        push: (location, callback) => {
          global.scrollY = 0
          callback()
        }
      },
      $route: {
        path: '',
        hash: ''
      },
      $modal: {
        show: jest.fn(),
        hide: jest.fn()
      }
    }
    global.scrollY = 0
    global.scrollTo = (x, y) => {
      global.scrollY = y
    }
    OneSignalMixinTest.create()
  })

  function process () {
    if (wrapper.vm.$modal.show.mock.calls.length) {
      wrapper.vm.onOpened()
    }
    if (wrapper.vm.$modal.hide.mock.calls.length) {
      wrapper.vm.onClosed()
    }
  }

  function changeHash (hash) {
    if (hash === wrapper.vm.$route.hash) {
      return
    }
    wrapper.vm.$route.hash = hash
    wrapper.vm.onAfterRoute()
  }

  it('is closed if (route does not contains #subscribe)', () => {
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    expect(wrapper.vm.$route.hash).not.toBe('#subscribe')
    expect(wrapper.vm.isOpened).toBe(false)
  })

  it('is opened if (route contains #subscribe)', () => {
    mocks.$route.hash = '#subscribe'
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    expect(wrapper.vm.$route.hash).toBe('#subscribe')
    expect(wrapper.vm.isOpened).toBe(true)
  })

  it('is closed if (route does not contains #subscribe) and (route change)', () => {
    mocks.$route.hash = '#subscribe'
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    changeHash('')
    process()
    expect(wrapper.vm.isOpened).toBe(false)
  })

  it('is opened if (route contains #subscribe) and (route change)', () => {
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    changeHash('#subscribe')
    process()
    expect(wrapper.vm.isOpened).toBe(true)
  })

  it('hide content on opening start', () => {
    mocks.$route.hash = '#subscribe'
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    expect(wrapper.vm.contentStyleObject.visibility).toBe('hidden')
  })

  it('show content on loading end', () => {
    mocks.$route.hash = '#subscribe'
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    OneSignalMixinTest.data.ifCanSubscribe.resolve()
    expect.assertions(1)
    return nextTick()
      .then(() => nextTick())
      .then(() => expect(wrapper.vm.contentStyleObject.visibility).toBe('visible'))
  })

  it('save scroll position after closing', () => {
    global.scrollY = 999
    mocks.$route.hash = '#subscribe'
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    wrapper.vm.close()
    process()
    expect.assertions(1)
    return nextTick()
      .then(() => expect(global.scrollY).toBe(999))
  })

  it('close on "close" button click', () => {
    mocks.$route.hash = '#subscribe'
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    wrapper.vm.onCloseClick()
    process()
    expect(wrapper.vm.isOpened).toBe(false)
  })

  it('show "subscribe on push notification" link after loading if can subscribe', () => {
    mocks.$route.hash = '#subscribe'
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    OneSignalMixinTest.data.ifCanSubscribe.resolve()
    expect.assertions(1)
    return nextTick()
      .then(() => nextTick())
      .then(() => expect(wrapper.vm.isCanSubscribeOnPush).toBe(true))
  })

  it('hide "subscribe on push notification" link after loading if can`t subscribe', () => {
    mocks.$route.hash = '#subscribe'
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    OneSignalMixinTest.data.ifCanSubscribe.reject()
    expect.assertions(1)
    return nextTick()
      .then(() => nextTick())
      .then(() => expect(wrapper.vm.isCanSubscribeOnPush).toBe(false))
  })

  it('has is-can-subscribe-changed event listener', () => {
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    expect(wrapper.vm.$bus.$on.mock.calls[0][0]).toBe('is-can-subscribe-changed')
  })

  it('register for push notification on "subscribe on push notification" link click', () => {
    wrapper = shallow(TheSubscribeListModal, {
      localVue,
      mocks
    })
    process()
    wrapper.vm.onLinkPushClick()
    expect(OneSignalMixinTest.data.registerForPushNotifications.isCalled).toBe(true)
  })
})
