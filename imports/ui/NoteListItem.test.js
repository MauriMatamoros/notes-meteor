import React from 'react';
import { Meteor } from 'meteor/meteor';
import expect from 'expect';
import { mount } from 'enzyme';

import NoteListItem from './NoteListItem';

if (Meteor.isClient) {
    describe('NoteListItem', () => {
        it('should render title and timestamp', () => {
            const title = 'My title here';
            const updatedAt = 1543712176547;
            const wrapper = mount(<NoteListItem note={{title, updatedAt}}/>);
            expect(wrapper.find('h5').text()).toBe(title);
            expect(wrapper.find('p').text()).toBe('18/12/01');
        });

        it('should set default title if no title set', () => {
            const title = '';
            const updatedAt = 1543712176547;
            const wrapper = mount(<NoteListItem note={{ title, updatedAt}}/>);
            expect(wrapper.find('h5').text()).toBe('Untitled note');
        });
    });
}