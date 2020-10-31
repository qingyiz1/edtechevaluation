import {mount, createLocalVue} from '@vue/test-utils'
import CreateUser from '@/components/UserManagement/CreateUser.vue'
import {BootstrapVue} from "bootstrap-vue";
import * as createDocument from "@/tools/firebaseTool"

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)
const $route = {
  path: '/createuser/',
  params: {},
}

describe('CreateUser.vue', () => {
  let wrapper;
  beforeEach(()=>{
    wrapper = mount(CreateUser,['wrapperMount',{
      localVue,
      mocks: {
        // adds mocked `$route` object to the Vue instance
        // before mounting component
        $route
      },
      data(){
        return{
          sendWindowVisible: false,
          inviteUser:{
            email:"",
          },
          userInfo:{
            email:'abcd@email.com',
            password:'bbydsuiaoldsa',
            role: 'Consultant',
            nickname:'Andtest',
            isActive: true,
            employer:'UniWhatever',
            phoneNumber:'0123456789'
          },
        }
      }
    }])
  })

  it("Render input rows correctly",async ()=>{
    expect(wrapper.find('inputEmail').text()).toEqual('Email address')
    expect(wrapper.find('inputPassword').text()).toEqual('Password')
    expect(wrapper.find('inputNickname').text()).toEqual('Nickname')
    expect(wrapper.find('inputEmployer').text()).toEqual('Employer')
    expect(wrapper.find('inputPhoneNumber').text()).toEqual('Phone Number')
  })

  it("Open send invitation code window",async ()=>{
    expect(wrapper.find("[data-sendWindowVisible]")).toBe(false)
    await wrapper.find('#sendInviteBtn').trigger('click')
    expect(wrapper.find("[data-sendWindowVisible]")).toBe(true)
  })

  it("Send email after click comfirm", async()=>{
    await wrapper.find('confirmBtn').trigger('click')
    expect(wrapper.find('[data-sendWindowVisible]')).toBe(false)
    expect(wrapper.find('[data-inviteUser.email]')).toBe("")
  })

  it("Create user",async ()=>{
    const spy = jest.spyOn(createDocument,'createDocument')
    await wrapper.find('#confirmUpdateBtn').trigger("click");
    expect(spy).toHaveBeenCalled()
  })
})