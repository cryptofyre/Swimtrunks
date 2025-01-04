const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor(dbPath) {
        this.dbPath = dbPath;
    }

    async init() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, async (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                try {
                    await this.initStartupTime();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async initStartupTime() {
        return new Promise((resolve, reject) => {
            this.startupTime = Math.floor(Date.now() / 1000);

            this.db.get("SELECT * FROM recordings LIMIT 1", (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (row && !('processed' in row)) {
                    this.db.run(`ALTER TABLE recordings ADD COLUMN processed INTEGER DEFAULT 0`, (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        this.markExistingRecords(resolve, reject);
                    });
                } else {
                    this.markExistingRecords(resolve, reject);
                }
            });
        });
    }

    markExistingRecords(resolve, reject) {
        this.db.run(`
            UPDATE recordings 
            SET processed = 1 
            WHERE unixtime < ?
        `, [this.startupTime], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    }

    getLatestCalls(limit = 1) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    date, 
                    time, 
                    unixtime, 
                    talkgroup_id, 
                    radio_id as from_id, 
                    duration, 
                    filename, 
                    filepath, 
                    transcription
                FROM recordings 
                WHERE processed = 0 
                AND unixtime >= ?
                ORDER BY unixtime DESC 
                LIMIT ?
            `;
            
            this.db.all(query, [this.startupTime, limit], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    markCallAsProcessed(unixtime) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE recordings SET processed = 1 WHERE unixtime = ?';
            this.db.run(query, [unixtime], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = Database;
