const pdfParse = require('pdf-parse');
const { normalizeText } = require('./normalizer');
const { extractContactInfo } = require('./contactExtractor');
const { detectSections } = require('./sectionDetector');
const { classifySections } = require('./sectionClassifier');
const { calculateConfidence } = require('./confidenceCalculator');
const { buildJson } = require('./jsonBuilder');

/**
 * Orchestrate the complete parsing pipeline
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {object} fileMetadata - File basic information (size, name)
 * @returns {Promise<object>} Unified structured results
 */
exports.parseResume = async (pdfBuffer, fileMetadata = {}) => {
  // 1. Extract raw text from PDF
  const result = await pdfParse(pdfBuffer);
  const rawText = result.text || '';

  // 2. OCR Readiness check: halt if text contains no machine-readable characters
  const alphaNumericOnly = rawText.replace(/[^a-zA-Z0-9]/g, '');
  if (alphaNumericOnly.length < 40) {
    throw new Error('Resume contains no machine-readable text.');
  }

  // 3. Normalize text
  const normalized = normalizeText(rawText);

  // 4. Extract Contact Details
  const contacts = extractContactInfo(normalized);

  // 5. Segment Text into Category Blocks
  const rawSections = detectSections(normalized);

  // 6. Classify category blocks
  const classified = classifySections(rawSections);

  // 7. Calculate Dynamic Confidence Metric
  const parsingConfidence = calculateConfidence(classified);

  // 8. Build Structured JSON Output
  const parsedData = buildJson(contacts, classified, {
    fileSize: fileMetadata.size || 0,
    fileName: fileMetadata.name || '',
    parsedAt: new Date(),
    parserVersion: '1.0.0'
  });

  return {
    rawText: normalized,
    parsedData,
    parsingConfidence
  };
};
