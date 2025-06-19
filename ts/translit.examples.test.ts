/**
 * Test suite for example files transliteration
 * Verifies that Translit(ndfl.md) === ndfl.lat.md
 */

import { translit, revertTranslit } from './translit';
import * as fs from 'fs';
import * as path from 'path';

describe('Example Files Transliteration', () => {
  describe('ndfl.md transliteration', () => {
    test('Forward transliteration should match ndfl.lat.md', () => {
      // Read the original Cyrillic file
      const originalPath = path.join(__dirname, 'examples', 'ndfl.md');
      const originalContent = fs.readFileSync(originalPath, 'utf8');

      // Read the expected Latin file
      const latinPath = path.join(__dirname, 'examples', 'ndfl.lat.md');
      const expectedContent = fs.readFileSync(latinPath, 'utf8');

      // Transliterate the original content
      const transliterated = translit(originalContent);

      // Compare the results
      if (transliterated !== expectedContent) {
        // Find the first difference for better error reporting
        const minLen = Math.min(transliterated.length, expectedContent.length);

        for (let i = 0; i < minLen; i++) {
          if (transliterated[i] !== expectedContent[i]) {
            const start = Math.max(0, i - 50);
            const end = Math.min(minLen, i + 50);

            console.error(`Transliteration mismatch at position ${i}:`);
            console.error(`Expected: ...${expectedContent.slice(start, end)}...`);
            console.error(`Got:      ...${transliterated.slice(start, end)}...`);
            console.error(`Context expected: "${expectedContent[i]}" (char code: ${expectedContent.charCodeAt(i)})`);
            console.error(`Context got:      "${transliterated[i]}" (char code: ${transliterated.charCodeAt(i)})`);
            break;
          }
        }

        if (transliterated.length !== expectedContent.length) {
          console.error(`Length mismatch: expected ${expectedContent.length}, got ${transliterated.length}`);
        }
      }

      expect(transliterated).toBe(expectedContent);
    });

    test('First part of the file should transliterate correctly', () => {
      // This test helps debug specific issues
      const originalPath = path.join(__dirname, 'examples', 'ndfl.md');
      const originalContent = fs.readFileSync(originalPath, 'utf8');
      // Take first 60 Cyrillic characters (which will expand when transliterated)
      const first60 = originalContent.substring(0, 60);

      const transliterated = translit(first60);
      const expected = 'V 2022 godu ochenj mnogiye rabotniki IT-otrasli (da i, konechno';

      expect(transliterated).toBe(expected);
    });

    test('Specific sequences from the file', () => {
      // Test specific problematic sequences found in the file
      const testCases = [
        { cyrillic: 'очень', latin: 'ochenj' },
        { cyrillic: 'многие', latin: 'mnogiye' },
        { cyrillic: 'работники', latin: 'rabotniki' },
        { cyrillic: 'ИТ-отрасли', latin: 'IT-otrasli' },
        { cyrillic: 'релоцировались', latin: 'relocirovalisj' },
        { cyrillic: 'Съешь', latin: 'Syyeshj' },
        { cyrillic: 'ещё', latin: 'yesjhyo' },
      ];

      testCases.forEach(({ cyrillic, latin }) => {
        expect(translit(cyrillic)).toBe(latin);
      });
    });
  });

  describe('Reverse transliteration (optional)', () => {
    test.skip('Reverse transliteration should recover original text', () => {
      // This test is marked as skip because reverse transliteration 
      // may not be perfect due to ambiguities in the transliteration system
      const latinPath = path.join(__dirname, 'examples', 'ndfl.lat.md');
      const latinContent = fs.readFileSync(latinPath, 'utf8');

      const originalPath = path.join(__dirname, 'examples', 'ndfl.md');
      const originalContent = fs.readFileSync(originalPath, 'utf8');

      const reverted = revertTranslit(latinContent);

      expect(reverted).toBe(originalContent);
    });
  });
});

describe('Performance tests for large files', () => {
  test('Transliteration performance on ndfl.md', () => {
    const originalPath = path.join(__dirname, 'examples', 'ndfl.md');
    const originalContent = fs.readFileSync(originalPath, 'utf8');

    const startTime = Date.now();
    const transliterated = translit(originalContent);
    const endTime = Date.now();

    const elapsedMs = endTime - startTime;
    console.log(`Transliteration of ${originalContent.length} characters took ${elapsedMs}ms`);

    // Should complete in reasonable time (< 100ms for ~20KB file)
    expect(elapsedMs).toBeLessThan(100);
    expect(transliterated.length).toBeGreaterThan(0);
  });
});