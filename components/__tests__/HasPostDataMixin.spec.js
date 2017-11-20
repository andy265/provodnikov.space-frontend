const { shallow } = require('vue-test-utils')
const HasPostDataMixin = require('~/components/HasPostDataMixin')

describe('HasPostDataMixin.vue', () => {
  it('has state, isPreview, postId, postUrl variables', () => {
    let wrapper = shallow(HasPostDataMixin, {
      propsData: {
        state: 'index',
        isPreview: false,
        postId: 'some_id',
        postUrl: 'http://localhost/post/som_id'
      }
    })
    expect(wrapper.vm.state).toBe('index')
    expect(wrapper.vm.isPreview).toBe(false)
    expect(wrapper.vm.postId).toBe('some_id')
    expect(wrapper.vm.postUrl).toBe('http://localhost/post/som_id')
  })
})
