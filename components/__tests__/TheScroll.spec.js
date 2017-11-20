const { shallow } = require('vue-test-utils')
const TheScroll = require('~/components/TheScroll')

describe('TheScroll.vue', () => {
  let wrapper
  const viewportHeight = 1080

  beforeEach(() => {
    global.addEventListener = () => {}
    global.removeEventListener = () => {}
    global.scrollTo = jest.fn((x, y) => {
      global.scrollY = y
      wrapper.vm.onScroll()
    })

    global.innerHeight = viewportHeight
    global.scrollY = 0

    wrapper = shallow(TheScroll)
  })

  function scrollTo (val) {
    global.scrollY = val
    wrapper.vm.onScroll()
  }

  it('scrolling after click on scroll bar', () => {
    scrollTo(viewportHeight)
    wrapper.vm.onClick()
    expect(global.scrollTo.mock.calls).toHaveLength(1)
  })

  it('hide scroll bar if (position of scroll <= half of viewport) and (position of previous scroll == 0)', () => {
    expect(global.scrollY).toBeLessThanOrEqual(viewportHeight / 2)
    expect(wrapper.vm.offset).toBe(0)
    expect(wrapper.vm.isShow).toBe(false)
  })

  it('show scroll bar if (position of scroll <= half of viewport) and (position of previous scroll  > 0)', () => {
    scrollTo(viewportHeight)
    wrapper.vm.onClick()
    scrollTo(viewportHeight / 2)
    expect(global.scrollY).toBeLessThanOrEqual(viewportHeight / 2)
    expect(wrapper.vm.offset).not.toBe(0)
    expect(wrapper.vm.isShow).toBe(true)
  })

  it('show scroll bar if (position of scroll  > half of viewport)', () => {
    scrollTo(viewportHeight / 2 + 1)
    expect(global.scrollY).toBeGreaterThan(viewportHeight / 2)
    expect(wrapper.vm.isShow).toBe(true)
  })

  it('save  position of scroll after scrolling to top by clicking on scroll bar', () => {
    scrollTo(viewportHeight)
    wrapper.vm.onClick()
    expect(wrapper.vm.offset).toBe(viewportHeight)
  })

  it('reset position of scroll after scrolling to position of scroll by clicking on scroll bar', () => {
    scrollTo(viewportHeight)
    wrapper.vm.onClick()
    expect(wrapper.vm.offset).toBe(viewportHeight)
    wrapper.vm.onClick()
    expect(wrapper.vm.offset).toBe(0)
  })

  it('reset position of scroll after scrolling to half of viewport using browser', () => {
    scrollTo(viewportHeight)
    wrapper.vm.onClick()
    expect(wrapper.vm.offset).toBe(viewportHeight)
    scrollTo(viewportHeight / 2)
    expect(wrapper.vm.offset).toBe(viewportHeight)
    scrollTo(viewportHeight / 2 + 1)
    expect(wrapper.vm.offset).toBe(0)
  })

  it('show icon up if (position of previous scroll == 0)', () => {
    scrollTo(viewportHeight)
    expect(wrapper.vm.offset).toBe(0)
    expect(wrapper.vm.iconType).toBe('angle-up')
  })

  it('show icon down if (position of previous scroll > 0)', () => {
    scrollTo(viewportHeight)
    wrapper.vm.onClick()
    expect(wrapper.vm.offset).not.toBe(0)
    expect(wrapper.vm.iconType).toBe('angle-down')
  })
})
