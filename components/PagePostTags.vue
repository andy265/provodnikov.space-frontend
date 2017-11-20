<template lang="pug">
  div.page-post-tags
    template(v-if="state ==='index'")
      AppTags.app-tags_direction_row(:tags="selectedTags")
    template(v-else)
      PagePostTagsModalTag(
        :tags="tags"
        @create="onCreateTag"
      )
      MultiSelect.page-post-tags__select(
        v-model="model.ids"
        :options="tags.map(tag => tag.id)"
        :multiple="true"
        :custom-label="customLabel"
        :close-on-select="false"
        :taggable="true"
        ref="multiSelect"
        placeholder="Теги"
        tag-placeholder="Добавить новый тег"
        selectLabel="Нажмите enter чтобы выбрать"
        selectedLabel="Выбрано"
        deselectLabel="Нажмите enter чтобы убрать"
        @tag="onTagName"
        @input="onTagsChange"
      )
</template>

<script>
import AppTags from '~/components/AppTags'
import HasModelMixin from '~/components/HasModelMixin'
import HasPathIdMixin from '~/components/HasPathIdMixin'
import PagePostTagsModalTag from '~/components/PagePostTagsModalTag'

export default {
  components: {
    AppTags,
    PagePostTagsModalTag
  },

  mixins: [ HasModelMixin, HasPathIdMixin ],

  props: {
    state: {
      type: String,
      required: true
    },

    tags: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      model: {
        ids: []
      }
    }
  },

  computed: {
    names () {
      let names = {}
      this.tags.forEach(tag => { names[tag.id] = tag.name })
      return names
    },

    selectedTags () {
      return this.model.ids.map(id => {
        return { id: id, name: this.names[id] }
      })
    }
  },

  methods: {
    customLabel (id) {
      return this.names[id]
    },

    onTagName (name) {
      this.$refs.multiSelect.$refs.search.blur()
      this.$modal.show('page-post-tags-modal-tag', { name: name, id: this.toPathId(name) })
    },

    onCreateTag ({ id, name }) {
      this.$store.dispatch('tags/add', { id, name }).then(() => {
        this.model.ids.push(id)
        this.onTagsChange()
      })
        .catch(() => console.error(`Ошибка. Тег "${name}" ("${id}") не добавлен.`))
    },

    onTagsChange () {
      this.model.ids = this.tags.filter(tag => this.model.ids.includes(tag.id)).map(tag => tag.id)
      this.onInput()
    }
  }
}
</script>

<style lang="sass">
.page-post-tags__select
  .multiselect__tags,
  .multiselect__tag,
  .multiselect__tag-icon,
  .multiselect__content-wrapper
    border-radius: 0
  .multiselect__input::placeholder
    @include placeholder
</style>
