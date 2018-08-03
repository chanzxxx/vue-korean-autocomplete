<template>
  <div class="kr-auto-complete">
    <input type="text"
           :value="input"
           :class="inputClass"
           @input="onInput"
           @keydown.up.prevent="cursorUp"
           @keydown.down.prevent="cursorDown"
           @keydown.enter="cursorSelect"
           @blur="blur"
           @focus="focus"
           :autofocus="autoFocus">
    <div class="matches-box" v-if="matches">
      <template v-if="matches.length === 0">
        <slot name="no-matches">
          Could not find any matches
        </slot>
      </template>
      <template v-else>
        <ul :class="ulClass">
          <li v-for="(match, idx) in matches" :key="idx" :class="[liClass, cursorOffset === idx ? activeClass : '']">{{match}}</li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
const hangul = require('hangul-js')

export default {
  name: 'vue-korean-autocomplete',
  data () {
    return {
      input: null,
      data: null,
      debounceTimer: null,
      matches: null,
      cursorOffset: null,
      lastInputValue: null
    }
  },
  props: {
    debounceTime: {
      type: Number,
      default: 50
    },
    inputClass: {
      type: String,
      required: false,
      default: ''
    },
    ulClass: {
      type: String,
      required: false,
      default: ''
    },
    liClass: {
      type: String,
      required: false,
      default: ''
    },
    activeClass: {
      type: String,
      required: false,
      default: 'cursor'
    },
    autoFocus: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  beforeMount () {
    this.$emit('load', {
      setter: data => {
        if (!(data instanceof Array)) {
          console.error('@load 이벤트의 setter 넘기는 인자는 array of string 이어야 합니다.')
          return
        }
        this.data = data.map(word => {
          return {
            original: word,
            disassembled: hangul.disassemble(word).join('').toLowerCase()
          }
        })
      }
    })
  },
  methods: {
    onInput (e) {
      if (e.target.value === this.lastInputValue) {
        return
      }

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }

      this.input = e.target.value

      this.debounceTimer = setTimeout(() => {
        this.search(this.input)
        this.debounceTimer = null
        this.lastInputValue = e.target.value
      }, this.debounceTime)
    },

    search (input) {
      if (input === null || input.length === 0) {
        this.matches = []
        return
      }
      this.matches = this.findMatches(input)

      this.initCursor()
    },

    findMatches (input) {
      const disassembledInput = hangul.disassemble(input).join('').toLowerCase()
      let matches = []

      if (this.data === null) {
        console.warn('data is not set. make sure you implemented function for @load')
        return []
      }

      this.data.forEach(({original, disassembled}) => {
        if (disassembled.indexOf(disassembledInput) > -1) {
          matches.push(original)
        }
      })

      return matches
    },

    /**
     * Init cursor offset
     */
    initCursor () {
      this.cursorOffset = -1
    },

    /**
     * Handle arrow up
     * @param e
     */
    cursorUp (e) {
      e.preventDefault()
      if (this.cursorOffset > -1) {
        this.cursorOffset--
      }
    },

    /**
     * Handle arrow down
     * @param e
     */
    cursorDown (e) {
      e.preventDefault()
      if (this.cursorOffset < this.matches.length) {
        this.cursorOffset++
      }
    },

    /**
     * Handle enter
     */
    cursorSelect () {
      if (this.cursorOffset < 0) {
        return
      }

      this.input = this.matches[this.cursorOffset]

      this.initCursor()
      this.resetMatches()
    },

    resetMatches () {
      this.matches = null
    },

    blur (e) {
      this.$emit('blur', e)
    },

    focus (e) {
      this.$emit('focus', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .kr-auto-complete {
    .matches-box {
      ul {
        list-style-type: none;
        padding: 0;
        li.cursor {
          background-color: #ddd;
        }
      }
    }

    input {
      width: 100%;
    }
  }
</style>
