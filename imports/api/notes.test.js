import { Meteor } from 'meteor/meteor';
import expect from 'expect';

import { Notes } from './notes';

if (Meteor.isServer) {
    describe('notes', () => {
        const noteOne = {
            _id: 'testNoteId1',
            title: 'My Title',
            body: 'My body for note',
            updatedAt: 0,
            userId: 'testUserId1'
        };
        const noteTwo = {
            _id: 'testNoteId2',
            title: 'My Title 2',
            body: 'My body for note 2',
            updatedAt: 0,
            userId: 'testUserId2'
        };
        beforeEach(() => {
            Notes.remove({});
            Notes.insert(noteOne);
        });

        it('should insert new note', () => {
            const userId = 'testId';
            const _id = Meteor.server.method_handlers['notes.insert'].apply({
                userId
            });
            expect(Notes.findOne({ _id, userId })).toExist();
        });
        
        it('should not insert note if not authenticated', () => {
            expect(() => Meteor.server.method_handlers['notes.insert']()).toThrow();
        });

        it('should remove note', () => {
            Meteor.server.method_handlers['notes.remove'].apply({
                userId: noteOne.userId
            }, [noteOne._id]);
            expect(Notes.findOne({ _id: noteOne.userId })).toNotExist();
        });

        it('should not remove note if not authenticated', () => {
            expect(() => Meteor.server.method_handlers['notes.remove'].apply({}, [noteOne._id])).toThrow();
        });

        it('should not remove note if invalid id', () => {
            expect(() => { 
                Meteor.server.method_handlers['notes.remove'].apply({ userId: noteOne.userId }, [])
            }).toThrow();
        });

        it('should update note', () => {
            const title = 'This is an updated title';
            Meteor.server.method_handlers['notes.update'].apply({
                userId: noteOne.userId
            }, [
                noteOne._id, 
                { title }
            ]);
            const note = Notes.findOne(noteOne._id);
            expect(note.updatedAt).toBeGreaterThan(0);
            expect(note).toInclude({
                title,
                body: noteOne.body 
            });
        });

        it('should thow error if extra updates provided', () => {
            expect(() => {
                Meteor.server.method_handlers['notes.update'].apply({
                    userId: noteOne.userId
                }, [
                    noteOne._id, 
                    { title: 'new title', name: 'Mauricio' }
                ]);  
            }).toThrow();
        });

        it('should not update note if user was not creator', () => {
            const title = 'This is an updated title';
            Meteor.server.method_handlers['notes.update'].apply({
                userId: 'testId'
            }, [
                noteOne._id, 
                { title }
            ]);  
            const note = Notes.findOne(noteOne._id);
            expect(note).toInclude(noteOne);
        });

        it('should not update note if not authenticated', () => {
            expect(() => Meteor.server.method_handlers['notes.update'].apply({}, [noteOne._id])).toThrow();
        });

        it('should not update note if invalid id', () => {
            expect(() => { 
                Meteor.server.method_handlers['notes.update'].apply({ userId: noteOne.userId }, [])
            }).toThrow();
        });

        it('should return a user\'s notes', () => {
            const result = Meteor.server.publish_handlers.notes.apply({
                userId: noteOne.userId
            });
            const notes = result.fetch();
            expect(notes.length).toBe(1);
            expect(notes[0]).toEqual(noteOne);
        });

        it('should return 0 notes for user that has none', () => {
            const result = Meteor.server.publish_handlers.notes.apply({
                userId: 'testId'
            });
            const notes = result.fetch();
            expect(notes.length).toBe(0);
        });
    });
}