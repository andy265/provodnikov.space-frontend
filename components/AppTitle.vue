<script>
import _ from 'lodash'
import AppLink from '~/components/AppLink'

export default {
  props: {
    tag: {
      validator: value => ['h1', 'h2', 'h3', 'span'].includes(value)
    },

    to: {
      type: String,
      default: ''
    },

    theme: {
      type: String,
      required: true,
      validator: value => ['text', 'sub', 'normal', 'main', '404'].includes(value)
    }
  },

  render: function (createElement) {
    let linkClass = _.get(
      {
        text: [],
        sub: ['app-link_color_primary', 'app-link_border-width_3'],
        normal: ['app-link_color_primary', 'app-link_border-width_3'],
        main: ['app-link_border-width_6'],
        404: ['app-link_color_primary']
      },
      this.theme,
      []
    )
    let titleClass = [
      'app-title',
      `app-title_theme_${this.theme}`
    ]
    let elementLink = createElement(AppLink, { props: { to: this.to }, class: linkClass }, this.$slots.default)
    let elementTag = createElement(this.tag, { class: 'app-title__tag' }, (_.isEmpty(this.to) ? this.$slots.default : [elementLink]))
    return createElement('div', { class: titleClass }, [elementTag])
  }
}
</script>

<style lang="sass">
.app-title
  &__tag
    margin: 0
  &_center
    text-align: center
  &_theme_text
    .app-title__tag
      font-family: $font-family-serif
      font-weight: normal
      font-size: $font-size-base
      line-height: 1.2
  &_theme_sub
    .app-title__tag
      font-family: $font-family-serif
      font-weight: normal
      font-size: $font-size-lg
      line-height: 1.2
  &_theme_normal
    .app-title__tag
      font-family: $font-family-serif
      font-weight: normal
      font-size: ($font-size-lg * 1.2)
      line-height: 1.2
  &_theme_main
    .app-title__tag
      font-family: $font-family-raleway
      font-weight: bold
      font-size: ($font-size-lg * 1.7)
      line-height: 1.2
      @include mobile
        font-size: ($font-size-lg * 1.25)
  &_theme_404
    .app-title__tag
      font-family: $font-family-serif
      font-weight: normal
      font-size: 16vw
      line-height: 1.5
</style>
