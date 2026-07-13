const BadRequestError = require('../../errors/BadRequestError');

/**
 * Validates a file before parsing
 * @param {object} file - Express multer file object
 */
exports.validateUploadedFile = (file) => {
  if (!file) {
    throw new BadRequestError('No resume file provided.');
  }

  // Supported mime types
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestError('Invalid file format. Only PDF and DOCX files are allowed.');
  }

  // 10 MB in bytes
  const maxSizeBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new BadRequestError('File size exceeds the 10 MB limit.');
  }

  if (file.size === 0) {
    throw new BadRequestError('Uploaded file is empty.');
  }
};

/**
 * Checks parsed raw text to verify it contains readable alphanumeric content
 * @param {string} rawText - Parsed text content
 */
exports.validateParsedText = (rawText) => {
  if (!rawText || rawText.trim() === '') {
    throw new BadRequestError('Failed to extract text. The file might be empty or corrupted.');
  }

  const alphaNumericOnly = rawText.replace(/[^a-zA-Z0-9]/g, '');
  if (alphaNumericOnly.length < 40) {
    throw new BadRequestError('Resume contains no machine-readable text. Scanned or image-only PDFs are not supported.');
  }
};
