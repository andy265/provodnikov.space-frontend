<template lang="pug">
  div.page-post-item-iframe
    AppIframe(
      :src="`https://www.youtube.com/embed/${model.id}?rel=0&amp;showinfo=0`"
      :width="width"
      :height="height"
    )
    template(v-if="state !== 'index'")
      AppTextError
      AppInput(
        v-model="model.id"
        v-validate="'required'"
        name="id"
        placeholder="Id youtube видео"
        data-vv-as="Id youtube видео"
        @input="onInput"
      )
      AppTextError {{ errors.first('id') }}
      div.page-post-item-iframe__row
        AppInput.page-post-item-iframe__row-item(
          v-model.number="model.width"
          v-validate="'required|numeric'"
          name="width"
          placeholder="Ширина"
          data-vv-as="Ширина"
          @input="onInput"
        )
        AppInput.page-post-item-iframe__row-item(
          v-model.number="model.height"
          v-validate="'required|numeric'"
          name="height"
          placeholder="Высота"
          data-vv-as="Высота"
          @input="onInput"
        )
      div.page-post-item-iframe__row
        AppTextError.page-post-item-iframe__row-item {{ errors.first('width') }}
        AppTextError.page-post-item-iframe__row-item {{ errors.first('height') }}
</template>

<script>
import AppIframe from '~/components/AppIframe'
import AppInput from '~/components/AppInput'
import AppTextError from '~/components/AppTextError'
import HasModelMixin from '~/components/HasModelMixin'
import HasPostDataMixin from '~/components/HasPostDataMixin'

import _ from 'lodash'

export default {
  components: {
    AppIframe,
    AppInput,
    AppTextError
  },

  mixins: [ HasModelMixin, HasPostDataMixin ],

  data () {
    return {
      model: {
        id: '',
        width: '',
        height: ''
      }
    }
  },

  computed: {
    width () {
      return _.toNumber(this.model.width)
    },

    height () {
      return _.toNumber(this.model.height)
    }
  }
}
</script>

<style lang="sass">
.page-post-item-iframe
  &__row
    display: flex
    flex-direction: row
  &__row-item:first-child
    margin-right: 1em
</style>
