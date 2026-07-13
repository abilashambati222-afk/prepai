const pdfParse = require('pdf-parse');
const { normalizeText } = require('./normalizer');
const { extractContactInfo } = require('./contactExtractor');
const { detectSections } = require('./sectionDetector');
const { classifySections } = require('./sectionClassifier');
const { calculateConfidence } = require('./confidenceCalculator');
const { buildJson } = require('./jsonBuilder');

/**
 * Fallback parsing strategy using pdfjs-dist legacy backend for corrupted XRef or broken streams
 */
const parsePdfFallback = async (pdfBuffer) => {
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBuffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    disableFontFace: true
  });
  
  const doc = await loadingTask.promise;
  let text = '';
  const numPages = doc.numPages;
  
  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    text += pageText + '\n';
  }
  
  return {
    text,
    numpages: numPages
  };
};

/**
 * Orchestrate the complete parsing pipeline
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {object} fileMetadata - File basic information (size, name)
 * @returns {Promise<object>} Unified structured results
 */
exports.parseResume = async (pdfBuffer, fileMetadata = {}) => {
  let result;
  let rawText = '';
  let parsingEngine = 'pdf-parse';

  try {
    // 1. Extract raw text from PDF using primary engine
    result = await pdfParse(pdfBuffer);
    rawText = result.text || '';
  } catch (err) {
    console.warn('[Parser Engine] Primary parser (pdf-parse) failed. Attempting fallback parser (pdfjs-dist legacy)... Reason:', err.message);
    try {
      // 2. Fall back to pdfjs-dist legacy parser
      result = await parsePdfFallback(pdfBuffer);
      rawText = result.text || '';
      parsingEngine = 'pdfjs-dist-legacy';
    } catch (fallbackErr) {
      console.error('[Parser Engine] Secondary parser fallback failed:', fallbackErr);
      throw new Error('Resume contains corrupted layout segments (bad XRef or broken stream) and cannot be parsed. Please re-save or re-export the PDF and try again.');
    }
  }

  // 2. OCR Readiness check: halt if text contains no machine-readable characters
  const alphaNumericOnly = rawText.replace(/[^a-zA-Z0-9]/g, '');
  if (alphaNumericOnly.length < 20) {
    throw new Error('This PDF appears to be scanned. OCR support will be available in a future version.');
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

  // 8. Calculate Word, Character, Page and Section statistics
  const wordCount = normalized.trim().split(/\s+/).filter(Boolean).length;
  const charCount = normalized.length;
  const pageCount = result.numpages || result.numPages || 1;
  
  // Find which sections have actual content
  const sectionsFound = Object.keys(classified).filter(key => {
    const val = classified[key];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    return val.toString().trim().length > 0;
  });

  // 9. Build Structured JSON Output
  const parsedData = buildJson(contacts, classified, {
    fileSize: fileMetadata.size || 0,
    fileName: fileMetadata.name || '',
    parsedAt: new Date(),
    parserVersion: '1.0.0',
    pageCount,
    wordCount,
    charCount,
    sectionsFound,
    parsingEngine
  });

  return {
    rawText: normalized,
    parsedData,
    parsingConfidence
  };
};
