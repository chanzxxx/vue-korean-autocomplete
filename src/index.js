import KoreanAutoComplete from './components/KoreanAutocomplete.vue'

export default KoreanAutoComplete

if (window !== undefined && window.Vue) {
  window.Vue.component('korean-autocomplete', KoreanAutoComplete)
}
