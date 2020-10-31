import {mount, createLocalVue} from '@vue/test-utils'
import Userlist from '@/components/UserManagement/UserList.vue'
import {BootstrapVue} from "bootstrap-vue";
import * as deleteDocument from "@/tools/firebaseTool"

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

  it("Delete after confirm",async ()=>{
    const spy = jest.spyOn(deleteDocument, 'deleteDocument')
    await wrapper.find('#deleteCfmBtn').trigger('click')
    expect(spy).toHaveBeenCalled()
  })

  it("Show delete confirmation correctly", async()=>{
    await wrapper.find('deleteBtn').trigger('click')
    expect(wrapper.find('.confirmButtonText')).toEqual('Yes')
    expect(wrapper.find('.cancelButtonText')).toEqual('No')
  })

})