import { createCalendarEvent } from "../src/services/calendar/calendarService.js";
import { assert, expect } from 'chai';

const nlpResponse = require('../src/fakeData/mockNlpResponse.js');

// Create fake OCR result
const ocrRes = {
    locations: "en",
    description: "Dearest Peter  O'Toole, your dentist appointment is on Saturday afternoon 15:30-16-30",
    locale: "en",
    confidence: 0.5
};

// Prepare fake NLP response from the fakeData folder
let nlpObject = nlpResponse.default.entities;

describe('calendarService', function() {
    
    describe('Undefined arguments', function() {
        it('should throw TypeError for undefined nlpResponse', function() {
            expect(createCalendarEvent).to.throw(TypeError);
        });
    });
    
    describe('Complete summary', function(){
        it('optimal description should consist of: event, organization, person', function(){
            
            assert.equal(createCalendarEvent(nlpObject, ocrRes).description, "Dentist appointment, Peter O'Toole, T.E. Lawrence");
        });
    });

    describe('No location', function(){
        it('no location in the NLP object should result in default location: UNSPECIFIED', function(){
            let noLocation = [nlpObject[0], nlpObject[1], nlpObject[3], nlpObject[4]];
            assert.equal(createCalendarEvent(noLocation, ocrRes).location, "UNSPECIFIED");
        });
    });
    
    describe('No event', function(){
        it('no event in the NLP object should result is default description: EVENT CREATION RESULT', function(){
            let noEvent = [nlpObject[0], nlpObject[1], nlpObject[2], nlpObject[4]];
            assert.equal(createCalendarEvent(noEvent, ocrRes).description, "EVENT CREATION RESULT");
        });
    });

    describe('No Person', function(){
        it('no person in the NLP object should result in description: event, organization', function(){
            let noPerson = [nlpObject[0], nlpObject[2], nlpObject[3], nlpObject[4]];
            assert.equal(createCalendarEvent(noPerson, ocrRes).description, "Dentist appointment, Peter O'Toole");
        });
    });

    describe('No organization', function(){
        it('no organization in the NLP object should result in description: event, person', function(){
            let noOrganization = [nlpObject[0], nlpObject[1], nlpObject[2], nlpObject[3]];
            assert.equal(createCalendarEvent(noOrganization, ocrRes).description, "Dentist appointment, T.E. Lawrence");
        });
    });

});
