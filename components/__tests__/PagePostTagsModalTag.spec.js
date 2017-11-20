const { shallow, createLocalVue } = require('vue-test-utils')
jest.mock('~/components/HasPathIdMixin', () => require('HasPathIdMixin'))
const PagePostTagsModalTag = require('~/components/PagePostTagsModalTag')

describe('PagePostTagsModalTag.vue', () => {
  let localVue
  let mocks
  let propsData
  let options

  beforeEach(() => {
    localVue = createLocalVue()
    mocks = {
      $modal: {
        hide: jest.fn()
      },
      $validator: {
        extend: jest.fn(),
        validateAll: jest.fn()
      },
      errors: {
        first: jest.fn(),
        count: () => 0
      }
    }
    propsData = {
      tags: [{
        id: 'id_1'
      }, {
        id: 'id_2'
      }]
    }
    options = {
      localVue,
      mocks,
      propsData
    }
  })

  it('can be opened by name by other components', () => {
    let Component = Object.assign({}, PagePostTagsModalTag, { components: {} })
    let wrapper = shallow(Component, options)
    expect(wrapper.find('AppModal').hasAttribute('name', 'page-post-tags-modal-tag')).toBe(true)
  })

  it('set tag id validator', () => {
    let wrapper = shallow(PagePostTagsModalTag, options)
    expect(wrapper.vm.$validator.extend.mock.calls[0][0]).toBe('page-post-tags-modal-tag__uniq-id')
  })

  it('recive tag name and id before open', () => {
    let wrapper = shallow(PagePostTagsModalTag, options)
    wrapper.vm.onBeforeOpen({
      id: 'some id',
      name: 'some name'
    })
    expect(wrapper.vm.model).toEqual({
      id: 'some id',
      name: 'some name'
    })
  })

  it('validate all after open', () => {
    let wrapper = shallow(PagePostTagsModalTag, options)
    wrapper.vm.onOpened()
    expect(wrapper.vm.$validator.validateAll.mock.calls).toHaveLength(1)
  })

  it('validate all on name change', () => {
    let wrapper = shallow(PagePostTagsModalTag, options)
    wrapper.vm.onNameChange()
    expect(wrapper.vm.$validator.validateAll.mock.calls).toHaveLength(1)
  })

  it('and tag is valid if (id is unique)', () => {
    let wrapper = shallow(PagePostTagsModalTag, options)
    expect(wrapper.vm.$validator.extend.mock.calls[0][1].validate('new_id')).toBe(true)
  })

  it('and tag is invalid if (id isn`t unique)', () => {
    let wrapper = shallow(PagePostTagsModalTag, options)
    expect(wrapper.vm.$validator.extend.mock.calls[0][1].validate('id_1')).toBe(false)
  })

  it('update id on name change', () => {
    let wrapper = shallow(PagePostTagsModalTag, options)
    wrapper.vm.onBeforeOpen({
      id: 'some id',
      name: 'some name'
    })
    wrapper.vm.onNameChange()
    expect(wrapper.vm.model.id).toBe('9')
  })

  it('emit "create" event on "create" button click', () => {
    let wrapper = shallow(PagePostTagsModalTag, options)
    wrapper.vm.onBeforeOpen({
      id: 'some id',
      name: 'some name'
    })
    wrapper.vm.onCreateClick()
    expect(wrapper.emitted().create[0][0]).toEqual({
      id: 'some id',
      name: 'some name'
    })
  })

  it('close on "create" button click', () => {
    let wrapper = shallow(PagePostTagsModalTag, options)
    wrapper.vm.onCreateClick()
    expect(wrapper.vm.$modal.hide.mock.calls).toHaveLength(1)
  })

  it('close on "close" button click', () => {
    let wrapper = shallow(PagePostTagsModalTag, options)
    wrapper.vm.onCloseClick()
    expect(wrapper.vm.$modal.hide.mock.calls).toHaveLength(1)
  })
})
