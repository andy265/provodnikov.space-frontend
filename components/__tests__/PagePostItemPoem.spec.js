const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
jest.mock('~/components/HasModelMixin', () => require('HasModelMixin'))
const PagePostItemPoem = require('~/components/PagePostItemPoem')

describe('PagePostItemPoem.vue', () => {
  it('has same HTML structure when state is "index"', () => {
    let Component = Object.assign({}, PagePostItemPoem, { components: {} })
    let wrapper = shallow(Component, {
      propsData: {
        state: 'index',
        isPreview: false,
        postUrl: 'http://localhost/post/post_url',
        value: {
          name: 'some name',
          text: 'line 1\nline 2\nline 3\nline 4'
        }
      }
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
