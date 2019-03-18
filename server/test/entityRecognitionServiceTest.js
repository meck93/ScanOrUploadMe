const regeneratorRuntime = require("regenerator-runtime");
const entityRecognition = require('../src/services/nlp/entityRecognitionService');
const mockNlpResponse = require('../src/fakeData/mockNlpResponse');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const chai = require('chai');

const expect = chai.expect;
const assert = chai.assert;
chai.use(sinonChai);

const inputText = "'Lawrence of Arabia' is a highly rated film biography about British Lieutenant T. E. Lawrence. Peter O Toole plays Lawrence in the film.";
const expected = [
    {
        name: 'Lawrence of Arabia',
        type: 'WORK_OF_ART',
        salience: 0.75222147
    },
    {
        name: 'T.E. Lawrence',
        type: 'PERSON',
        salience: 0.12430617
    },
    {
        name: 'Less credible T.E. Lawrence',
        type: 'PERSON',
        salience: 0.10430617
    },
    {
        name: 'British',
        type: 'LOCATION',
        salience: 0.078094982
    },
    {
        name: 'Dentist appointment',
        type: 'EVENT',
        salience: 0.033808723
    },
    {
        name: 'Peter O Toole',
        type: 'ORGANIZATION',
        salience: 0.011568651
    }
];


describe('entityRecognition', function() {

    // Setup fake Google Cloud client object
    let fakeclient = {
        
            analyzeEntities: function(input){
                return new Promise(function(resolve, reject) {
                    resolve(mockNlpResponse.default);
                });
            }
        
    };

    // Make createClient return the fake object
    sinon.stub(entityRecognition, 'createClient').callsFake(function createFake() {
        return fakeclient;
    });
    
    // Create the fake Google object
    const client = entityRecognition.createClient();
   

    describe('Correct input provided by stub', function() {
        it('return information of interest', function() {
            const stub = sinon.stub(client, 'analyzeEntities');
            stub.resolves(mockNlpResponse.default);

            entityRecognition.getEntitiesFromText(inputText, client).then(function(result) {
                assert.equal(JSON.stringify(result), JSON.stringify(expected));
            }).catch(function(msg) {
                console.log(msg);
            });
            stub.restore();

            expect(stub).to.have.been.calledOnce;
        });
    });

    describe('undefined input', function() {
        it('should not be called', function() {
            const stub = sinon.stub(client, 'analyzeEntities');
            stub.resolves(mockNlpResponse.default);

            entityRecognition.getEntitiesFromText(undefined, client).catch(function(msg) {
                expect(msg).to.include(new Error('Undefined input'));
            });
            stub.restore();

            expect(stub).to.not.have.been.calledOnce;
        });
    });    
});
