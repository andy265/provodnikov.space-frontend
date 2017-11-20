const { shallow } = require('vue-test-utils')
const moment = require('moment')
require('moment-timezone')
const AppDatetime = require('~/components/AppDatetime')

describe('AppDatetime.vue', () => {
  moment.tz.setDefault('Asia/Novosibirsk')
  let options = {
    propsData: {
      timestamp: 1509992216
    }
  }

  it('has a formatted timestamp', () => {
    let wrapper = shallow(AppDatetime, options)
    expect(wrapper.text()).toEqual('7 ноября 2017 года, 01:16')
  })

  it('has datetime attribute', () => {
    let wrapper = shallow(AppDatetime, options)
    expect(wrapper.hasAttribute('datetime', '2017-11-07T01:16')).toBe(true)
  })
})
