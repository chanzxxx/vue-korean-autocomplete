import Vue from 'vue'
import KoreanAutocomplete from '../../../src/components/KoreanAutocomplete'

Vue.config.productionTip = false

function repeat(func, times) {
  for(let i=0; i<times; i++) {
    func(i)
  }
}

describe('KoreanAutocomplete.vue', () => {
  let vm
  let config = {
    template: '<korean-autocomplete @load="loadData" ref="krAutocomplete"></korean-autocomplete>',
    data: {
      sampleData: [
        '테스트',
        '가방',
        '아버지가방에들어가신다',
        '자바스크립트',
        'English Test',
        'javascript',
        '자바스크립트javascript'
      ]
    },
    methods: {
      loadData({setter}) {
        setter(this.sampleData)
      }
    },
    components: {
      KoreanAutocomplete
    }
  }

  beforeEach(() => {
    const container = document.createElement('div')

    container.id = 'app'
    document.body.appendChild(container)
  })

  afterEach(() => {
    vm.$el.parentNode.removeChild(vm.$el);

    if (vm.$refs.krAutocomplete) {
      vm.$refs.krAutocomplete.$destroy();
    }

    if (document.getElementById('app')) {
      document.getElementById('app').remove();
    }
  });

  it('debounce works correctly', (done) => {
    vm = new Vue(Object.assign({}, config, {
      mounted () {
        const spyFn = sinon.spy(this.$refs.krAutocomplete, 'search')
        const debounceTime = this.$refs.krAutocomplete.debounceTime
        const inputElement = this.$el.querySelector('input')


        repeat((time) => {
          inputElement.value = `테스트${time}`
          inputElement.dispatchEvent(new Event('input'))
        }, 10)

        setTimeout(() => {
          expect(spyFn).to.have.been.callCount(1)
          done()
        }, debounceTime + 10)
      }
    }));

    vm.$mount('#app')
  })

  it('find matches correctly', (done) => {
    vm = new Vue(Object.assign({}, config, {
      mounted () {
        const testCases = [
          {
            input: '가바',
            expectedMatches: 2
          },
          {
            input: 'javascript',
            expectedMatches: 2
          },
          {
            input: '트',
            expectedMatches: 3
          }
        ]

        repeat((time) => {
          expect(this.$refs.krAutocomplete.findMatches(testCases[time].input)).to.have.lengthOf(testCases[time].expectedMatches)
        }, testCases.length)

        done()
      }
    }))

    vm.$mount('#app')
  })
})
