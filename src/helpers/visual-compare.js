/**
 * Visual Comparison Utility
 * Pixel-diff comparison using pixelmatch for visual regression testing
 * 
 * @module helpers/visual-compare
 */

import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VISUAL_BASELINE_DIR = path.join(__dirname, '../../visual-baseline');
export const BASELINE_DIR = path.join(VISUAL_BASELINE_DIR, 'baseline');
export const ACTUAL_DIR = path.join(VISUAL_BASELINE_DIR, 'actual');
export const DIFF_DIR = path.join(VISUAL_BASELINE_DIR, 'diff');

/**
 * Configuration for visual comparison
 */
export const DEFAULT_CONFIG = {
  threshold: 0.1, // Per-pixel color threshold (0-1)
  diffThreshold: 0.05, // 5% total diff allowed
  includeAA: false, // Ignore anti-aliasing differences
  alpha: 0.1, // Opacity of original image in diff output
  diffColor: [255, 0, 0], // Red color for diff pixels
  diffColorAlt: [0, 255, 0], // Green for anti-aliased pixels
};

/**
 * Ensure directories exist
 */
function ensureDirectories() {
  [VISUAL_BASELINE_DIR, BASELINE_DIR, ACTUAL_DIR, DIFF_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Generate sanitized filename from test name
 * @param {string} testName - Test name
 * @param {string} viewport - Viewport identifier (e.g., 'desktop', 'mobile')
 * @returns {string} Sanitized filename
 */
export function generateFileName(testName, viewport = 'desktop') {
  const sanitized = testName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${sanitized}-${viewport}.png`;
}

/**
 * Save screenshot as baseline
 * @param {Buffer} imageBuffer - PNG image buffer
 * @param {string} testName - Test name for filename
 * @param {string} viewport - Viewport identifier
 * @returns {string} Path to saved baseline
 */
export function saveBaseline(imageBuffer, testName, viewport = 'desktop') {
  ensureDirectories();
  const fileName = generateFileName(testName, viewport);
  const filePath = path.join(BASELINE_DIR, fileName);
  fs.writeFileSync(filePath, imageBuffer);
  console.log(`✅ Baseline saved: ${fileName}`);
  return filePath;
}

/**
 * Save actual screenshot
 * @param {Buffer} imageBuffer - PNG image buffer
 * @param {string} testName - Test name for filename
 * @param {string} viewport - Viewport identifier
 * @returns {string} Path to saved actual screenshot
 */
export function saveActual(imageBuffer, testName, viewport = 'desktop') {
  ensureDirectories();
  const fileName = generateFileName(testName, viewport);
  const filePath = path.join(ACTUAL_DIR, fileName);
  fs.writeFileSync(filePath, imageBuffer);
  return filePath;
}

/**
 * Check if baseline exists for given test
 * @param {string} testName - Test name
 * @param {string} viewport - Viewport identifier
 * @returns {boolean} True if baseline exists
 */
export function baselineExists(testName, viewport = 'desktop') {
  const fileName = generateFileName(testName, viewport);
  const filePath = path.join(BASELINE_DIR, fileName);
  return fs.existsSync(filePath);
}

/**
 * Load baseline image
 * @param {string} testName - Test name
 * @param {string} viewport - Viewport identifier
 * @returns {PNG|null} PNG object or null if not found
 */
export function loadBaseline(testName, viewport = 'desktop') {
  const fileName = generateFileName(testName, viewport);
  const filePath = path.join(BASELINE_DIR, fileName);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const data = fs.readFileSync(filePath);
  return PNG.sync.read(data);
}

/**
 * Compare two images and generate diff
 * @param {Buffer} actualBuffer - Actual screenshot buffer
 * @param {string} testName - Test name for filename
 * @param {string} viewport - Viewport identifier
 * @param {Object} config - Comparison configuration
 * @returns {Object} Comparison result
 */
export function compareImages(actualBuffer, testName, viewport = 'desktop', config = {}) {
  ensureDirectories();
  const options = { ...DEFAULT_CONFIG, ...config };
  const fileName = generateFileName(testName, viewport);
  
  // Load baseline
  const baseline = loadBaseline(testName, viewport);
  if (!baseline) {
    // No baseline - save actual as new baseline
    saveBaseline(actualBuffer, testName, viewport);
    return {
      match: true,
      isNewBaseline: true,
      message: `New baseline created: ${fileName}`,
      diffPercentage: 0,
      diffPixels: 0,
      totalPixels: 0,
    };
  }
  
  // Parse actual image
  const actual = PNG.sync.read(actualBuffer);
  
  // Check dimensions match
  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    // Save actual for review
    saveActual(actualBuffer, testName, viewport);
    return {
      match: false,
      isNewBaseline: false,
      message: `Dimension mismatch: baseline (${baseline.width}x${baseline.height}) vs actual (${actual.width}x${actual.height})`,
      diffPercentage: 100,
      diffPixels: -1,
      totalPixels: baseline.width * baseline.height,
      baselinePath: path.join(BASELINE_DIR, fileName),
      actualPath: path.join(ACTUAL_DIR, fileName),
    };
  }
  
  // Create diff image
  const { width, height } = baseline;
  const diff = new PNG({ width, height });
  
  // Run pixelmatch comparison
  const diffPixels = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    width,
    height,
    {
      threshold: options.threshold,
      includeAA: options.includeAA,
      alpha: options.alpha,
      diffColor: options.diffColor,
      diffColorAlt: options.diffColorAlt,
    }
  );
  
  const totalPixels = width * height;
  const diffPercentage = (diffPixels / totalPixels) * 100;
  const match = diffPercentage <= options.diffThreshold * 100;
  
  // Save actual screenshot
  saveActual(actualBuffer, testName, viewport);
  
  // Save diff image if there are differences
  if (diffPixels > 0) {
    const diffPath = path.join(DIFF_DIR, fileName);
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
  }
  
  return {
    match,
    isNewBaseline: false,
    message: match 
      ? `Visual match: ${diffPercentage.toFixed(2)}% diff (threshold: ${options.diffThreshold * 100}%)`
      : `Visual mismatch: ${diffPercentage.toFixed(2)}% diff exceeds threshold ${options.diffThreshold * 100}%`,
    diffPercentage,
    diffPixels,
    totalPixels,
    baselinePath: path.join(BASELINE_DIR, fileName),
    actualPath: path.join(ACTUAL_DIR, fileName),
    diffPath: diffPixels > 0 ? path.join(DIFF_DIR, fileName) : null,
  };
}

/**
 * Update baseline with current actual screenshot
 * @param {string} testName - Test name
 * @param {string} viewport - Viewport identifier
 * @returns {boolean} True if update successful
 */
export function updateBaseline(testName, viewport = 'desktop') {
  const fileName = generateFileName(testName, viewport);
  const actualPath = path.join(ACTUAL_DIR, fileName);
  const baselinePath = path.join(BASELINE_DIR, fileName);
  
  if (!fs.existsSync(actualPath)) {
    console.error(`❌ Actual screenshot not found: ${actualPath}`);
    return false;
  }
  
  fs.copyFileSync(actualPath, baselinePath);
  console.log(`✅ Baseline updated from actual: ${fileName}`);
  return true;
}

/**
 * List all baselines
 * @returns {string[]} Array of baseline filenames
 */
export function listBaselines() {
  ensureDirectories();
  return fs.readdirSync(BASELINE_DIR).filter(f => f.endsWith('.png'));
}

/**
 * Delete baseline
 * @param {string} testName - Test name
 * @param {string} viewport - Viewport identifier
 * @returns {boolean} True if deleted
 */
export function deleteBaseline(testName, viewport = 'desktop') {
  const fileName = generateFileName(testName, viewport);
  const filePath = path.join(BASELINE_DIR, fileName);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️ Baseline deleted: ${fileName}`);
    return true;
  }
  return false;
}

/**
 * Clean up actual and diff directories
 */
export function cleanupTestArtifacts() {
  [ACTUAL_DIR, DIFF_DIR].forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        fs.unlinkSync(path.join(dir, file));
      });
    }
  });
  console.log('🧹 Test artifacts cleaned');
}
