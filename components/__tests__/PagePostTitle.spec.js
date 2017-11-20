const { createRenderer } = require('vue-server-renderer')
const { createLocalVue, shallow } = require('vue-test-utils')
jest.mock('~/components/HasModelMixin', () => require('HasModelMixin'))
jest.mock('~/components/HasPathIdMixin', () => require('HasPathIdMixin'))
const PagePostTitle = require('~/components/PagePostTitle')

describe('PagePostTitle.vue', () => {
  let localVue
  let mocks
  let propsData
  let options

  beforeEach(() => {
    localVue = createLocalVue()
    mocks = {
      $validator: {
        extend: jest.fn(),
        validateAll: jest.fn()
      },
      errors: {
        first: jest.fn()
      }
    }
    propsData = {
      state: 'index',
      isPreview: true,
      posts: [{
        id: 'id_1'
      }, {
        id: 'id_2'
      }],
      value: {
        id: 'some_id',
        name: 'some name'
      }
    }
    options = {
      localVue,
      mocks,
      propsData
    }
  })

  it('has same HTML structure when state is "index" and it is preview', () => {
    let Component = Object.assign({}, PagePostTitle, { components: {} })
    let wrapper = shallow(Component, options)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('has same HTML structure when state is "index" and it isn`t preview', () => {
    options.propsData.isPreview = false
    let Component = Object.assign({}, PagePostTitle, { components: {} })
    let wrapper = shallow(Component, options)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('set post id validator', () => {
    let wrapper = shallow(PagePostTitle, options)
    expect(wrapper.vm.$validator.extend.mock.calls[0][0]).toBe('page-post-title__uniq-id')
  })

  it('and post id is valid if (id is unique)', () => {
    let wrapper = shallow(PagePostTitle, options)
    expect(wrapper.vm.$validator.extend.mock.calls[0][1].validate('new_id')).toBe(true)
  })

  it('and post id is invalid if (id isn`t unique)', () => {
    let wrapper = shallow(PagePostTitle, options)
    expect(wrapper.vm.$validator.extend.mock.calls[0][1].validate('id_1')).toBe(false)
  })

  it('update id on name change if(state is "create")', () => {
    options.propsData.state = 'create'
    options.propsData.value = {}
    let wrapper = shallow(PagePostTitle, options)
    wrapper.vm.onNameChange('new name')
    expect(wrapper.vm.model.id).toBe('8')
  })

  it('doesn`t change id on name change if(state isn`t "create")', () => {
    options.propsData.state = 'edit'
    options.propsData.value = {
      id: 'some_id',
      name: 'some name'
    }
    let wrapper = shallow(PagePostTitle, options)
    wrapper.vm.onNameChange('new name')
    expect(wrapper.vm.model.id).toBe('some_id')
  })

  it('emit "input" event on name change', () => {
    options.propsData.state = 'edit'
    options.propsData.value = {
      id: 'some_id',
      name: 'some name'
    }
    let wrapper = shallow(PagePostTitle, options)
    wrapper.vm.model.name = 'new name'
    wrapper.vm.onNameChange('new name')
    expect(wrapper.emitted().input[0][0]).toEqual({
      id: 'some_id',
      name: 'new name'
    })
  })
})
