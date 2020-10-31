import {mount, createLocalVue} from '@vue/test-utils'
import Reports from '@/components/Report/Reports'
import {BootstrapVue} from "bootstrap-vue";

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)
const $route = {
  path: '/reports',
}

describe('Reports.vue', () => {
  let wrapper;
  beforeEach(()=>{
    wrapper = mount(Reports,{
      localVue,
      computed:{
        ownReports(){
          return []
        }
      },
      mocks: {
        // adds mocked `$route` object to the Vue instance
        // before mounting component
        $route
      },
      data(){
        return{
            reportList:[]
        }
      }
    })
  })

  it("Report List should exit then hide",async ()=>{
    expect(wrapper.find('.b-overlay').exists()).toBe(true)
    await wrapper.setData({show: false})
    expect(wrapper.find('.b-overlay').exists()).toBe(false)
    
  })

})
