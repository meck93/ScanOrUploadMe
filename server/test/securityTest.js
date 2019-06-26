import { encrypt, decrypt } from '../src/security/security.js';
import { assert, expect } from 'chai';

let text = 'Secret text';
/*
describe('security.js', function() {
    describe('Undefined input', function() {
        it('encrypt should throw TypeError for undefined input', function() {
            expect(() => {
                encrypt(undefined);
            }).to.throw(Error, "Undefined input");
        });
        it('decrypt should throw TypeError for undefined input', function() {
            expect(() => {
                decrypt(undefined);
            }).to.throw(Error, "Undefined input");
        });
    });

    describe('Encryption', function() {
        it('should encrypt input text', function() {
            let encrypted = encrypt(text);
            assert.notEqual(text, encrypted);
        });
    });

    describe('Decryption', function() {
        it('should correctly decrypt encrypted text', function() {
            let encrypted = encrypt(text);
            assert.equal(text, decrypt(encrypted));
        });
    });

});
*/
