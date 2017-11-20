<script>
import _ from 'lodash'

export default {
  data () {
    return {
      vocabulary: { 'ё': 'yo', 'й': 'i', 'ц': 'ts', 'у': 'u', 'к': 'k', 'е': 'e', 'н': 'n', 'г': 'g', 'ш': 'sh', 'щ': 'sch', 'з': 'z', 'х': 'h', 'ъ': '', 'ф': 'f', 'ы': 'i', 'в': 'v', 'а': 'a', 'п': 'p', 'р': 'r', 'о': 'o', 'л': 'l', 'д': 'd', 'ж': 'zh', 'э': 'e', 'я': 'ya', 'ч': 'ch', 'с': 's', 'м': 'm', 'и': 'i', 'т': 't', 'ь': '', 'б': 'b', 'ю': 'yu' }
    }
  },

  created () {
    this.$validator.extend('has-path-id-mixin__path-id', {
      getMessage: field => `Поле ${field} содержит недопустимые символы.`,
      validate: value => value === this.toPathId(value)
    })
  },

  methods: {
    toPathId (text) {
      let id = text

      id = id.toLowerCase()

      id = id.split('').map(char => { // rus to eng
        return !_.isUndefined(this.vocabulary[char]) ? this.vocabulary[char] : char
      }).join('')

      id = id.replace(/[^a-z0-9]/g, '_') // non-alphabetic and non-numeric characters to _

      id = id.split('').filter((x, n, s) => { return n === 0 || x !== '_' || s[n - 1] !== x }).join('') // remove duplicates of _

      if (id.length) { // remove _ at start end end
        if (id[0] === '_') {
          id = id.substring(1)
        }

        if (id[id.length - 1] === '_') {
          id = id.slice(0, -1)
        }
      }

      return id
    }
  }
}
</script>
