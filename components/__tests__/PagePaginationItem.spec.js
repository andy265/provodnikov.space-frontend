const { createRenderer } = require('vue-server-renderer')
const { mount, shallow } = require('vue-test-utils')
const PagePaginationItem = require('~/components/PagePaginationItem')

describe('PagePaginationItem.vue', () => {
  it('has same HTML structure', () => {
    let wrapper = shallow(PagePaginationItem, {
      propsData: {
        isLink: false,
        to: '/page'
      },
      slots: {
        default: '<span>next page</span>'
      }
    })
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('can have link', () => {
    let wrapper = mount(PagePaginationItem, {
      propsData: {
        isLink: true,
        to: '/page'
      }
    })
    expect(wrapper.find('a').hasAttribute('href', '/page')).toBeTruthy()
  })
})
