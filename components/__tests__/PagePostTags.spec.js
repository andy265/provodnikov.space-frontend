const { createRenderer } = require('vue-server-renderer')
const { createLocalVue, shallow } = require('vue-test-utils')
const Vuex = require('vuex')
const nextTick = require('~/script/nextTickPromise')
jest.mock('~/components/HasModelMixin', () => require('HasModelMixin'))
jest.mock('~/components/HasPathIdMixin', () => require('HasPathIdMixin'))
const PagePostTags = require('~/components/PagePostTags')

describe('PagePostTags.vue', () => {
  let localVue
  let store
  let mocks
  let propsData
  let options
  let $refs
  let wrapper

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store({
      state: {},
      actions: {
        'tags/add': (store, tag) => {
          wrapper.vm.tags.push(tag)
          return new Promise(resolve => resolve())
        }
      }
    })
    mocks = {
      $modal: {
        show: jest.fn()
      }
    }
    propsData = {
      state: 'edit',
      tags: [{
        id: 'id_1',
        name: 'name 1'
      }, {
        id: 'id_2',
        name: 'name 2'
      }, {
        id: 'id_3',
        name: 'name 3'
      }, {
        id: 'id_4',
        name: 'name 4'
      }],
      value: {
        ids: [
          'id_1',
          'id_3'
        ]
      }
    }
    options = {
      localVue,
      store,
      mocks,
      propsData
    }
    $refs = {
      multiSelect: {
        $refs: {
          search: {
            blur: jest.fn()
          }
        }
      }
    }
  })

  it('has same HTML structure when state is "index"', () => {
    options.propsData.state = 'index'
    let Component = Object.assign({}, PagePostTags, { components: {} })
    wrapper = shallow(Component, options)
    wrapper.vm.selectedTags.toString = () => JSON.stringify(wrapper.vm.selectedTags)
    let renderer = createRenderer()
    // eslint-disable-next-line
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('create names from tags', () => {
    wrapper = shallow(PagePostTags, options)
    expect(wrapper.vm.names).toEqual({
      'id_1': 'name 1',
      'id_2': 'name 2',
      'id_3': 'name 3',
      'id_4': 'name 4'
    })
  })

  it('create selectedTags from tags ids from post and tags', () => {
    wrapper = shallow(PagePostTags, options)
    expect(wrapper.vm.selectedTags).toEqual([{
      id: 'id_1',
      name: 'name 1'
    }, {
      id: 'id_3',
      name: 'name 3'
    }])
  })

  it('close multiselect on new tag name recive', () => {
    wrapper = shallow(PagePostTags, options)
    wrapper.vm.$refs = $refs
    wrapper.vm.onTagName('new name')
    expect(wrapper.vm.$refs.multiSelect.$refs.search.blur.mock.calls).toHaveLength(1)
  })

  it('open modal for create new tag on new tag name recive', () => {
    wrapper = shallow(PagePostTags, options)
    wrapper.vm.$refs = $refs
    wrapper.vm.onTagName('new name')
    expect(wrapper.vm.$modal.show.mock.calls[0]).toEqual([
      'page-post-tags-modal-tag', {
        id: '8',
        name: 'new name'
      }
    ])
  })

  it('can add new tag', () => {
    wrapper = shallow(PagePostTags, options)
    wrapper.vm.onCreateTag({
      id: 'new_id',
      name: 'new name'
    })
    expect.assertions(2)
    return nextTick()
      .then(() => expect(wrapper.vm.tags).toEqual(expect.arrayContaining([{
        id: 'new_id',
        name: 'new name'
      }])))
      .then(() => expect(wrapper.vm.model.ids).toEqual(expect.arrayContaining(['new_id'])))
  })

  it('can remove doesn`t exit tags on tags change', () => {
    wrapper = shallow(PagePostTags, options)
    wrapper.vm.model.ids.push('not_exist_id')
    wrapper.vm.onTagsChange()
    expect(wrapper.emitted().input[0][0]).toEqual({
      ids: [
        'id_1',
        'id_3'
      ]
    })
  })

  it('emit "input" event on tags change', () => {
    wrapper = shallow(PagePostTags, options)
    wrapper.vm.model.ids.push('id_2')
    wrapper.vm.onTagsChange()
    expect(wrapper.emitted().input[0][0]).toEqual({
      ids: [
        'id_1',
        'id_2',
        'id_3'
      ]
    })
  })
})
