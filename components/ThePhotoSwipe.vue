<template lang="pug">
  div.pswp(
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  )
    div.pswp__bg
    div.pswp__scroll-wrap
      div.pswp__container
        div.pswp__item
        div.pswp__item
        div.pswp__item
      div.pswp__ui.pswp__ui--hidden
        div.pswp__top-bar
          div.pswp__counter
          button.pswp__button.pswp__button--close(title="Close (Esc)")
          button.pswp__button.pswp__button--fs(title="Toggle fullscreen")
          button.pswp__button.pswp__button--zoom(title="Zoom in/out")
          div.pswp__preloader
            div.pswp__preloader__icn
              div.pswp__preloader__cut
                div.pswp__preloader__donut
        div.pswp__share-modal.pswp__share-modal--hidden.pswp__single-tap
          div.pswp__share-tooltip
        button.pswp__button.pswp__button--arrow--left(title="Previous (arrow left)")
        button.pswp__button.pswp__button--arrow--right(title="Next (arrow right)")
        div.pswp__caption
          div.pswp__caption__center
</template>

<script>
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default.js'

export default {
  mounted () {
    this.$bus.$on('image-zoom', this.onImageZoom)
  },

  beforeDestroy () {
    this.$bus.$off('image-zoom')
  },

  methods: {
    onImageZoom ({ gid, pid, target, h, msrc, src, w }) {
      let items = [{ h, msrc, src, w, pid }]
      let options = {
        maxSpreadZoom: 1,
        galleryUID: gid,
        galleryPIDs: true,
        getThumbBoundsFn: () => {
          let rect = target.getBoundingClientRect()
          return {
            x: rect.left,
            y: rect.top + window.scrollY,
            w: rect.width
          }
        }
      }
      let gallery = new PhotoSwipe(this.$el, PhotoSwipeUIDefault, items, options)
      gallery.init()
    }
  }
}
</script>
