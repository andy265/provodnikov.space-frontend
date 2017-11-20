<template lang="pug">
  div.the-404
    AppTitle(
      tag="h2"
      theme="404"
    ) 404
    AppLink(to="/") На главную
</template>

<script>
import AppLink from '~/components/AppLink'
import AppTitle from '~/components/AppTitle'

export default {
  components: {
    AppLink,
    AppTitle
  }
}
</script>

<style lang="sass">
.the-404
  display: flex
  flex-direction: column
  align-items: center
</style>
