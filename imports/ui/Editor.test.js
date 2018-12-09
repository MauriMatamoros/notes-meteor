import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';

import { Editor } from './Editor';
import { notes } from '../fixtures/fixtures';

if (Meteor.isClient) {
    describe('Editor', () => {
        let browserHistory;
        let call;
        
        beforeEach(() => {
            call = expect.createSpy();
            browserHistory = {
                push: expect.createSpy()
            };
        });

        it('should render pick note message', () => {
            const wrapper = mount(<Editor browserHistory={browserHistory} call={call}/>);
            expect(wrapper.find('p').text()).toBe('Pick or create a note to get started.');
        });

        it('should render not found message', () => {
            const wrapper = mount(<Editor selectedNoteId={notes[0]._id} browserHistory={browserHistory} call={call}/>);
            expect(wrapper.find('p').text()).toBe('Note not found.');
        });

        it('should remove note', () => {
            const wrapper = mount(<Editor note={notes[0]} selectedNoteId={notes[0]._id} browserHistory={browserHistory} call={call}/>);
            wrapper.find('button').simulate('click');
            expect(browserHistory.push).toHaveBeenCalledWith('/dashboard');
            expect(call).toHaveBeenCalledWith('notes.remove', notes[0]._id);
        });

        it('should update the note body on textarea change', () => {
            const value = 'This is the body';
            const wrapper = mount(<Editor note={notes[0]} selectedNoteId={notes[0]._id} browserHistory={browserHistory} call={call}/>);
            wrapper.find('textarea').simulate('change', {
                target: {
                    value
                }
            });
            expect(wrapper.state('body')).toBe(value);
            expect(call).toHaveBeenCalledWith('notes.update', notes[0]._id, { body: value });
        });

        it('should update the note title on input change', () => {
            const value = 'This is the title';
            const wrapper = mount(<Editor note={notes[0]} selectedNoteId={notes[0]._id} browserHistory={browserHistory} call={call}/>);
            wrapper.find('input').simulate('change', {
                target: {
                    value
                }
            });
            expect(wrapper.state('title')).toBe(value);
            expect(call).toHaveBeenCalledWith('notes.update', notes[0]._id, { title: value });
        });

        it('should set state for new note', () => {
            const wrapper = mount(<Editor  browserHistory={browserHistory} call={call}/>);
            wrapper.setProps({
                selectedNoteId: notes[0]._id,
                note: notes[0]
            });
            expect(wrapper.state('title')).toBe(notes[0].title);
            expect(wrapper.state('body')).toBe(notes[0].body);
        });

        it('should not set state for new note', () => {
            const wrapper = mount(<Editor  browserHistory={browserHistory} call={call}/>);
            wrapper.setProps({
                selectedNoteId: notes[0]._id,
            });
            expect(wrapper.state('title')).toBe('');
            expect(wrapper.state('body')).toBe('');
        });
    });
}