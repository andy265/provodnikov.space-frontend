<template lang="pug">
  footer.the-footer
    p
      AppLink(to="/") На главную
      |
      | |
      |
      AppLink(to="/list") Список постов
      br
      | © 2017
      |
      AppLink(to="/") Андрей Проводников
      |
      | andrey@provodnikov.space
</template>

<script>
import AppLink from '~/components/AppLink'

export default {
  components: {
    AppLink
  }
}
</script>

<style lang="sass">
.the-footer
  font-family: $font-family-georgia
  background: $bg-secondary
  text-align: center
  padding: 0 $page-margin-x
</style>
