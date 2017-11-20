<template lang="pug">
  div
    template(v-if="state ==='index'")
      AppTitle.app-title_center(
        v-if="isPreview"
        key="title-link"
        :to="`/post/${model.id}`"
        tag="h3"
        theme="sub"
      ) {{model.name}}
      AppTitle.app-title_center(
        v-else
        key="title"
        tag="h2"
        theme="sub"
      ) {{model.name}}
    template(v-else)
      AppInput(
        v-model="model.name"
        v-validate="'required'"
        name="name"
        placeholder="Заголовок"
        data-vv-as="Заголовок"
        @input="onNameChange"
      )
      AppTextError {{ errors.first('name') }}
      template(v-if="state ==='create'")
        AppInput(
          v-model="model.id"
          v-validate="'required|page-post-title__uniq-id|has-path-id-mixin__path-id'"
          name="id"
          placeholder="Ссылка"
          data-vv-as="Ссылка"
          @input="onInput"
        )
        AppTextError {{ errors.first('id') }}
</template>

<script>
import AppInput from '~/components/AppInput'
import AppTitle from '~/components/AppTitle'
import AppTextError from '~/components/AppTextError'
import HasModelMixin from '~/components/HasModelMixin'
import HasPathIdMixin from '~/components/HasPathIdMixin'

export default {
  components: {
    AppInput,
    AppTitle,
    AppTextError
  },

  mixins: [ HasModelMixin, HasPathIdMixin ],

  props: {
    state: {
      type: String,
      required: true
    },

    isPreview: {
      type: Boolean,
      required: true
    },

    posts: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      model: {
        id: '',
        name: ''
      }
    }
  },

  created () {
    this.$validator.extend('page-post-title__uniq-id', {
      getMessage: field => `Поле ${field} содержит существующую ссылку.`,
      validate: value => !this.posts.some(({ id }) => id === value)
    })
  },

  methods: {
    onNameChange (name) {
      if (this.state === 'create') {
        this.model.id = this.toPathId(name)
      }
      this.onInput()
    }
  }
}
</script>
