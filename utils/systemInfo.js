const si = require('systeminformation');
const os = require('node:os');

async function getSystemEmbed(Discord, status = 'startup') {
    // If it's a shutdown, return simplified embed immediately
    if (status === 'shutdown') {
        return new Discord.EmbedBuilder()
            .setTitle('System Shutting Down')
            .setDescription('🔄 Swimtrunks is performing a clean shutdown...')
            .setColor('#ff0000')
            .setTimestamp();
    }

    // For startup, continue with full system info
    const [cpu, mem, osInfo, processes] = await Promise.all([
        si.cpu(),
        si.mem(),
        si.osInfo(),
        si.processes()
    ]);

    // Check if SDRTrunk is running
    const sdrProcess = processes.list.find(p => 
        p.name.toLowerCase().includes('sdrtrunk') || 
        p.command.toLowerCase().includes('sdrtrunk')
    );

    // Check if sdrTrunkTranscriber is running
    const transcriberProcess = processes.list.find(p =>
        p.name.toLowerCase().includes('sdrtrunktranscriber') ||
        p.command.toLowerCase().includes('sdrtrunktranscriber')
    );

    const uptime = os.uptime();
    const uptimeStr = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`;

    const embed = new Discord.EmbedBuilder()
        .setTitle(`System ${status === 'startup' ? 'Startup' : 'Shutdown'} Report`)
        .addFields(
            { 
                name: '💻 System',
                value: [
                    `**Device**: ${osInfo.platform} ${osInfo.arch}`,
                    `**OS**: ${osInfo.distro} ${osInfo.release}`,
                    `**Uptime**: ${uptimeStr}`
                ].join('\n'),
                inline: true
            },
            {
                name: '🔧 Resources',
                value: [
                    `**CPU**: ${cpu.manufacturer} ${cpu.brand}`,
                    `**Memory**: ${Math.round(mem.used / 1024 / 1024 / 1024 * 10) / 10}GB / ${Math.round(mem.total / 1024 / 1024 / 1024 * 10) / 10}GB`,
                    `**Load**: ${os.loadavg()[0].toFixed(2)}% (1m avg)`
                ].join('\n'),
                inline: true
            },
            {
                name: '📡 SDRTrunk',
                value: sdrProcess ? 
                    `Running (PID: ${sdrProcess.pid})` : 
                    'Not detected',
                inline: false
            },
            {
                name: '🎙️ Transcriber',
                value: transcriberProcess ?
                    `Running (PID: ${transcriberProcess.pid})` :
                    'Not detected',
                inline: true
            }
        )
        .setColor(status === 'startup' ? '#00ff00' : '#ff0000')
        .setTimestamp();

    return embed;
}

module.exports = { getSystemEmbed };
