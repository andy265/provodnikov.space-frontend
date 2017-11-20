<template lang="pug">
  header.the-header
    TheHeaderLogo.the-header__logo
    div.the-header__inner
      AppTitle.the-header__title(
        to="/"
        tag="h1"
        theme="main"
      ) Андрей Проводников / Блог
      div
        AppButton(@click="onSubscribeClick") подписаться
</template>

<script>
import AppButton from '~/components/AppButton'
import AppTitle from '~/components/AppTitle'
import TheHeaderLogo from '~/components/TheHeaderLogo'

export default {
  components: {
    AppButton,
    AppTitle,
    TheHeaderLogo
  },

  methods: {
    onSubscribeClick () {
      this.$router.push(`${this.$route.path}#subscribe`)
    }
  }
}
</script>

<style lang="sass">
.the-header
  display: flex
  flex-direction: row
  @include mobile
    flex-direction: column
  &__logo
    flex: 0 1 auto
    @include mobile
      display: none
  &__inner
    flex: 0 1 auto
    display: flex
    flex-direction: column
    justify-content: space-between
    margin: 0 $page-margin-x
    @include mobile
      margin: 0
  &__title
    margin: 2rem 0
</style>
