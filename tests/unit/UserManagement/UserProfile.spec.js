import {mount, createLocalVue} from '@vue/test-utils'
import Profile from '@/components/User/Profile.vue'
import {BootstrapVue} from "bootstrap-vue";
import * as updateDocument from "@/tools/firebaseTool"

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)
const $route = {
  path: '/profile/',
  params: {},
}


describe('Profile.vue', () => {
  let wrapper;
  beforeEach(()=>{
    wrapper = mount(Profile,{
      localVue,
      mocks: {
        // adds mocked `$route` object to the Vue instance
        // before mounting component
        $route
      },
      data(){
        return{
            userData:{
                email:'testem',
                role:'testr',
                nickname:'testn',
                employer:'testemp',
                phoneNumber:'test',
            },
            editable:false,
        }
      }
    })
  })

  it("Display User information",async ()=>{
    expect(wrapper.find('.dataEmail').text()).toBe('testem')
    expect(wrapper.find('.dataRole').text()).toBe('testr')
    expect(wrapper.find('.dataNickname').text()).toBe('testn')
    expect(wrapper.find('.dataEmployer').text()).toBe('testemp')
    expect(wrapper.find('.dataPhone').text()).toBe('test')
  })

  it("Profile editable",async ()=>{
    await wrapper.find('#editBtn').trigger('click')
    expect(wrapper.data.editable).toBe(true)
  })

  it("Update document", async()=>{
    const spy3 = jest.spyOn(updateDocument,'updateDocument')
    await wrapper.find('saveBtn').trigger('click')
    expect(spy3).toHaveBeenCalled()
  })

})