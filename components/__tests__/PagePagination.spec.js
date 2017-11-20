const { shallow } = require('vue-test-utils')
const PagePagination = require('~/components/PagePagination')

describe('PagePagination.vue', () => {
  function createWrapper ({ current, count, path, pathToFirstPage }) {
    return shallow(PagePagination, {
      propsData: {
        current: current || 1,
        count: count || 3,
        path: path || '/main/page/',
        pathToFirstPage: pathToFirstPage || '/main'
      }
    })
  }
  function createWrapperWithStructure ({ current, count, path, pathToFirstPage }) {
    let Component = Object.assign({}, PagePagination, { components: {} })
    return shallow(Component, {
      propsData: {
        current: current || 1,
        count: count || 3,
        path: path || '/main/page/',
        pathToFirstPage: pathToFirstPage || '/main'
      }
    })
  }

  beforeEach(() => {
    global.matchMedia = () => ({
      addListener: jest.fn(),
      matches: false
    })
  })

  it('add path to number of the page', () => {
    let wrapper = createWrapper({ path: '/page/' })
    expect(wrapper.vm.pathTo(56)).toEqual('/page/56')
  })

  it('but has special path for the first page', () => {
    let wrapper = createWrapper({ path: '/page/', pathToFirstPage: '/first_page' })
    expect(wrapper.vm.pathTo(1)).toEqual('/first_page')
  })

  it('select item related to the current page', () => {
    let wrapper = createWrapper({ current: 2, count: 3 })
    expect(wrapper.vm.is(2)).toBeTruthy()
  })

  it('and item isn`t clickable', () => {
    let wrapper = createWrapper({ current: 2, count: 3 })
    expect(wrapper.vm.isNot(2)).toBeFalsy()
  })

  it('and other items are clickable', () => {
    let wrapper = createWrapper({ current: 2, count: 3 })
    expect(wrapper.vm.isNot(1)).toBeTruthy()
    expect(wrapper.vm.isNot(3)).toBeTruthy()
  })

  it('has`t link "first page" if (left item related to first page)', () => {
    let wrapper = createWrapperWithStructure({ current: 2, count: 5 })
    let items = wrapper.findAll('.page-pagination__item')
    expect(items.at(1).text()).toBe('1')
    expect(items.at(2).text()).toBe('2')
  })

  it('has link "first page" if (left item related to second page)', () => {
    let wrapper = createWrapperWithStructure({ current: 3, count: 5 })
    let items = wrapper.findAll('.page-pagination__item')
    expect(items.at(1).text()).toBe('1')
  })

  it('has link "first page.." if (left item related to third or more page)', () => {
    let wrapper = createWrapperWithStructure({ current: 4, count: 5 })
    let items = wrapper.findAll('.page-pagination__item')
    expect(items.at(1).text()).toBe('1..')
  })

  it('has link "back"', () => {
    let wrapper = createWrapperWithStructure({})
    let items = wrapper.findAll('.page-pagination__item')
    expect(items.at(0).text()).toEqual(expect.stringContaining('назад'))
  })

  it('and link "back" isn`t clickable if (current page is first)', () => {
    let wrapper = createWrapper({ current: 1, count: 3 })
    expect(wrapper.vm.isNot(wrapper.vm.first)).toBeFalsy()
  })

  it('has link "forward"', () => {
    let wrapper = createWrapperWithStructure({})
    let items = wrapper.findAll('.page-pagination__item')
    expect(items.at(items.length - 1).text()).toEqual(expect.stringContaining('вперёд'))
  })

  it('and link "forward" isn`t clickable if  (current page is last)', () => {
    let wrapper = createWrapper({ current: 3, count: 3 })
    expect(wrapper.vm.isNot(wrapper.vm.last)).toBeFalsy()
  })

  it('has`t link "last page" if (right item related to last page)', () => {
    let wrapper = createWrapperWithStructure({ current: 4, count: 5 })
    let items = wrapper.findAll('.page-pagination__item')
    expect(items.at(items.length - 2).text()).toBe('5')
    expect(items.at(items.length - 3).text()).toBe('4')
  })

  it('has link "last page" if (right item related to last - 1 page)', () => {
    let wrapper = createWrapperWithStructure({ current: 3, count: 5 })
    let items = wrapper.findAll('.page-pagination__item')
    expect(items.at(items.length - 2).text()).toBe('5')
  })

  it('has link "..last page" if (right item related to last - 2 or less page)', () => {
    let wrapper = createWrapperWithStructure({ current: 2, count: 5 })
    let items = wrapper.findAll('.page-pagination__item')
    expect(items.at(items.length - 2).text()).toBe('..5')
  })

  it('contain minimum 1 items', () => {
    let wrapper = createWrapper({ count: 1 })
    expect(wrapper.vm.pages).toHaveLength(1)
  })

  it('contain maximum 1 items if (device="mobile")', () => {
    global.matchMedia = () => ({
      addListener: jest.fn(),
      matches: true
    })
    let wrapper = createWrapper({ count: 25 })
    expect(wrapper.vm.pages).toHaveLength(1)
  })

  it('contain maximum 3 items if (device="desktop")', () => {
    let wrapper = createWrapper({ count: 25 })
    expect(wrapper.vm.pages).toHaveLength(3)
  })

  it('and item related to the current page placed in the center', () => {
    let wrapper = createWrapper({ current: 6, count: 25 })
    expect(wrapper.vm.pages).toEqual([5, 6, 7])
  })

  it('but if current page is first, item placed to the left', () => {
    let wrapper = createWrapper({ current: 1, count: 25 })
    expect(wrapper.vm.pages).toEqual([1, 2, 3])
  })

  it('but if current page is last, item placed to the right', () => {
    let wrapper = createWrapper({ current: 25, count: 25 })
    expect(wrapper.vm.pages).toEqual([23, 24, 25])
  })
})
