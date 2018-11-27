import expect from 'expect';

import { validateNewUser } from './users';

describe('users', function() {
    it('should allow valid email address', function() {
        const testUser = {
            emails: [
                {
                    address: 'Test@example.com'
                }
            ]
        };
        const result = validateNewUser(testUser);
        expect(result).toBe(true);
    });
});