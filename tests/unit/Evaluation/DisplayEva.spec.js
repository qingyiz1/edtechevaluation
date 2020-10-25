import {mount, createLocalVue} from '@vue/test-utils'
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
      },
      data(){
        return{
          summary:"testing summary",
          tabIndex:0,
          sections:[{id: "Sco87V5jRZFq1S9rdQ6C",
            name: "section1",
            question:[{answer: "", descriptions: ["0","1","2","3","4"],id: 0,questionName: "this is question 1",selected: 0,comment:"this is comment"},
              {answer: "", descriptions: ["5","6","7","8","9"],id: 0,questionName: "this is question 2",selected: 0},]},
            {id: "fpR30eYsxUKwdQKM9ifQ",
              name: "section2",
              question:[{answer: "", descriptions: ["10","11","12","13","14"],id: 0,questionName: "this is question 3",selected: 0},
                {answer: "", descriptions: ["15","16","17","18","19"],id: 0,questionName: "this is question 4",selected: 0},]},]
        }
      }
    })
  })

  it("should show overlay then hide",async ()=>{
    expect(wrapper.find('.b-overlay').exists()).toBe(true)
    await wrapper.setData({show: false})
    expect(wrapper.find('.b-overlay').exists()).toBe(false)
  })

  it("Show Summary content correctly",async ()=>{
    await wrapper.setData({countdown: 0,sections:[]})
    expect(wrapper.find("p").text()).toMatch("testing summary")
  })

  it("Show sections and questions correctly", async()=>{
    expect(wrapper.find('a').text()).toMatch("section1")
    expect(wrapper.find('div').text()).toMatch("this is question 2")
  })

  it("Previous and next button work correctly",async ()=>{
    await wrapper.find('#nextBtn').trigger("click");
    expect(wrapper.vm.$data.tabIndex).toBe(1)

    await wrapper.find('#previousBtn').trigger("click");
    expect(wrapper.vm.$data.tabIndex).toBe(0)
  })
})
