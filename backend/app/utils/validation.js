// Validation utility functions for input sanitization and validation

const VALID_ROLES = ['OWNER', 'EDITOR', 'COMMENTOR', 'VIEWER'];
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const MAX_TITLE_LENGTH = 500;
const MAX_CONTENT_LENGTH = 1000000; // 1MB for JSON content
const MAX_TAG_NAME_LENGTH = 100;
const MAX_FOLDER_NAME_LENGTH = 255;

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate role is valid enum
 */
const validateRole = (role) => {
  return VALID_ROLES.includes(role);
};

/**
 * Validate hex color format
 */
const validateColor = (color) => {
  return HEX_COLOR_REGEX.test(color);
};

/**
 * Validate string length
 */
const validateStringLength = (str, minLength = 1, maxLength = 1000) => {
  if (typeof str !== 'string') return false;
  return str.length >= minLength && str.length <= maxLength;
};

/**
 * Safely extract username from email
 */
const getEmailUsername = (email) => {
  try {
    const match = email.match(/^([^@]+)@/);
    return match ? match[1] : email;
  } catch (err) {
    return 'User';
  }
};

/**
 * Validate document title
 */
const validateDocumentTitle = (title) => {
  return validateStringLength(title, 1, MAX_TITLE_LENGTH);
};

/**
 * Validate folder name
 */
const validateFolderName = (name) => {
  return validateStringLength(name, 1, MAX_FOLDER_NAME_LENGTH);
};

/**
 * Validate tag name
 */
const validateTagName = (name) => {
  return validateStringLength(name, 1, MAX_TAG_NAME_LENGTH);
};

/**
 * Validate JSON content size
 */
const validateContentSize = (content) => {
  try {
    const jsonStr = JSON.stringify(content);
    return jsonStr.length <= MAX_CONTENT_LENGTH;
  } catch (err) {
    return false;
  }
};

module.exports = {
  VALID_ROLES,
  HEX_COLOR_REGEX,
  validateEmail,
  validateRole,
  validateColor,
  validateStringLength,
  getEmailUsername,
  validateDocumentTitle,
  validateFolderName,
  validateTagName,
  validateContentSize,
};
