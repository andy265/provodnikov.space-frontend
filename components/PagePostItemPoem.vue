<template lang="pug">
  div.page-post-item-poem
    template(v-if="state === 'index'")
      p.page-post-item-poem__name {{model.name}}
      p.page-post-item-poem__text {{model.text}}
    template(v-else)
      AppInput(
        v-model="model.name"
        v-validate="'required'"
        name="name"
        placeholder="Заголовок"
        data-vv-as="Заголовок"
        @input="onInput"
      )
      AppTextError {{ errors.first('name') }}
      AppTextarea(
        v-model="model.text"
        v-validate="'required'"
        v-autosize="model.text"
        name="text"
        rows="4"
        placeholder="Стих"
        data-vv-as="Стих"
        @input="onInput"
      )
      AppTextError {{ errors.first('text') }}
</template>

<script>

import AppInput from '~/components/AppInput'
import AppTextarea from '~/components/AppTextarea'
import AppTextError from '~/components/AppTextError'
import HasModelMixin from '~/components/HasModelMixin'
import HasPostDataMixin from '~/components/HasPostDataMixin'

export default {
  components: {
    AppInput,
    AppTextarea,
    AppTextError
  },

  mixins: [ HasModelMixin, HasPostDataMixin ],

  data () {
    return {
      model: {
        name: '',
        text: ''
      }
    }
  }
}
</script>

<style lang="sass">
.page-post-item-poem
  font-family: $font-family-times
  &__name
    font-size: ($font-size-base * 1.3)
    line-height: 1.2
    font-weight: bold
  &__text
    font-style: italic
    white-space: pre-wrap
</style>
