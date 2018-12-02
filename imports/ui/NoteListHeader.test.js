import React from 'react';
import { Meteor } from 'meteor/meteor';
import { mount } from 'enzyme';
import expect from 'expect';

import { NoteListHeader } from './NoteListHeader';

if (Meteor.isClient) {
    describe('NoteListHeader', () => {
        it('should call meteorCall on click', () => {
            const spy = expect.createSpy();
            const wrapper = mount(<NoteListHeader meteorCall={spy} />);
            wrapper.find('button').simulate('click');
            expect(spy).toHaveBeenCalledWith('notes.insert');
        });
    });
}