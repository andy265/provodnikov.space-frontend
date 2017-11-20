const { createLocalVue, shallow } = require('vue-test-utils')
const Vuex = require('vuex')
const nextTick = require('~/script/nextTickPromise')
const PagePost = require('~/components/PagePost')

describe('PagePost.vue', () => {
  let options
  let localVue
  let store
  let mocks
  let propsData
  let longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store({
      state: {
        page: {
          post: {
            is: {
              next: false
            }
          }
        },
        tags: {
          list: [{
            id: 'id_tag_1',
            name: 'tag_1'
          }, {
            id: 'id_tag_2',
            name: 'tag_2'
          }, {
            id: 'id_tag_3',
            name: 'tag_3'
          }, {
            id: 'id_tag_4',
            name: 'tag_4'
          }]
        }
      },
      mutations: {
        'page/postUpdated': (state, { is }) => {
          state.page.post.is.next = is.next
        }
      }
    })
    mocks = {
      $validator: {
        extend: jest.fn(),
        validateAll: jest.fn()
      },
      $bus: {
        $on: jest.fn()
      },
      errors: {
        has: jest.fn(),
        first: jest.fn()
      },
      $leaveHook: {
        add: jest.fn()
      },
      $router: {
        push: jest.fn()
      },
      $scrollTo: jest.fn(),
      $modal: {
        show: jest.fn()
      }
    }
    propsData = {
      state: 'index',
      isPreview: false,
      value: {},
      posts: []
    }
    options = {
      localVue,
      store,
      mocks,
      propsData
    }
  })

  it('set "post not empty" validator', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.$validator.extend.mock.calls[0][0]).toBe('page-post__not-empty')
  })

  it('set "post is valid" validator', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.$validator.extend.mock.calls[1][0]).toBe('page-post__valid')
  })

  it('validate all after create', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    expect.assertions(1)
    return nextTick()
      .then(() => expect(wrapper.vm.$validator.validateAll.mock.calls).toHaveLength(1))
  })

  it('validate all on isModelValid change for update errors', () => {
    options.propsData.state = 'create'
    let wrapper = shallow(PagePost, options)
    wrapper.vm.model.title.isValid = true
    wrapper.vm.model.datetime.isValid = true
    wrapper.vm.model.tags.isValid = true
    expect.assertions(1)
    return nextTick()
      .then(() => expect(wrapper.vm.$validator.validateAll.mock.calls).toHaveLength(2))
  })

  it('has`t hook on leave if (state="index")', () => {
    options.propsData.state = 'index'
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.$leaveHook.add.mock.calls).toHaveLength(0)
  })

  it('has hook on leave if (state="edit")', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.$leaveHook.add.mock.calls).toHaveLength(1)
  })

  it('has hook on leave if (state="create")', () => {
    options.propsData.state = 'create'
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.$leaveHook.add.mock.calls).toHaveLength(1)
  })

  it('show alert window on leave when post has been changed if (state="edit")', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.onLeave()).toBe(true)
  })

  it('show alert window on leave when post has been changed if (state="create") and (content isn`t empty)', () => {
    options.propsData.state = 'create'
    options.propsData.value = { content: [{
      type: 'image'
    }]}
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.onLeave()).toBe(true)
  })

  it('prepare data to save', () => {
    options.propsData.state = 'edit'
    options.propsData.value = {
      id: 'some_id',
      name: 'some name',
      timestamp: 1489397821,
      content: [{
        type: 'text',
        data: {
          html: '<p>some text</p>'
        }
      }, {
        type: 'next',
        data: {}
      }, {
        type: 'poem',
        data: {
          name: 'poem name',
          text: 'line1\nline2'
        }
      }, {
        type: 'image',
        data: {
          src: 'https://farm5.staticflickr.com/4421/36226018631_aeecf3c385_o.jpg',
          width: 3000,
          height: 2000,
          href: 'https://www.flickr.com/photos/146658938@N03/36226018631/',
          alt: 'Ягоды в Кузнецовском Бору',
          caption: '<p>Ягоды в Кузнецовском Бору</p>',
          previewSrc: 'https://farm5.staticflickr.com/4421/36226018631_8ac649b582_h.jpg',
          previewWidth: 1600,
          previewHeight: 1067
        }
      }, {
        type: 'iframe',
        data: {
          id: 'aLnWk6m7nw0',
          width: 560,
          height: 315
        }
      }],
      tags: ['id_tag_1', 'id_tag_3'],
      description: 'some text #tag_1 #tag_3'
    }
    let wrapper = shallow(PagePost, options)

    wrapper.vm.model.content[0].data.text = 'some text'
    wrapper.vm.model.title.isValid = true
    wrapper.vm.model.datetime.isValid = true
    wrapper.vm.model.tags.isValid = true
    wrapper.vm.model.content[0].isValid = true
    wrapper.vm.model.content.forEach(item => {
      item.isValid = true
    })

    expect(wrapper.vm.dataToSave).toEqual(options.propsData.value)
  })

  it('emit "save" on "save post" button click', () => {
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onPostSaveClick()
    expect(wrapper.emitted().save).toHaveLength(1)
  })

  it('change route on "open post" button click', () => {
    options.propsData.value = {
      id: 'some_id',
      content: []
    }
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onPostOpenClick()
    expect(wrapper.vm.$router.push.mock.calls[0][0]).toBe('/post/some_id')
  })

  it('create description from text of first founded text item and tags', () => {
    options.propsData.value = {
      name: 'some name',
      content: [{
        type: 'next',
        data: {}
      }, {
        type: 'text',
        data: {
          html: '<p>some text</p>'
        }
      }],
      tags: ['id_tag_1', 'id_tag_3']
    }
    let wrapper = shallow(PagePost, options)
    wrapper.vm.model.content[1].data.text = 'some text'
    expect(wrapper.vm.description()).toBe('some text #tag_1 #tag_3')
  })

  it('create description from text of first founded text item and tags  if (description length with tags > max length)', () => {
    options.propsData.value = {
      name: 'some name',
      content: [{
        type: 'next',
        data: {}
      }, {
        type: 'text',
        data: {
          html: `<p>${longText.substr(0, 160)}</p>`
        }
      }],
      tags: ['id_tag_1', 'id_tag_3']
    }
    let wrapper = shallow(PagePost, options)
    wrapper.vm.model.content[1].data.text = longText.substr(0, 160)
    expect(wrapper.vm.description()).toBe(longText.substr(0, 160))
  })

  it('create description from clipped text of first founded text item if (description length with full text > max length)', () => {
    options.propsData.value = {
      name: 'some name',
      content: [{
        type: 'next',
        data: {}
      }, {
        type: 'text',
        data: {
          html: `<p>${longText.substr(0, 200)}</p>`
        }
      }],
      tags: ['id_tag_1', 'id_tag_3']
    }
    let wrapper = shallow(PagePost, options)
    wrapper.vm.model.content[1].data.text = longText.substr(0, 200)
    expect(wrapper.vm.description()).toBe(`${longText.substr(0, 157)}...`)
  })

  it('create description from post name and tags if (text item doesn`t exist)', () => {
    options.propsData.value = {
      name: 'some name',
      content: [],
      tags: ['id_tag_1', 'id_tag_3']
    }
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.description()).toBe('Пост "some name". #tag_1 #tag_3')
  })

  it('create description from post name if (text item doesn`t exist) and (description length with tags > max length)', () => {
    options.propsData.value = {
      name: longText.substr(0, 150),
      content: [],
      tags: ['id_tag_1', 'id_tag_3']
    }
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.description()).toBe(`Пост "${longText.substr(0, 150)}".`)
  })

  it('create description from clipped post name if (text item doesn`t exist) and (description length with full name > max length)', () => {
    options.propsData.value = {
      name: longText.substr(0, 200),
      content: [],
      tags: ['id_tag_1', 'id_tag_3']
    }
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.description()).toBe(`Пост "${longText.substr(0, 151)}...`)
  })

  it('recive create-item event', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.$bus.$on.mock.calls[0][0]).toBe('create-item')
  })

  it('and create item with type text', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onCreateItem({ type: 'text' })
    expect(wrapper.vm.model.content[0].type).toBe('text')
  })

  it('or create item with type next', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onCreateItem({ type: 'next' })
    expect(wrapper.vm.model.content[0].type).toBe('next')
  })

  it('or create item with type image', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onCreateItem({ type: 'image' })
    expect(wrapper.vm.model.content[0].type).toBe('image')
  })

  it('or create item with type poem', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onCreateItem({ type: 'poem' })
    expect(wrapper.vm.model.content[0].type).toBe('poem')
  })

  it('or open modal for item with type flickr and create item with type image', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onCreateItem({ type: 'flickr' })
    expect(wrapper.vm.$modal.show.mock.calls[0][0]).toBe('page-post-modal-image-flickr')
    wrapper.vm.onCreateItemImageFlickr({})
    expect(wrapper.vm.model.content[0].type).toBe('image')
  })

  it('or open modal for item with type youtube and create item with type iframe', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onCreateItem({ type: 'youtube' })
    expect(wrapper.vm.$modal.show.mock.calls[0][0]).toBe('page-post-modal-iframe-youtube')
    wrapper.vm.onCreateItemIframeYoutube({})
    expect(wrapper.vm.model.content[0].type).toBe('iframe')
  })

  it('and update next index in store after create next item', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onCreateItem({ type: 'next' })
    expect(wrapper.vm.$store.state.page.post.is.next).toBe(true)
  })

  it('and validate all after create item', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.$validator.validateAll.mock.calls).toHaveLength(0)
    wrapper.vm.onCreateItem({ type: 'text' })
    expect(wrapper.vm.$validator.validateAll.mock.calls).toHaveLength(1)
  })

  it('and scroll to last item after create item', () => {
    options.propsData.state = 'edit'
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onCreateItem({ type: 'text' })
    wrapper.vm.onCreateItemImageFlickr({})
    wrapper.vm.onCreateItemIframeYoutube({})
    expect.assertions(1)
    return nextTick()
      .then(() => expect(wrapper.vm.$scrollTo.mock.calls).toHaveLength(3))
  })

  it('swap items and scroll to item on up-click event', () => {
    options.propsData.state = 'edit'
    options.propsData.value = {
      content: [{
        type: 'text'
      }, {
        type: 'image'
      }]
    }
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onItemUpClick(1)
    expect.assertions(3)
    expect(wrapper.vm.model.content[0].type).toBe('image')
    expect(wrapper.vm.model.content[1].type).toBe('text')
    return nextTick()
      .then(() => expect(wrapper.vm.$scrollTo.mock.calls).toHaveLength(1))
  })

  it('swap items and scroll to item on down-click event', () => {
    options.propsData.state = 'edit'
    options.propsData.value = {
      content: [{
        type: 'text'
      }, {
        type: 'image'
      }]
    }
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onItemDownClick(0)
    expect.assertions(3)
    expect(wrapper.vm.model.content[0].type).toBe('image')
    expect(wrapper.vm.model.content[1].type).toBe('text')
    return nextTick()
      .then(() => expect(wrapper.vm.$scrollTo.mock.calls).toHaveLength(1))
  })

  it('show modal on remove-click event', () => {
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onItemRemoveClick(1)
    expect(wrapper.vm.$modal.show.mock.calls[0][0]).toBe('page-post-modal-item-remove')
  })

  it('remove item on remove event', () => {
    options.propsData.state = 'edit'
    options.propsData.value = {
      content: [{
        type: 'text'
      }]
    }
    let wrapper = shallow(PagePost, options)
    wrapper.vm.onItemRemove(0)
    expect(wrapper.vm.model.content).toHaveLength(0)
  })

  it('and update next index in store after remove next item', () => {
    options.propsData.state = 'edit'
    options.propsData.value = {
      content: [{
        type: 'text'
      }, {
        type: 'next'
      }]
    }
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.$store.state.page.post.is.next).toBe(true)
    wrapper.vm.onItemRemove(0)
    expect(wrapper.vm.$store.state.page.post.is.next).toBe(true)
    wrapper.vm.onItemRemove(0)
    expect(wrapper.vm.$store.state.page.post.is.next).toBe(false)
  })

  it('and validate all after remove item', () => {
    options.propsData.state = 'edit'
    options.propsData.value = {
      content: [{
        type: 'text'
      }]
    }
    let wrapper = shallow(PagePost, options)
    expect(wrapper.vm.$validator.validateAll.mock.calls).toHaveLength(1)
    wrapper.vm.onItemRemove(0)
    expect(wrapper.vm.$validator.validateAll.mock.calls).toHaveLength(2)
  })
})
