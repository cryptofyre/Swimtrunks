const departmentTypes = {
    // Law Enforcement
    POLICE: {
        keywords: ['PD', 'Police', 'Sheriff', 'SO', 'Law', 'Enforcement', 'MCSO', 'Constb', 'TSTC Police', 'Baylor PD'],
        color: '#0037ff', // Blue
        emoji: '👮'
    },
    // Fire Department
    FIRE: {
        keywords: ['FD', 'Fire', 'WFD', 'Still Cl', 'Tone'],
        color: '#ff0000', // Red
        emoji: '🚒'
    },
    // Emergency Management
    EMERGENCY: {
        keywords: ['Emer', 'EOC', 'Emergency', 'T-Control'],
        color: '#ff7700', // Orange
        emoji: '🚨'
    },
    // Public Works
    PUBLIC_WORKS: {
        keywords: ['PW', 'Public Works', 'Streets', 'Util', 'Park', 'Fleet', 'Traffic', 'Garbg', 'Garb', 'Roads', 'Streets', 'Sewer', 'Water', 'Meter'],
        color: '#2db82d', // Green
        emoji: '🔧'
    },
    // Schools
    EDUCATION: {
        keywords: ['ISD', 'School', 'WISD', 'CISD', 'Campus', 'MCC'],
        color: '#9933ff', // Purple
        emoji: '🎓'
    },
    // Radio/Events
    EVENTS: {
        keywords: ['Events', 'RadioSvc', 'Radio'],
        color: '#ffcc00', // Yellow
        emoji: '📡'
    },
    // Airport Operations
    AIRPORT: {
        keywords: ['Airprt', 'Airport'],
        color: '#00ccff', // Light Blue
        emoji: '✈️'
    }
};

function getDepartmentInfo(departmentName, talkgroupName = '') {
    const normalizedDept = `${departmentName} ${talkgroupName}`.toUpperCase();
    
    for (const [key, type] of Object.entries(departmentTypes)) {
        if (type.keywords.some(keyword => 
            normalizedDept.includes(keyword.toUpperCase()))) {
            return {
                color: type.color,
                emoji: type.emoji,
                type: key
            };
        }
    }
    
    return {
        color: '#0099ff',
        emoji: '🔔',
        type: 'OTHER'
    };
}

module.exports = {
    getDepartmentInfo,
    departmentTypes
};
