/**
 * Visual Regression Tests for B2B SEO Landings
 * 
 * Compares current implementation against baseline screenshots.
 * First run creates baseline, subsequent runs compare against it.
 * 
 * @task LAN-7566
 * @epic B2B Platform
 * @feature Visual Regression
 */

import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { compareImages, baselineExists, listBaselines } from '../../src/helpers/visual-compare.js';
import { B2BLandingPage } from '../../src/pages/b2b-landing.page.js';
import fs from 'fs';

// B2B Landing configurations
const B2B_LANDINGS = {
  aviabilety: {
    url: 'https://b2b.onetwotrip.com/aviabilety-dlya-yur-lic',
    title: 'Авиабилеты для юридических лиц',
    slug: 'aviabilety-dlya-yur-lic',
  },
  zhd: {
    url: 'https://b2b.onetwotrip.com/zhd-bilety-dlya-yur-lic',
    title: 'ЖД билеты для юридических лиц',
    slug: 'zhd-bilety-dlya-yur-lic',
  },
  turizm: {
    url: 'https://b2b.onetwotrip.com/delovoj-turizm',
    title: 'Деловой туризм',
    slug: 'delovoj-turizm',
  },
};

// Viewport configurations for responsive testing
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

test.describe('B2B Landings Visual Regression @visual @LAN-7566', () => {
  
  test.beforeEach(async ({}, testInfo) => {
    // Allure metadata
    await allure.epic('B2B Platform');
    await allure.feature('Visual Regression');
    await allure.story('SEO Landings');
    await allure.tag('LAN-7566');
    await allure.tag('visual-regression');
  });

  // Generate tests for each landing and viewport combination
  for (const [landingKey, landing] of Object.entries(B2B_LANDINGS)) {
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      
      test(`${landing.title} - ${viewportName} viewport`, async ({ page }) => {
        const testName = `b2b-${landingKey}-${viewportName}`;
        
        await allure.parameter('Landing', landing.title);
        await allure.parameter('Viewport', `${viewport.width}x${viewport.height}`);
        await allure.parameter('URL', landing.url);
        
        // Set viewport
        await page.setViewportSize(viewport);
        
        // Navigate and wait for page load
        await test.step('Navigate to landing page', async () => {
          await page.goto(landing.url, { waitUntil: 'networkidle' });
          
          // Wait for page body to be visible (B2B landings may not have h1)
          await page.waitForSelector('body', { state: 'visible', timeout: 10000 });
          
          // Additional wait for animations/lazy loading
          await page.waitForTimeout(1500);
        });
        
        // Hide dynamic elements that may cause flaky comparisons
        await test.step('Prepare page for screenshot', async () => {
          await page.evaluate(() => {
            // Hide elements that change frequently
            const selectorsToHide = [
              '[data-testid="cookie-banner"]',
              '.cookie-consent',
              '.chat-widget',
              '.intercom-lightweight-app',
              '[class*="cookie"]',
              '[class*="banner"]',
              '[id*="cookie"]',
            ];
            
            selectorsToHide.forEach(selector => {
              document.querySelectorAll(selector).forEach(el => {
                el.style.visibility = 'hidden';
              });
            });
            
            // Disable animations
            const style = document.createElement('style');
            style.textContent = `
              *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
              }
            `;
            document.head.appendChild(style);
          });
        });
        
        // Take screenshot
        const screenshotBuffer = await test.step('Capture screenshot', async () => {
          const buffer = await page.screenshot({
            type: 'png',
            // Use viewport screenshot, not fullPage (to avoid 8000px limit)
            fullPage: false,
          });
          
          // Attach screenshot to Allure report
          await allure.attachment('Current Screenshot', buffer, 'image/png');
          
          return buffer;
        });
        
        // Compare with baseline
        await test.step('Compare with baseline', async () => {
          const isNewBaseline = !baselineExists(testName, 'default');
          
          if (isNewBaseline) {
            await allure.label('baseline', 'new');
          }
          
          const result = compareImages(screenshotBuffer, testName, 'default', {
            threshold: 0.1,
            diffThreshold: 0.05, // 5% difference allowed
          });
          
          // Log comparison result
          console.log(`[${testName}] ${result.message}`);
          
          // Attach comparison details to Allure
          await allure.attachment(
            'Comparison Result',
            JSON.stringify(result, null, 2),
            'application/json'
          );
          
          if (result.isNewBaseline) {
            // First run - baseline created
            await allure.label('result', 'baseline-created');
            console.log(`✅ New baseline created for: ${testName}`);
          } else if (!result.match) {
            // Visual difference detected
            await allure.label('result', 'mismatch');
            
            // Attach diff image if available
            if (result.diffPath) {
              const diffBuffer = fs.readFileSync(result.diffPath);
              await allure.attachment('Diff Image', diffBuffer, 'image/png');
            }
            
            // Attach baseline for comparison
            if (result.baselinePath) {
              const baselineBuffer = fs.readFileSync(result.baselinePath);
              await allure.attachment('Baseline Image', baselineBuffer, 'image/png');
            }
            
            // Fail the test with detailed message
            expect(result.match, `Visual mismatch: ${result.diffPercentage.toFixed(2)}% difference detected. Check diff image in Allure report.`).toBe(true);
          } else {
            // Visual match
            await allure.label('result', 'match');
            console.log(`✅ Visual match for: ${testName} (${result.diffPercentage.toFixed(2)}% diff)`);
          }
        });
      });
    }
  }
});

// Utility test to list all baselines
test.describe('Visual Regression Utilities', () => {
  
  test.skip('List all baselines', async () => {
    const baselines = listBaselines();
    console.log('\n📸 Available baselines:');
    baselines.forEach(b => console.log(`  - ${b}`));
    console.log(`\nTotal: ${baselines.length} baselines\n`);
  });
});
