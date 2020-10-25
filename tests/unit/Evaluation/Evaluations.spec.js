import {mount, createLocalVue} from '@vue/test-utils'
import Evaluations from '@/components/Evaluation/Evaluations'
import {BootstrapVue} from "bootstrap-vue";

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)
const $route = {
  path: '/evaluation' ,
}

describe('Evaluations.vue', () => {
  let wrapper;
  beforeEach(()=>{
    wrapper = mount(Evaluations,{
      localVue,
      mocks: {
        // adds mocked `$route` object to the Vue instance
        // before mounting component
        $route
      },
      data(){
        return{
          evaluationList:[]
        }
      }
    })
  })

  it("should show overlay then hide",async ()=>{
    expect(wrapper.find('.b-overlay').exists()).toBe(true)
    await wrapper.setData({show: false})
    expect(wrapper.find('.b-overlay').exists()).toBe(false)
  })

})
