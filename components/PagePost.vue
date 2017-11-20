<template lang="pug">
  article.page-post
    PagePostTitle.page-post__title(
      v-model="model.title.data"
      :state="state"
      :is-preview="isPreview"
      :posts="posts"
      @init="data => $set(model.title, 'data', data)"
      @validated="isValid => $set(model.title, 'isValid', isValid)"
    )
    PagePostDatetime.page-post__datetime(
      v-model="model.datetime.data"
      :state="state"
      @init="data => $set(model.datetime, 'data', data)"
      @validated="isValid => $set(model.datetime, 'isValid', isValid)"
    )
    div
      div.page-post__item(
        v-for="(item, index) in model.content"
        v-if="!isPreview || isBeforeNext(index) || item.type === 'next'"
        :key="item.id"
        :class=`{
          'page-post__item_editable': state !== 'index',
          'page-post__item_has-error': (state !== 'index' && isMounted && !item.isValid)
        }`
      )
        PagePostPanel(
          v-if="state !== 'index' && isMounted"
          :content="model.content"
          :item="item"
          :index="index"
          @up-click="onItemUpClick(index)"
          @down-click="onItemDownClick(index)"
          @remove-click="onItemRemoveClick(index)"
        )
        component(
          :is="componentName(item.type)"
          v-model="item.data"
          :state="state"
          :is-preview="isPreview"
          :post-id="value.id"
          :post-url="url"
          @init="data => $set(item, 'data', data)"
          @validated="isValid => $set(item, 'isValid', isValid)"
        )
    PagePostTags.page-post__tags(
      v-model="model.tags.data"
      :state="state"
      :tags="$store.state.tags.list"
      @init="data => $set(model.tags, 'data', data)"
      @validated="isValid => $set(model.tags, 'isValid', isValid)"
    )
    PagePostShare(
      v-if="state === 'index' && !isPreview"
      :post-url="url"
      :title="value.name"
      :tags="$store.state.tags.list"
      :post-tag-ids="value.tags"
    )
    template(v-if="state !== 'index'")
      template(v-if="isMounted")
        AppButton(
          :disabled="isSaveDisabled"
          @click="onPostSaveClick"
        ) {{ saveLabel }}
        AppButton(
          v-if="state === 'edit'"
          @click="onPostOpenClick"
        ) перейти к посту
        AppTextError {{ errors.first('post') }}
      input(
        value="post"
        v-validate="'page-post__not-empty|page-post__valid'"
        name="post"
        type="hidden"
        data-vv-as="Пост"
      )
      PagePostModalImageFlickr(
        @init="onCreateItemImageFlickr"
      )
      PagePostModalIframeYoutube(
        @init="onCreateItemIframeYoutube"
      )
      PagePostModalItemRemove(
        @remove="onItemRemove"
      )
</template>

<script>
import AppButton from '~/components/AppButton'
import AppTextError from '~/components/AppTextError'
import PagePostShare from '~/components/PagePostShare.vue'
import PagePostDatetime from '~/components/PagePostDatetime.vue'
import PagePostItemIframe from '~/components/PagePostItemIframe.vue'
import PagePostItemImage from '~/components/PagePostItemImage.vue'
import PagePostItemNext from '~/components/PagePostItemNext.vue'
import PagePostItemPoem from '~/components/PagePostItemPoem.vue'
import PagePostItemText from '~/components/PagePostItemText.vue'
import PagePostModalIframeYoutube from '~/components/PagePostModalIframeYoutube.vue'
import PagePostModalImageFlickr from '~/components/PagePostModalImageFlickr.vue'
import PagePostModalItemRemove from '~/components/PagePostModalItemRemove.vue'
import PagePostPanel from '~/components/PagePostPanel.vue'
import PagePostTags from '~/components/PagePostTags.vue'
import PagePostTitle from '~/components/PagePostTitle.vue'

import _ from 'lodash'
const app = require(`~/config/app.${process.env.NODE_ENV}.json`)

