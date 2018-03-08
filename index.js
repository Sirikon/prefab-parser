const yaml = require('yamljs');
const fs = require('fs');

const { IDsToString } = require('./src/idsToString');

function getComponents(info, gameObject) {
    var components = [];
    gameObject.m_Component.forEach((c) => {
        if (info[c.component.fileID]) {
            components.push({
                type: Object.keys(info[c.component.fileID])[0],
                id: c.component.fileID.toString()
            });
        }
    });
    return components;
}

function getTransform(info, gameObject) {
    var components = getComponents(info, gameObject);
    var transformId = components.filter(c => c.type === 'Transform')[0].id;
    var transform = info[transformId].Transform;
    return transform;
}

function getChildren(info, gameObject) {
    var children = [];
    var transform = getTransform(info, gameObject);

    transform.m_Children.forEach((child) => {
        children.push(getGameObject(info, info[child.fileID.toString()].Transform.m_GameObject.fileID.toString()))
    });

    return children;
}

function getGameObject(info, id) {

    if (!info[id]) return {};

    var rawGameObject = info[id].GameObject;

    var name = rawGameObject.m_Name;
    var components = getComponents(info, rawGameObject);
    var children = getChildren(info, rawGameObject);

    return { id, name, components, children }
}

var data = fs.readFileSync('./data/Test.prefab', { encoding: 'utf8' });

data = data.replace(/\r/g, '');

data = data.split('\n');

var block = [];
var blockId = '';
var info = {};
var final = {};

var c = 0;

while(c < data.length) {
    var line = data[c];
    c++;
    if (line.indexOf('%') === 0) continue;
    if (line.indexOf('---') === 0) {
        if (block.length > 0) {
            var joinedBlock = IDsToString(block.join('\n'));
            info[blockId] = yaml.parse(joinedBlock);
            block = [];
        }
        blockId = line.substr(line.indexOf('&')+1);
    }
    block.push(line);
}

var joinedBlock = IDsToString(block.join('\n'));
info[blockId] = yaml.parse(joinedBlock);

var prefab = Object.keys(info).filter((k) => {
    return !!info[k].Prefab
}).map(k => info[k].Prefab)[0];

final = getGameObject(info, prefab.m_RootGameObject.fileID.toString());

console.log(JSON.stringify(final, null, 2));

// fs.writeFileSync('./info.json', JSON.stringify(info, null, 4));
