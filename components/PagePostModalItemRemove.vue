<template lang="pug">
  AppModal.page-post-modal-item-remove(
    name="page-post-modal-item-remove"
    @before-open="onBeforeOpen"
  )
    template(slot="content")
      p Удалить?
    template(slot="buttons")
      AppButton(@click="onCloseClick") нет
      AppButton(@click="onRemoveClick") да
</template>

<script>
import AppButton from '~/components/AppButton'
import AppModal from '~/components/AppModal'

export default {
  components: {
    AppButton,
    AppModal
  },

  data () {
    return {
      itemIndex: -1
    }
  },

  methods: {
    onBeforeOpen ({ index }) {
      this.itemIndex = index
    },

    onCloseClick () {
      this.$modal.hide('page-post-modal-item-remove')
    },

    onRemoveClick () {
      this.$emit('remove', this.itemIndex)
      this.$modal.hide('page-post-modal-item-remove')
    }
  }
}
</script>