export default {
  components: {
    AppButton,
    AppTextError,
    PagePostShare,
    PagePostDatetime,
    PagePostItemIframe,
    PagePostItemImage,
    PagePostItemNext,
    PagePostItemPoem,
    PagePostItemText,
    PagePostModalIframeYoutube,
    PagePostModalImageFlickr,
    PagePostModalItemRemove,
    PagePostPanel,
    PagePostTags,
    PagePostTitle
  },

  props: {
    state: {
      type: String,
      required: true
    },

    isPreview: {
      type: Boolean,
      required: true
    },

    value: {
      type: Object,
      required: true
    },

    posts: {
      type: Array,
      default: () => { return [] }
    }
  },

  data () {
    return {
      isMounted: false,

      model: {
        title: {
          data: {},
          isValid: false
        },
        datetime: {
          data: {},
          isValid: false
        },
        content: [],
        tags: {
          data: {},
          isValid: false
        }
      },

      lastItemId: 0
    }
  },

  computed: {
    nextIndex () {
      return this.model.content.findIndex(item => item.type === 'next')
    },

    isModelValid () {
      return _.concat(
        this.model.content,
        [
          this.model.title,
          this.model.datetime,
          this.model.tags
        ]
      ).every(item => item.isValid)
    },

    isChanged () {
      return !_.isEqual(this.dataToSave, this.value)
    },

    saveLabel () {
      return this.state === 'create' ? 'создать' : 'сохранить'
    },

    isSaveDisabled () {
      return this.errors.has('post') || !this.isChanged
    },

    dataToSave () {
      return {
        id: this.model.title.data.id,
        name: this.model.title.data.name,
        timestamp: this.model.datetime.data.timestamp,
        content: this.model.content.map(item => {
          let data = {}
          if (!_.isEmpty(item.data)) {
            switch (item.type) {
              case 'text':
                data = { html: item.data.html }
                break
              default:
                data = item.data
                break
            }
          }
          return {
            type: item.type,
            data: data
          }
        }),
        tags: this.model.tags.data.ids,
        description: this.description()
      }
    },

    url () {
      return `${app.siteUrl}/post/${this.value.id}`
    }
  },

  watch: {
    isModelValid () {
      this.$validator.validateAll()
    }
  },

  created () {
    if (!_.isEmpty(this.value)) {
      this.copyDataFromValue()
    }

    if (this.state !== 'index') {
      this.$bus.$on('create-item', this.onCreateItem)

      this.$validator.extend('page-post__not-empty', {
        getMessage: field => `${field} не содержит контента.`,
        validate: () => this.model.content.length
      })

      this.$validator.extend('page-post__valid', {
        getMessage: field => `Для того чтобы ${this.saveLabel} ${field}, необходимо исправить ошибки.`,
        validate: () => this.isModelValid
      })

      this.$nextTick(() => this.$validator.validateAll())
    }
  },

  mounted () {
    if (this.state !== 'index') {
      this.$leaveHook.add(this.onLeave)
    }
    this.$nextTick(() => { this.isMounted = true })
  },

  beforeDestroy () {
    this.$bus.$off('create-item')
    this.$leaveHook.remove(this.onLeave)
  },

  methods: {
    copyDataFromValue () {
      let value = _.cloneDeep(this.value)

      this.model.title.data = { id: value.id, name: value.name }
      this.model.datetime.data = { timestamp: value.timestamp }
      value.content.forEach(item => this.createItem(item))
      this.model.tags.data = { ids: value.tags }
    },

    onCreateItem (value) {
      switch (value.type) {
        case 'text':
        case 'next':
        case 'image':
        case 'poem':
          this.createItem(value)
          this.$nextTick(() => this.scrollToLastItem())
          break
        case 'flickr':
          this.$modal.show('page-post-modal-image-flickr')
          break
        case 'youtube':
          this.$modal.show('page-post-modal-iframe-youtube')
          break
      }
    },

    onCreateItemImageFlickr (data) {
      this.createItem({ type: 'image', data: data })
      this.$nextTick(() => this.scrollToLastItem())
    },

    onCreateItemIframeYoutube (data) {
      this.createItem({ type: 'iframe', data: data })
      this.$nextTick(() => this.scrollToLastItem())
    },

    getNewItemId () {
      return ++this.lastItemId
    },

    isBeforeNext (index) {
      return this.nextIndex === -1 ? true : index < this.nextIndex
    },

    componentName (type) {
      return 'PagePostItem' + type.charAt(0).toUpperCase() + type.slice(1)
    },

    onItemUpClick (index) {
      let offset = this.getItemOffset(index)
      this.swapItems(index - 1, index)
      this.$nextTick(() => this.scrollToItem(index - 1, offset))
    },

    onItemDownClick (index) {
      let offset = this.getItemOffset(index)
      this.swapItems(index, index + 1)
      this.$nextTick(() => this.scrollToItem(index + 1, offset))
    },

    onItemRemoveClick (index) {
      this.$modal.show('page-post-modal-item-remove', { index })
    },

    onItemRemove (index) {
      this.removeItem(index)
    },

    onPostSaveClick () {
      this.$emit('save', this.dataToSave)
    },

    onPostOpenClick () {
      this.$router.push(`/post/${this.value.id}`)
    },

    onLeave () {
      if (this.state === 'edit' || (this.state === 'create' && !_.isEmpty(this.dataToSave.content))) {
        return this.isChanged
      }
      return false
    },

    description () {
      let firstTextItem = !_.isEmpty(this.model.content) ? this.model.content.find(item => item.type === 'text') : undefined
      let tagNames = _.isArray(this.model.tags.data.ids) ? this.model.tags.data.ids.map(id => this.$store.state.tags.list.find(tag => tag.id === id).name) : []

      let textItem = (!_.isUndefined(firstTextItem) && _.isObject(firstTextItem.data) && !_.isEmpty(firstTextItem.data.text)) ? firstTextItem.data.text : ''
      let textName = `Пост "${this.model.title.data.name}".`
      let textTags = tagNames.length ? tagNames.map(name => `#${name}`).join(' ') : ''

      let description = !_.isEmpty(textItem) ? textItem : textName

      if (description.length <= app.descriptionMaxLength) {
        let descriptionWithTags = `${description} ${textTags}`
        if (descriptionWithTags.length <= app.descriptionMaxLength) {
          description = descriptionWithTags
        }
      } else {
        description = description.substr(0, app.descriptionMaxLength - 3) + '...'
      }

      return description
    },

    swapItems (index, nextIndex) {
      this.model.content[index] = this.model.content.splice(nextIndex, 1, this.model.content[index])[0]
    },

    createItem (data) {
      this.model.content.push(Object.assign({ id: this.getNewItemId(), isValid: false }, data))

      if (!_.isEmpty(this.$store.state.page.post) && data.type === 'next') {
        this.$store.commit('page/postUpdated', { is: { next: this.nextIndex !== -1 } })
      }

      this.$validator.validateAll()
    },

    removeItem (index) {
      let type = this.model.content[index].type
      this.model.content.splice(index, 1)

      if (!_.isEmpty(this.$store.state.page.post) && type === 'next') {
        this.$store.commit('page/postUpdated', { is: { next: this.nextIndex !== -1 } })
      }

      this.$validator.validateAll()
    },

    scrollToLastItem () {
      this.$scrollTo('.page-post__item:last-child', 1000)
    },

    scrollToItem (index, offset) {
      this.$scrollTo(`.page-post__item:nth-child(${index + 1})`, 200, { offset })
    },

    getItemOffset (index) {
      return window.scrollY - this.$el.querySelector(`.page-post__item:nth-child(${index + 1})`).offsetTop
    }
  }
}
</script>

<style lang="sass">
.page-post
  &__title
    margin: $page-title-margin-y 0
  &__datetime
    margin: 1rem 0
  &__item
    margin-top: 2rem
  &__item_editable
    border-top: 2px solid $border-color
    border-bottom: 2px solid $border-color
    padding-top: 0.6rem
  &__item_has-error
    border-color: rgb(red($border-color), 0, 0)
  &__tags
    margin-top: 1.5rem
    margin-bottom: 0.5rem
</style>
