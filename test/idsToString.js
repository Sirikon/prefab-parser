const assert = require('assert');
const { IDsToString } = require('../src/idsToString');

describe('IDsToString', function() {
    it('should work', function() {
        assert.equal(IDsToString('{fileID: 238748728473}'), '{fileID: "238748728473"}');
        assert.equal(IDsToString('{fileID: 0}'), '{fileID: "0"}');
        assert.equal(IDsToString('{fileID: 0} {fileID: 7}'), '{fileID: "0"} {fileID: "7"}');
    });
});
