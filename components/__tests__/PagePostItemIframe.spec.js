const { shallow } = require('vue-test-utils')
const { createRenderer } = require('vue-server-renderer')
jest.mock('~/components/HasModelMixin', () => require('HasModelMixin'))
const PagePostItemIframe = require('~/components/PagePostItemIframe')

describe('PagePostItemIframe.vue', () => {
  it('has same HTML structure when state is "index"', () => {
    let Component = Object.assign({}, PagePostItemIframe, { components: {} })
    let wrapper = shallow(Component, {
      propsData: {
        state: 'index',
        isPreview: false,
        postUrl: 'http://localhost/post/post_url',
        value: {
          id: 'ak8kej76JQY',
          width: 560,
          height: 315
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
