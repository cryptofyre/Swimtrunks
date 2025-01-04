const Discord = require('discord.js');
const { loadTalkgroups, getTalkgroupInfo } = require('./utils/talkgroups');
const { getDepartmentInfo } = require('./utils/departmentColors');
const Database = require('./utils/database');
const Logger = require('./utils/logger');
const SystemInfo = require('./utils/systemInfo');
const config = require('./config.json');
const TextProcessor = require('./utils/textProcessor');

const logger = new Logger(config.logging);
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages
    ]
});

const db = new Database(config.database.path);

function formatDateTime(unixtime) {
    const date = new Date(unixtime * 1000);
    return {
        discord: `<t:${unixtime}:F>`, // Uses Discord's compact format
        log: date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    };
}

// Initialize the bot
async function init() {
    try {
        await db.init();
        logger.info('Database', 'Database initialized successfully');
        
        await client.login(config.discord.token);
        logger.info('Discord', 'Logging into Discord...');
    } catch (error) {
        logger.error('Startup', `Failed to initialize: ${error.message}`);
        process.exit(1);
    }
}

async function processNewCalls() {
    try {
        const calls = await db.getLatestCalls(config.polling.batchSize);
        
        for (const call of calls) {
            try {
                const channel = await client.channels.fetch(config.discord.channelId);
                const talkgroupInfo = getTalkgroupInfo(call.talkgroup_id);
                const transcription = JSON.parse(call.transcription).text;
                const deptInfo = getDepartmentInfo(talkgroupInfo.group, talkgroupInfo.name);
                
                const timeFormats = formatDateTime(call.unixtime);
                const duration = Number.parseFloat(call.duration) || 0;
                const durationStr = `${duration.toFixed(1)}s`;
                
                const formattedTranscription = TextProcessor.formatTranscription(transcription);
                
                const title = `📞 Incoming call from ${deptInfo.emoji} ${talkgroupInfo.group}`;
                const subtitle = `📻 ${talkgroupInfo.name}`;
                
                const embed = new Discord.EmbedBuilder()
                    .setTitle(title)
                    .setDescription([
                        subtitle,
                        '',
                        formattedTranscription
                    ].join('\n'))
                    .addFields(
                        { 
                            name: 'Details',
                            value: [
                                `📟 Unit: \`${call.from_id}\``,
                                `⏱️ Duration: \`${durationStr}\``,
                                `🕒 ${timeFormats.discord}`
                            ].join(' • '),
                            inline: false
                        }
                    )
                    .setColor(deptInfo.color)
                    .setTimestamp()
                    .setFooter({ 
                        text: `TalkGroup: ${call.talkgroup_id} • Swimtrunks made by cryptofyre`
                    });

                await channel.send({
                    embeds: [embed],
                    files: [{
                        attachment: call.filepath,
                        name: call.filename
                    }]
                });

                await db.markCallAsProcessed(call.unixtime);
                logger.success('Processor', 
                    `Processed ${talkgroupInfo.group} call from ${talkgroupInfo.name} (${call.talkgroup_id}) at ${timeFormats.log}`
                );
            } catch (error) {
                logger.error('Processor', `Failed to process call: ${error.message}`);
            }
        }
    } catch (error) {
        logger.error('Database', `Failed to fetch calls: ${error.message}`);
    }
}

async function updateChannelDescription() {
    if (!config.monitoring?.enabled || !config.monitoring?.channelDescription) return;

    try {
        const channel = await client.channels.fetch(config.discord.channelId);
        const stats = await SystemInfo.getSystemStats();
        await channel.setTopic(stats);
        logger.info('Monitoring', 'Updated channel description with system stats');
    } catch (error) {
        logger.error('Monitoring', `Failed to update channel description: ${error.message}`);
    }
}

client.once('ready', async () => {
    try {
        logger.success('Discord', 'Swimtrunks is ready!');
        
        // Send startup embed
        const channel = await client.channels.fetch(config.discord.channelId);
        const startupEmbed = await SystemInfo.getSystemEmbed(Discord, 'startup');
        await channel.send({ embeds: [startupEmbed] });
        
        loadTalkgroups(config.playlist.path);
        logger.info('Talkgroups', 'Loaded talkgroup configurations');
        
        setInterval(processNewCalls, config.polling.interval);
        logger.info('Processor', `Started call processing (${config.polling.interval}ms interval)`);

        if (config.monitoring?.enabled) {
            setInterval(updateChannelDescription, config.monitoring.updateInterval);
            await updateChannelDescription(); // Initial update
            logger.info('Monitoring', `Started system monitoring (${config.monitoring.updateInterval}ms interval)`);
        }
    } catch (error) {
        logger.error('Startup', `Failed during startup routines: ${error.message}`);
        process.exit(1);
    }
});

// Cleanup and shutdown handling
async function handleShutdown() {
    logger.info('System', 'Shutting down...');
    try {
        const channel = await client.channels.fetch(config.discord.channelId);
        const shutdownEmbed = await SystemInfo.getSystemEmbed(Discord, 'shutdown');
        await channel.send({ embeds: [shutdownEmbed] });
        
        // Quick cleanup
        setTimeout(() => {
            db.close();
            process.exit(0);
        }, 500); // Give Discord API 500ms to send the message
    } catch (error) {
        logger.error('Shutdown', `Emergency shutdown initiated, closing database: ${error.message}`);
        db.close();
        process.exit(1);
    }
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Error handling
process.on('unhandledRejection', (error) => {
    logger.error('System', `Unhandled rejection: ${error.message}`);
});

process.on('uncaughtException', (error) => {
    logger.error('System', `Uncaught exception: ${error.message}`);
    process.exit(1);
});

// Start the bot
init();