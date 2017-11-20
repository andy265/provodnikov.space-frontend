<template lang="pug">
  div.app-list
    slot
</template>

<script></script>

<style lang="sass">
.app-list
  display: grid
  > *
    min-width: 0
    overflow-wrap: break-word
  &_narrow
    grid-gap: ($list-gap / 2)
  &_normal
    grid-gap: $list-gap
</style>
