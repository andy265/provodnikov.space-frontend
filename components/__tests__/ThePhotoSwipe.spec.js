const { createRenderer } = require('vue-server-renderer')
const { createLocalVue, shallow } = require('vue-test-utils')
const ThePhotoSwipe = require('~/components/ThePhotoSwipe')

describe('ThePhotoSwipe.vue', () => {
  let localVue
  let mocks

  beforeEach(() => {
    localVue = createLocalVue()
    mocks = {
      $bus: {
        $on: jest.fn()
      }
    }
  })

  it('has same HTML structure', () => {
    let wrapper = shallow(ThePhotoSwipe, {
      localVue,
      mocks
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('has image-zoom event listener', () => {
    let wrapper = shallow(ThePhotoSwipe, {
      localVue,
      mocks
    })
    expect(wrapper.vm.$bus.$on.mock.calls[0][0]).toEqual('image-zoom')
  })
})
