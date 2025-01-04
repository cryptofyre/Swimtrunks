# Swimtrunks

A Discord bot that monitors SDRTrunk recordings and transcriptions, providing real-time updates of radio communications in a clean, organized format.

## 🌟 Features

- Real-time monitoring of SDRTrunk recordings
- Automatic transcription posting
- Department color coding and categorization
- System status monitoring
- Detailed logging system
- Graceful startup and shutdown handling
- SQLite database integration
- Department-based emoji indicators

## 📋 Prerequisites

- Node.js v18 or higher
- SDRTrunk with recording capability
- My sdrTrunkTranscriber fork
- SQLite database setup from SDRTrunk
- Discord bot token and channel

## 🔧 Dependencies

```json
{
  "dependencies": {
    "discord.js": "^14.x",
    "sqlite3": "^5.x",
    "chalk": "^4.1.2",
    "systeminformation": "^5.x",
    "xml2js": "^0.6.x"
  }
}
```

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/cryptofyre/swimtrunks.git
cd swimtrunks
```

2. Install dependencies:
```bash
npm install
```

3. Create `config.json`:
```json
{
    "discord": {
        "token": "YOUR_BOT_TOKEN",
        "channelId": "YOUR_CHANNEL_ID"
    },
    "database": {
        "path": "/path/to/sdrtrunk/recordings.db"
    },
    "playlist": {
        "path": "/path/to/sdrtrunk/playlist/default.xml"
    },
    "polling": {
        "interval": 5000,
        "batchSize": 5
    },
    "logging": {
        "level": "info",
        "timestamps": true,
        "colors": true
    }
}
```

## 📝 Configuration

- `discord.token`: Your Discord bot token
- `discord.channelId`: Channel ID where messages will be sent
- `database.path`: Path to SDRTrunk's SQLite database
- `playlist.path`: Path to SDRTrunk's playlist XML
- `polling.interval`: How often to check for new recordings (ms)
- `polling.batchSize`: Maximum number of recordings to process at once
- `logging`: Logging configuration options

## 🎯 Usage

Start the bot:
```bash
node main.js
```

## 🚨 Department Colors

The bot automatically color-codes departments:
- 👮 Law Enforcement: Blue
- 🚒 Fire Department: Red
- 🚨 Emergency Management: Orange
- 🔧 Public Works: Green
- 🎓 Schools: Purple
- 📡 Radio/Events: Yellow
- ✈️ Airport Operations: Light Blue
- 🔔 Other: Default Blue

## 📊 System Monitoring

The bot provides system information on startup:
- System specifications
- Resource usage
- SDRTrunk status
- Transcriber status
- Memory utilization

## 📜 License

This project is licensed under GPL-3.0. See the LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## ⚠️ Important Notes

- Never commit your `config.json` with sensitive information
- Ensure proper file permissions for database and XML access
- Monitor the logs for any potential issues
- Keep your dependencies updated

## 🤝 Support

For support, please open an issue in the GitHub repository.
