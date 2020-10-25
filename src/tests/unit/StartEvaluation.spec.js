import {mount, createLocalVue} from '@vue/test-utils'
import Framework from '@/components/Framework/Framework.vue'
import {BootstrapVue} from "bootstrap-vue";

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)
const $route = {
  path: '/profile/',
  params: {},
}

describe('Framework.vue', () => {
  let wrapper;
  beforeEach(()=>{
    wrapper = mount(Framework,['wrapperMount',{
      localVue,
      mocks: {
        // adds mocked `$route` object to the Vue instance
        // before mounting component
        $route
      },
      data(){
        return{
            windowVisible:false,
            newEva:{
              name:'',
              framework:[{
                  section:"section/GaSEWZ5U2CYYRfS9Vwv1",
                  author:"author",
                  authorUid:'testing',
                  editor:"Admin",
                  editorUid:"testing",
                  id:'1235678123',
                  isActive:true,
                  name:'testing framework',
              }],
            },
            state: 'loading',
            firebaseData:null,
            frameworks:[],
            errorMessage:"",
            show:"",
            isActive:"",
            dismissSecs: 1.5,
            dismissCountDown: 0,
            showPreview:false,
            frameworkPreview:{},
            isMobile:false
          }
      }
    }])
  })

  it("Mobile layout",async ()=>{
    wrapper.setData({isMobile: true})
    expect(wrapper.find('mobileLayout').hidden).toBe(false)
    expect(wrapper.find('desktopLayout').hidden).toBe(true)
  })

  it("Desktop layout",async ()=>{
    wrapper.setData({isMobile: false})
    expect(wrapper.find('mobileLayout').hidden).toBe(true)
    expect(wrapper.find('desktopLayout').hidden).toBe(false)
  })

  it("New Evaluation Window", async()=>{
    await wrapper.find('newEvaBtnSnr').trigger('click')
    expect(wrapper.data.windowVisible).toBe(true)
    expect(wrapper.data.newEva.framework).toBe("test")
  })

})