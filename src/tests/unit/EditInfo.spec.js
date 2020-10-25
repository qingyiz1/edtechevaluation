import {mount, createLocalVue} from '@vue/test-utils'
import Userlist from '@/components/UserManagement/UserList.vue'
import {BootstrapVue} from "bootstrap-vue";
import * as Document from "@/tools/firebaseTool"

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)
const $route = {
  path: '/userlist/',
  params: {},
}


describe('UserList.vue', () => {
  let wrapper;
  beforeEach(()=>{
    wrapper = mount(Userlist,{
      localVue,
      mocks: {
        // adds mocked `$route` object to the Vue instance
        // before mounting component
        $route
      },
      data(){
        return{
          editForm: {
              email:'test@gmailinvalid.com'
          },
          show: true,
        users:'',
        editDialogVisible: false,
        addDialogVisible: false,
        }
      }
    })
  })

  it("Should show overlay then hide",async ()=>{
    expect(wrapper.find('.b-overlay').exists()).toBe(true)
    await wrapper.setData({show: false})
    expect(wrapper.find('.b-overlay').exists()).toBe(false)
  })

  it("Show edit dialog correctly",async ()=>{
    const spy1 = jest.spyOn(Document,'getDocument')
    await wrapper.find('#showEditBtn').trigger('click')
    expect(spy1).toHaveBeenCalled()
    expect(wrapper.vm.$data.editDialogVisible).toBe(true)
  })

  it("Update profile after comfirm",async ()=>{
    const spy2 = jest.spyOn(Document,'updateDocument')
    await wrapper.find('#confirmUpdateBtn').trigger("click");
    expect(spy2).toHaveBeenCalled()
    expect(wrapper.vm.$data.editDialogVisible).toBe(false)
  })
})