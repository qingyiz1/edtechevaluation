import { shallowMount } from '@vue/test-utils'
import Login from '@/components/Login.vue'
import {BootstrapVue} from "bootstrap-vue";

let wrapper = null
localVue.use(BootstrapVue)

beforeEach(() =>
    (wrapper = shallowMount(Login, {
        data() {
            return{
                email:'testing',
                password:'testing',
            }
        }
    })))

afterEach(() => wrapper.destroy())

describe('Login', () => {

    it('Renders login input texts', () => {
        expect(wrapper.find('.h3 mb-3 font-weight-normal').text = 'Please Log in')
        expect(wrapper.find('.btn btn-lg btn-primary btn-block'.text = 'Log in'))
        expect(wrapper.find('.btn btn-lg btn-success btn-block').text = 'Sign up')
    })

    it('Triggers login event', () => {
        const loginMock = jest.fn(() => Promise.resolve());
        const store = new BootstrapVue.store({
            actions: {
                // mock
                login: loginMock
            }
        });
        const wrapper2 = shallowMount(Login, {localVue, store})
        wrapper2.find('.btn btn-lg btn-primary btn-block').trigger('click');
        expect(loginMock).toHaveBeenCalled();
    })

})