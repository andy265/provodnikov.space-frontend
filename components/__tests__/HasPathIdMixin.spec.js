const { createLocalVue, shallow } = require('vue-test-utils')
const _ = require('lodash')
const HasPathIdMixin = require('~/components/HasPathIdMixin')

describe('HasPathIdMixin.vue', () => {
  let localVue
  let mocks

  beforeEach(() => {
    localVue = createLocalVue()
    mocks = {
      $validator: {
        extend: jest.fn()
      }
    }
  })

  it('set path id validator', () => {
    let wrapper = shallow(HasPathIdMixin, {
      localVue,
      mocks
    })
    expect(wrapper.vm.$validator.extend.mock.calls[0][0]).toBe('has-path-id-mixin__path-id')
  })

  it('translate text to path id', () => {
    let wrapper = shallow(HasPathIdMixin, {
      localVue,
      mocks
    })
    let id = wrapper.vm.toPathId('Хм... Этот тест написан в 21:32 и лежит в папке __test__')
    expect(id).toEqual('hm_etot_test_napisan_v_21_32_i_lezhit_v_papke_test')
  })

  it('and filter characters (only "a-z", "0-9", "_")', () => {
    let wrapper = shallow(HasPathIdMixin, {
      localVue,
      mocks
    })
    let text = _.range(0, 5000).map(i => String.fromCharCode(i)).join()
    let id = wrapper.vm.toPathId(text)
    expect(id).toEqual(expect.stringMatching(/^[a-z0-9_]+$/))
  })

  it('and doesn`t add extra characters (""="")', () => {
    let wrapper = shallow(HasPathIdMixin, {
      localVue,
      mocks
    })
    let id = wrapper.vm.toPathId('')
    expect(id).toEqual('')
  })
})
