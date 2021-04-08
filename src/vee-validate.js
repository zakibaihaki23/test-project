import Vue from 'vue'
import { required, email, max } from 'vee-validate/dist/rules'
import { ValidationProvider, extend } from 'vee-validate'
import { regex } from 'vee-validate/dist/rules'

Vue.component('ValidationProvider', ValidationProvider)

extend('regex', regex)
extend('required', {
  ...required,
  message: 'This field is required',
})

extend('max', {
  ...max,
  message: 'This field must be {length} characters or less',
})

extend('email', {
  ...email,
  message: 'This field must be a valid email',
})
