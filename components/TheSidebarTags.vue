<template lang="pug">
  div.the-sidebar-tags
    AppTags.app-tags_direction_column(:tags="$store.state.tags.list")
</template>

<script>
import AppTags from '~/components/AppTags'

export default {
  components: {
    AppTags
  }
}
</script>

<style lang="sass">
.the-sidebar-tags
  display: flex
  flex-direction: column
  align-items: center
</style>
