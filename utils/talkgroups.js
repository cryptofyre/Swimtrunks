const fs = require('node:fs');
const xml2js = require('xml2js');
const Logger = require('./logger');
const config = require('../config.json');
const logger = new Logger(config.logging);

const talkgroups = new Map();

function loadTalkgroups(xmlPath) {
    const xmlData = fs.readFileSync(xmlPath, 'utf8');
    const parser = new xml2js.Parser();

    parser.parseString(xmlData, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return;
        }

        // Process each alias in the playlist
        for (const alias of result.playlist.alias) {
            const talkgroupId = alias.id.find(id => id.$.type === 'talkgroup')?.$?.value;
            if (talkgroupId) {
                talkgroups.set(talkgroupId, {
                    name: alias.$.name,
                    group: alias.$.group,
                    color: alias.$.color
                });
            }
        }

        logger.success('Talkgroups', `Loaded ${talkgroups.size} talkgroups from playlist`);
    });
}

function getTalkgroupInfo(talkgroupId) {
    // Convert talkgroupId to string since XML values are stored as strings
    const id = String(talkgroupId);
    return talkgroups.get(id) || {
        name: 'Unknown Talkgroup',
        group: 'Unknown Department',
        color: '0'
    };
}

function getAllTalkgroups() {
    return Array.from(talkgroups.entries()).map(([id, info]) => ({
        id,
        ...info
    }));
}

module.exports = {
    loadTalkgroups,
    getTalkgroupInfo,
    getAllTalkgroups
};
