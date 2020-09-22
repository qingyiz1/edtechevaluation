import { mount, createLocalVue} from '@vue/test-utils'
import DisplayEva from '@/components/Evaluation/DisplayEva'
import {BootstrapVue} from "bootstrap-vue";

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)
const $route = {
  path: '/DisplayEva/',
  params: { evaId: 'Rrb0nLzUMH6qR9ukmbr6' },
}

describe('DisplayEva.vue', () => {
  let wrapper;
  beforeEach(()=>{
    wrapper = mount(DisplayEva,{
      localVue,
      mocks: {
        // adds mocked `$route` object to the Vue instance
        // before mounting component
        $route
      }
    })
  })

  it("renders",()=>{
    expect(wrapper.exists()).toBe(true);
  })
})
