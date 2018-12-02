import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';

import { Signup } from './Signup';

if (Meteor.isClient) {
    describe('Signup', () => {
        it('should show error messages', () => {
            const error = 'This is not working';
            const wrapper = mount(<Signup createUser={() => {}}/>)
            wrapper.setState({ error });
            expect(wrapper.find('p').text()).toBe(error);
            wrapper.setState({ error: '' });
            expect(wrapper.find('p').length).toBe(0);
        });

        it('show call createUser with the form data', () => {
            const email = 'test@example.com';
            const password = 'password123';
            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy}/>);
            wrapper.ref('email').node.value = email;
            wrapper.ref('password').node.value = password;
            wrapper.find('form').simulate('submit');
            expect(spy.calls[0].arguments[0]).toEqual({ email, password });
        });

        it('show set error if short password', () => {
            const email = 'test@example.com';
            const password = '123              ';
            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy}/>);
            wrapper.ref('email').node.value = email;
            wrapper.ref('password').node.value = password;
            wrapper.find('form').simulate('submit');
            expect(wrapper.state('error')).toNotBe('');
        });
        

        it('should set createUser callback errors', () => {
            const reason = 'This is why it failed';
            const password = "password123!";
            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy}/>);
            wrapper.ref('password').node.value = password;
            wrapper.find('form').simulate('submit');
            spy.calls[0].arguments[1]({ reason });
            expect(wrapper.state('error')).toBe(reason);
            spy.calls[0].arguments[1]();
            expect(wrapper.state('error')).toBe('');
        });
    });
}