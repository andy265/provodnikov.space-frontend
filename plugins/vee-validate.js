import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import ru from 'vee-validate/dist/locale/ru'

Validator.addLocale(ru)

Vue.use(VeeValidate, {
  locale: 'ru'
})
