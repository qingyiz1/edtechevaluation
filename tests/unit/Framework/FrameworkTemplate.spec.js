import { mount, createLocalVue, shallowMount} from '@vue/test-utils'
import FrameworkTemplate from '@/components/Framework/FrameworkTemplate'
import {BootstrapVue} from "bootstrap-vue";

// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)
const $route = {
  path: '/framework/',
  params: {id:'7TWMJccr38yQLW50N854'},

}

describe('FrameworkTemplate.vue', () => {
  let wrapper;
  beforeEach(()=>{
    wrapper = mount(FrameworkTemplate,{
      localVue,
      mocks: {
        $route
      },
      data(){
        return{
            frameworkName:"Standard Framework",
            sections:[{
            name: "Functionality",
                question:[
                    {
                        questionName:"Content Model",
                        descriptions:[
                            {0:"Not Applicable"},
                            {1:"There is no evidence of the content model used"},
                            {2:"States the main topics of the domain area coverd. Lacks detail"},
                            {3:"Shows links to existing curricula"},
                            {4:"Detailed statement of topics"}],
                        id:0,
                        selected:0
                    }
                ]
            }],
            framework:{
                author:"Admin",
                editorUid:"35l4WwNPoyRxIimwDUDTBAAdtS93",
                id:"7TWMJccr38yQLW50N854",
                isActive:true,
                name:"Standard Framework",
                section:Array[2],
                version:1
            }
        }
      }
    })
  })

  it("overlay should show",()=>{
    expect(wrapper.find('.b-overlay').exists()).toBe(true)
  })
  it()




})

