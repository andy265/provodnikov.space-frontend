const { shallow } = require('vue-test-utils')
const nextTick = require('~/script/nextTickPromise')
const HasModelMixin = require('~/components/HasModelMixin')

describe('HasModelMixin.vue', () => {
  let mocks

  function createComponent (model) {
    return {
      mixins: [HasModelMixin],
      data () {
        return {
          model
        }
      }
    }
  }

  beforeEach(() => {
    mocks = {
      $validator: {
        validateAll: jest.fn()
      },
      errors: {
        count: () => 0
      }
    }
  })

  it('set non-empty value to model', () => {
    let Component = createComponent({
      key: 'default value'
    })
    let wrapper = shallow(Component, {
      propsData: {
        value: {
          key: 'some value'
        }
      },
      mocks: mocks
    })
    expect(wrapper.vm.model).toEqual({ key: 'some value' })
  })

  it('emit init event if value empty', () => {
    let Component = createComponent({
      key: 'default value'
    })
    let $emit = jest.fn()
    // eslint-disable-next-line
    let wrapper = shallow(Component, {
      propsData: {
        value: {}
      },
      mocks: Object.assign(mocks, { $emit })
    })
    expect($emit.mock.calls[0]).toEqual(['init', { key: 'default value' }])
  })

  it('emit input event on change', () => {
    let Component = createComponent({
      key: 'default value'
    })
    let wrapper = shallow(Component, {
      propsData: {
        value: {
          key: 'some value'
        }
      },
      mocks: mocks
    })
    wrapper.vm.model.key = 'new value'
    wrapper.vm.onInput()
    expect(wrapper.emitted().input[0][0]).toEqual({ key: 'new value' })
  })

  it('emit validated event on init', () => {
    let Component = createComponent({
      key: 'default value'
    })
    let wrapper = shallow(Component, {
      propsData: {
        value: {
          key: 'some value'
        }
      },
      mocks: mocks
    })
    expect.assertions(1)
    return nextTick()
      .then(() => expect(wrapper.emitted().validated[0][0]).toBe(true))
  })

  it('emit validated event on change', () => {
    let Component = createComponent({
      key: 'default value'
    })
    let wrapper = shallow(Component, {
      propsData: {
        value: {
          key: 'some value'
        }
      },
      mocks: mocks
    })
    expect.assertions(1)
    return nextTick()
      .then(() => wrapper.vm.onInput())
      .then(nextTick)
      .then(() => expect(wrapper.emitted().validated[1][0]).toBe(true))
  })
})
