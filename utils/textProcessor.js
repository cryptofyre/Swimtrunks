const censorPatterns = [
    // DL Numbers (various formats)
    { pattern: /\b\d{9}\b/g, replacement: '[DL NUMBER]' },
    { pattern: /\b\d{7,8}\b/g, replacement: '[ID NUMBER]' },
    
    // Phone Numbers (various formats)
    { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replacement: '[PHONE NUMBER]' },
    { pattern: /\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/g, replacement: '[PHONE NUMBER]' },
    
    // SSN
    { pattern: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g, replacement: '[SSN]' },
    
    // License Plates (common formats)
    { pattern: /\b[A-Z0-9]{6,7}\b/g, replacement: '[PLATE]' },
    
    // Common sensitive keywords with numbers
    { pattern: /\b(?:dl|license|lic|id)(?:\s*number)?[\s:#]?\d+\b/gi, replacement: '[ID NUMBER]' },
];

const disclaimer = "\n\n-# *Transcription provided by local AI processing - Accuracy may vary*";

function processSensitiveInfo(text) {
    let processed = text;
    
    // Apply each censorship pattern
    for (const { pattern, replacement } of censorPatterns) {
        processed = processed.replace(pattern, replacement);
    }

    return processed;
}

function formatTranscription(transcription) {
    if (!transcription) {
        return '*No transcription available*';
    }

    const processed = processSensitiveInfo(transcription);
    return `> ${processed}${disclaimer}`;
}

module.exports = {
    processSensitiveInfo,
    formatTranscription
};
