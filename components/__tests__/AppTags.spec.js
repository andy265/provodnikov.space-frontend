const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const AppTags = require('~/components/AppTags')

describe('AppTags.vue', () => {
  it('has same HTML structure', () => {
    Object.assign(AppTags, { components: {} })
    let wrapper = shallow(AppTags, {
      propsData: {
        tags: [
          { id: 'tag_id_1', name: 'tag name 1' },
          { id: 'tag_id_2', name: 'tag name 2' }
        ]
      }
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
