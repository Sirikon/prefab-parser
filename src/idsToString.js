/*
The YAML parser have some problems parsing large numbers for fileID,
so, this method replaces the numbers with string representations
*/

function IDsToString(block) {
    var regex = /fileID: /g;
    var indices = [];
    var result;

    while ( (result = regex.exec(block)) ) {
        indices.push(result.index);
    }

    indices
        .map(i => {
            return { start: i + 8, length: null, value: '' }
        })
        .sort((a, b) => b.start - a.start)
        .forEach(i => {
            var subBlock = block.substr(i.start);
            i.length = subBlock.search(/(,|})/g);
            i.value = block.substr(i.start, i.length);
            block = block.substr(0, i.start) + `"${i.value}"` + block.substr(i.start + i.length);
        });

    return block;
}

module.exports = { IDsToString }
