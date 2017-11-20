const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const PagePostShare = require('~/components/PagePostShare')

describe('PagePostShare.vue', () => {
  let floor = Math.floor
  let options = {
    propsData: {
      postUrl: 'http://localhost:3000/post/post_url',
      title: 'post title',
      tags: [{
        id: 'tag_id_1',
        name: 'tag_1'
      }, {
        id: 'tag_id_2',
        name: 'tag_2'
      }, {
        id: 'tag_id_3',
        name: 'tag_3'
      }],
      postTagIds: [
        'tag_id_1',
        'tag_id_2'
      ]
    }
  }

  beforeEach(() => {
    global.Math = {
      random: () => 0,
      floor: (val) => floor(val)
    }
  })

  it('has same HTML structure', () => {
    let Component = Object.assign({}, PagePostShare, { components: {} })
    let wrapper = shallow(Component, options)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('has randomly chosen phrase', () => {
    global.Math.random = () => 0
    let wrapper = shallow(PagePostShare, options)
    let firstPhrase = wrapper.vm.phrase
    global.Math.random = () => 0.999
    wrapper = shallow(PagePostShare, options)
    let lastPhrase = wrapper.vm.phrase
    expect(firstPhrase).not.toBe(lastPhrase)
  })

  it('can transform tags to social sharing hashtags', () => {
    let wrapper = shallow(PagePostShare, options)
    expect(wrapper.vm.hashtags).toBe('tag_1,tag_2')
  })
})
