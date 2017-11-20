const Vuex = require('vuex')
const { createLocalVue, shallow } = require('vue-test-utils')
const _ = require('lodash')
const moment = require('moment')
const nextTick = require('~/script/nextTickPromise')

Object.defineProperty(document.body, 'clientHeight', {
  value: 5000
})

const app = require(`~/config/app.test.json`)
jest.mock('~/components/HasOneSignalMixin', () => require('HasOneSignalMixin'))
const TheSubscribeQuestionModal = require('~/components/TheSubscribeQuestionModal')

describe('TheSubscribeQuestionModal.vue', () => {
  let OneSignalMixinTest = require('HasOneSignalMixin').test
  let localVue
  let store
  let mocks
  let options
  let storageData

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store({
      state: {
        page: {
          post: {
            id: 'some_post'
          }
        }
      }
    })
    mocks = {
      $leaveHook: {
        add: jest.fn(),
        remove: jest.fn()
      },
      $storage: {
        get: jest.fn((key, defaultData) => {
          return _.defaults(storageData, defaultData)
        }),
        set: jest.fn()
      },
      $modal: {
        show: jest.fn(),
        hide: jest.fn()
      }
    }
    options = {
      localVue,
      store,
      mocks
    }
    storageData = {}
    app.isSubscribeQuestionAllowed = true
    global.innerHeight = 1200
    global.addEventListener = jest.fn()
    global.removeEventListener = jest.fn()
    OneSignalMixinTest.create()
  })

  function updateInputsForOpenImmediately () {
    global.innerHeight = 3000
    storageData = {
      posts: [{
        id: 'post_1',
        timestamp: moment().unix() - 1000
      }, {
        id: 'post_2',
        timestamp: moment().unix() - 2000
      }]
    }
  }

  it('work if (page is post page)', () => {
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect(wrapper.vm.mountedTimestamp).not.toBe(0)
  })

  it('doesn`t work if (page isn`t post page)', () => {
    store.state.page.post = null
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect(wrapper.vm.mountedTimestamp).toBe(0)
  })

  it('has hook on leave', () => {
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect(wrapper.vm.$leaveHook.add.mock.calls).toHaveLength(1)
  })

  it('save visit details before leave', () => {
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    wrapper.vm.mountedTimestamp -= 10
    wrapper.vm.onLeave()
    expect(wrapper.vm.$storage.set.mock.calls).toHaveLength(1)
  })

  it('and newest visit details is placed at start', () => {
    storageData = {
      posts: [{
        id: 'old_post',
        timestamp: 999
      }]
    }
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    wrapper.vm.mountedTimestamp -= 999
    wrapper.vm.onLeave()
    expect(wrapper.vm.$storage.set.mock.calls[0][1].posts).toHaveLength(2)
    expect(wrapper.vm.$storage.set.mock.calls[0][1].posts[0].id).toBe('some_post')
  })

  it('and only 1 record is representative for post (old duplicate record is removed)', () => {
    storageData = {
      posts: [{
        id: 'some_post',
        timestamp: 999
      }]
    }
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    wrapper.vm.mountedTimestamp -= 999
    wrapper.vm.onLeave()
    expect(wrapper.vm.$storage.set.mock.calls[0][1].posts).toHaveLength(1)
    expect(wrapper.vm.$storage.set.mock.calls[0][1].posts[0].id).toBe('some_post')
    expect(wrapper.vm.$storage.set.mock.calls[0][1].posts[0].timestamp).not.toBe(999)
  })

  it('and maximum count of visit details is 10 (old records is removed)', () => {
    let posts = _.range(1, 50).map(i => ({ id: `post_${i}`, timestamp: (1000 + i) }))
    storageData = {
      posts
    }
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    wrapper.vm.mountedTimestamp -= 999
    wrapper.vm.onLeave()
    expect(wrapper.vm.$storage.set.mock.calls[0][1].posts).toHaveLength(10)
  })

  it('unsave visit details before leave if (page was opened less 10 sec)', () => {
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    wrapper.vm.mountedTimestamp -= 8 // 1 second for work time
    wrapper.vm.onLeave()
    expect(wrapper.vm.$storage.set.mock.calls).toHaveLength(0)
  })

  it('determines that the post is long', () => {
    global.innerHeight = 2000
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect(document.body.clientHeight).toBe(5000)
    expect(wrapper.vm.isLongPost()).toBe(true)
  })

  it('or determines that the post is short', () => {
    global.innerHeight = 3000
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect(document.body.clientHeight).toBe(5000)
    expect(wrapper.vm.isLongPost()).toBe(false)
  })

  it('open immediately if (post is short)', () => {
    updateInputsForOpenImmediately()
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect.assertions(1)
    return nextTick()
      .then(() => OneSignalMixinTest.data.ifCanSubscribe.resolve())
      .then(() => nextTick())
      .then(() => OneSignalMixinTest.data.ifCanSubscribe.resolve())
      .then(() => nextTick())
      .then(() => expect(wrapper.vm.$modal.show.mock.calls).toHaveLength(1))
  })

  it('open after scrolling to the end of post if (post is long) and (page was opened 10 sec or more)', () => {
    updateInputsForOpenImmediately()
    global.innerHeight = 1000
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect.assertions(4)
    return nextTick()
      .then(() => OneSignalMixinTest.data.ifCanSubscribe.resolve())
      .then(() => nextTick())
      .then(() => {
        expect(global.addEventListener.mock.calls[0][0]).toBe('scroll')
        global.scrollY = document.body.clientHeight - global.innerHeight - 200 // ~bottom
        wrapper.vm.onScroll()
        expect(global.removeEventListener.mock.calls).toHaveLength(0)
        wrapper.vm.mountedTimestamp -= 10
        wrapper.vm.onScroll()
        expect(global.removeEventListener.mock.calls[0][0]).toBe('scroll')
      })
      .then(() => nextTick())
      .then(() => OneSignalMixinTest.data.ifCanSubscribe.resolve())
      .then(() => nextTick())
      .then(() => expect(wrapper.vm.$modal.show.mock.calls).toHaveLength(1))
  })

  it('doesn`t open if (subscribe question denied)', () => {
    updateInputsForOpenImmediately()
    app.isSubscribeQuestionAllowed = false
    // eslint-disable-next-line
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect.assertions(1)
    return nextTick()
      .then(() => expect(OneSignalMixinTest.data.ifCanSubscribe.resolve).toBe(null))
  })

  it('doesn`t open if (has been already shown)', () => {
    updateInputsForOpenImmediately()
    storageData.showTimestamp = 999
    // eslint-disable-next-line
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect.assertions(1)
    return nextTick()
      .then(() => expect(OneSignalMixinTest.data.ifCanSubscribe.resolve).toBe(null))
  })

  it('doesn`t open if (too few views)', () => {
    updateInputsForOpenImmediately()
    storageData.posts.pop()
    // eslint-disable-next-line
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect.assertions(1)
    return nextTick()
      .then(() => expect(OneSignalMixinTest.data.ifCanSubscribe.resolve).toBe(null))
  })

  it('doesn`t open if (previous post was viewed too long ago)', () => {
    updateInputsForOpenImmediately()
    storageData.posts[0].timestamp = moment().unix() - 30 * 24 * 60 * 60 // 29 days ago
    storageData.posts[1].timestamp = moment().unix() - 30 * 24 * 60 * 60 // 30 days ago
    // eslint-disable-next-line
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect.assertions(1)
    return nextTick()
      .then(() => expect(OneSignalMixinTest.data.ifCanSubscribe.resolve).toBe(null))
  })

  it('doesn`t open if (can`t subscribe)', () => {
    updateInputsForOpenImmediately()
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect.assertions(1)
    return nextTick()
      .then(() => OneSignalMixinTest.data.ifCanSubscribe.reject())
      .then(() => nextTick())
      .then(() => OneSignalMixinTest.data.ifCanSubscribe.reject())
      .then(() => nextTick())
      .then(() => expect(wrapper.vm.$modal.show.mock.calls).toHaveLength(0))
  })

  it('save details about open on opening', () => {
    global.innerHeight = 3000
    storageData = {
      posts: [{
        id: 'post_1',
        timestamp: moment().unix() - 1000
      }, {
        id: 'post_2',
        timestamp: moment().unix() - 2000
      }]
    }
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    expect.assertions(2)
    return nextTick()
      .then(() => OneSignalMixinTest.data.ifCanSubscribe.resolve())
      .then(() => nextTick())
      .then(() => OneSignalMixinTest.data.ifCanSubscribe.resolve())
      .then(() => nextTick())
      .then(() => {
        expect(wrapper.vm.$modal.show.mock.calls).toHaveLength(1)
        expect(wrapper.vm.$storage.set.mock.calls[0][1].showTimestamp).not.toBe(0)
      })
  })

  it('register for push notifications on "subscribe" button click', () => {
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    wrapper.vm.onSubscribeClick()
    expect(OneSignalMixinTest.data.registerForPushNotifications.isCalled).toBe(true)
  })

  it('close on "subscribe" button click', () => {
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    wrapper.vm.onSubscribeClick()
    expect(wrapper.vm.$modal.hide.mock.calls).toHaveLength(1)
  })

  it('close on "close" button click', () => {
    let wrapper = shallow(TheSubscribeQuestionModal, options)
    wrapper.vm.onCloseClick()
    expect(wrapper.vm.$modal.hide.mock.calls).toHaveLength(1)
  })
})
