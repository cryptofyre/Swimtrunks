const chalk = require('chalk');

class Logger {
    constructor(config) {
        this.timestamps = config?.timestamps ?? true;
        this.colors = config?.colors ?? true;
        this.level = config?.level ?? 'info';
    }

    getTimestamp() {
        return this.timestamps ? `[${new Date().toISOString()}] ` : '';
    }

    getPrefix(type) {
        if (!this.colors) {
            return `[${type.toUpperCase()}]`;
        }

        const colors = {
            info: chalk.blue,
            warn: chalk.yellow,
            error: chalk.red,
            debug: chalk.gray,
            success: chalk.green
        };

        const colorFunc = colors[type] || chalk.white;
        return colorFunc(`[${type.toUpperCase()}]`);
    }

    log(type, system, message) {
        const timestamp = this.getTimestamp();
        const prefix = this.getPrefix(type);
        const systemStr = this.colors ? 
            chalk.cyan(`[${system}]`) : 
            `[${system}]`;
            
        console.log(`${timestamp}${prefix} ${systemStr} ${message}`);
    }

    info(system, message) { this.log('info', system, message); }
    warn(system, message) { this.log('warn', system, message); }
    error(system, message) { this.log('error', system, message); }
    debug(system, message) { 
        if (this.level === 'debug') this.log('debug', system, message); 
    }
    success(system, message) { this.log('success', system, message); }
}

module.exports = Logger;
