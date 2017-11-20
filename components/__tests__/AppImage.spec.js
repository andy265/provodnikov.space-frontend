const { createRenderer } = require('vue-server-renderer')
const { shallow } = require('vue-test-utils')
const AppImage = require('~/components/AppImage')

describe('AppImage.vue', () => {
  let wrapper = shallow(AppImage, {
    propsData: {
      src: 'http://localhost:3000/some_img.jpg',
      alt: 'description'
    }
  })

  it('has same HTML structure', () => {
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('emit click event', () => {
    wrapper.find('img').trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
  })

  it('emit error event', () => {
    wrapper.find('img').trigger('error')
    expect(wrapper.emitted().error).toBeTruthy()
  })
})
