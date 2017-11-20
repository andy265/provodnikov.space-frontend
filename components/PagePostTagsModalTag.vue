<template lang="pug">
  AppModal.page-post-tags-modal-tag(
    name="page-post-tags-modal-tag"
    @before-open="onBeforeOpen"
    @opened="onOpened"
  )
    template(slot="content")
      AppInput(
        v-model="model.name"
        v-validate="'required'"
        name="name"
        placeholder="Название"
        data-vv-as="Название"
        @input="onNameChange"
      )
      AppTextError {{ errors.first('name') }}
      AppInput(
        v-model="model.id"
        v-validate="'required|page-post-tags-modal-tag__uniq-id|has-path-id-mixin__path-id'"
        name="id"
        placeholder="Ссылка"
        data-vv-as="Ссылка"
      )
      AppTextError {{ errors.first('id') }}
    template(slot="buttons")
      AppButton(@click="onCloseClick") Отменить
      AppButton(
        :disabled="errors.count() > 0"
        @click="onCreateClick"
      ) Создать
</template>

<script>
import AppButton from '~/components/AppButton'
import AppInput from '~/components/AppInput'
import AppModal from '~/components/AppModal'
import AppTextError from '~/components/AppTextError'
import HasPathIdMixin from '~/components/HasPathIdMixin'

export default {
  components: {
    AppButton,
    AppInput,
    AppModal,
    AppTextError
  },

  mixins: [ HasPathIdMixin ],

  props: {
    tags: {
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
    this.$validator.extend('page-post-tags-modal-tag__uniq-id', {
      getMessage: field => `Поле ${field} содержит существующую ссылку.`,
      validate: value => !this.tags.some(({ id }) => id === value)
    })
  },

  methods: {
    onBeforeOpen ({ id, name }) {
      this.model.id = id
      this.model.name = name
    },

    onOpened () {
      this.$validator.validateAll()
    },

    onCloseClick () {
      this.$modal.hide('page-post-tags-modal-tag')
    },

    onCreateClick () {
      this.$emit('create', this.model)
      this.$modal.hide('page-post-tags-modal-tag')
    },

    onNameChange () {
      this.model.id = this.toPathId(this.model.name)
      this.$validator.validateAll()
    }
  }
}
</script>
