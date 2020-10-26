import {mount, createLocalVue} from '@vue/test-utils'
import report_view_online from '@/components/Report/report_view_online'
import {BootstrapVue} from "bootstrap-vue";

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)
const $route = {
  path: '/report_view_online/',
  params: { evaId: '9O5ZAH9CwxCw3mx45S8x' },
}

describe('report_view_online.vue', () => {
  let wrapper;
  beforeEach(()=>{
    wrapper = mount(report_view_online,{
      localVue,
      mocks: {
        // adds mocked `$route` object to the Vue instance
        // before mounting component
        $route
      },
      data(){
        return{
          summary:"testing summary"
        }
      }
    })
  })

  it("Report Logo should appear",async ()=>{
    expect(wrapper.find('.img-fluid').exists()).toBe(true)
  })


  // it("Table items should match up with right contents", async()=>{
  //   expect(wrapper.find('data-v-541fe4dd').exists()).toBe(true)
  // })

  // it("Back button work correctly",async ()=>{
  //   expect(wrapper.find('data-v-541fe4dd').exists()).toBe(true)
  // })
})
