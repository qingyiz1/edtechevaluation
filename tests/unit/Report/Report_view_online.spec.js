import { mount, createLocalVue } from '@vue/test-utils'
import report_view_online from '@/components/Report/report_view_online'
import { BootstrapVue } from "bootstrap-vue";

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)
const $route = {
  path: '/report_view_online/',
  params: { evaId: 's4zSIK0Q3XqFpMGxp1EU' },
}

describe('report_view_online.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(report_view_online, {
      localVue,
      mocks: {
        $route
      },
      data() {
        return {
          summary: "testing summary",
          recommendation: "this is a testing recommendation",
          expectedData: ["There is no evidence of the content model used",
            "States the main topics of the domain area coverd. Lacks detail",
            "Shows links to existing curricula",
            "Detailed statement of topics"]
        }
      }
    })
  })

  it("Report Logo should appear", async () => {
    expect(wrapper.find('.img-fluid').exists()).toBe(true)
  })


  it("Table items should match up with right contents", async()=>{
    expect(wrapper.find('table:nth-child(1)[aria-colindex]="2"').text()).toEqual(expectedData[0]);
    expect(wrapper.find('table:nth-child(1)[aria-colindex]="3"').text()).toEqual(expectedData[1]);
    expect(wrapper.find('table:nth-child(1)[aria-colindex]="4"').text()).toEqual(expectedData[2]);
    expect(wrapper.find('table:nth-child(1)[aria-colindex]="5"').text()).toEqual(expectedData[3]);
  })

  it("Back button work correctly",async ()=>{
    expect(wrapper.find('').exists()).toBe(true)
  })
})
