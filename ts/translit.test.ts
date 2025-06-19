/**
 * Test suite for Russkaya Latinica TypeScript implementation
 * Mirrors the comprehensive tests from latinica_test.go
 */

import { translit, revertTranslit } from './translit';

describe('Russkaya Latinica TypeScript Implementation', () => {
  describe('Single Character Round Trip Tests', () => {
    const singleChars = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];

    test.each(singleChars)('Round trip for character: %s', (char) => {
      const transliterated = translit(char);
      const reverted = revertTranslit(transliterated);
      expect(reverted).toBe(char);
    });
  });

  describe('Specific Sequences', () => {
    const testCases = [
      { cyrillic: 'ъе', latin: 'hyye' },
      { cyrillic: 'Съе', latin: 'Syye' },
      { cyrillic: 'съе', latin: 'syye' },
      { cyrillic: 'ь', latin: 'hj' },
      { cyrillic: 'сь', latin: 'sj' },
      { cyrillic: 'шь', latin: 'shj' },
      { cyrillic: 'й', latin: 'j' },
      { cyrillic: 'сй', latin: 'syj' },
    ];

    test.each(testCases)('Translit $cyrillic -> $latin', ({ cyrillic, latin }) => {
      const result = translit(cyrillic);
      expect(result).toBe(latin);
    });

    test.each(testCases)('RevertTranslit $latin -> $cyrillic', ({ cyrillic, latin }) => {
      const result = revertTranslit(latin);
      expect(result).toBe(cyrillic);
    });
  });

  describe('Complex Sentences Round Trip', () => {
    const testCases = [
      'МКС',
      'ЮНЕСКО',
      'Петров Ю. Я.',
      'Русская Латиница',
    ];

    test.each(testCases)('Round trip for: %s', (testCase) => {
      const transliterated = translit(testCase);
      const reverted = revertTranslit(transliterated);
      expect(reverted).toBe(testCase);
    });
  });

  describe('Transliteration Examples', () => {
    const examples: Record<string, string> = {
      'Съешь же ещё этих мягких французских булок, да выпей чаю.': 'Syyeshj zhe yesjhyo etikh myagkikh francuzskikh bulok, da vyipej chayu.',
      'интервьюер': 'intervjyuyer',
      'Йемен': 'Jyemen',
    };

    test.each(Object.entries(examples))('Translit: %s -> %s', (cyrillic, expectedLatin) => {
      const result = translit(cyrillic);
      expect(result).toBe(expectedLatin);
    });
  });

  describe('Context-Dependent Rules', () => {
    describe('е/Е rules', () => {
      test('е after consonant -> e', () => {
        expect(translit('се')).toBe('se');
        expect(translit('де')).toBe('de');
        expect(translit('не')).toBe('ne');
      });

      test('е after non-consonant -> ye', () => {
        expect(translit('ае')).toBe('aye');
        expect(translit('ъе')).toBe('hyye');
        expect(translit('ье')).toBe('hjye');
      });

      test('Е uppercase variants', () => {
        expect(translit('СЕ')).toBe('SE');
        expect(translit('АЕ')).toBe('AYE');
      });
    });

    describe('э/Э rules', () => {
      test('э after non-consonant -> e', () => {
        expect(translit('аэ')).toBe('ae');
        expect(translit('ъэ')).toBe('hye');
      });

      test('э after consonant -> e', () => {
        expect(translit('сэ')).toBe('se');
        expect(translit('дэ')).toBe('de');
      });
    });

    describe('й/Й rules', () => {
      test('й after non-consonant -> j', () => {
        expect(translit('ай')).toBe('aj');
        expect(translit('ей')).toBe('yej');
      });

      test('й after consonant -> yj', () => {
        expect(translit('сй')).toBe('syj');
        expect(translit('дй')).toBe('dyj');
      });
    });

    describe('ь/Ь rules', () => {
      test('ь after consonant -> j', () => {
        expect(translit('сь')).toBe('sj');
        expect(translit('шь')).toBe('shj');
        expect(translit('дь')).toBe('dj');
      });

      test('ь after non-consonant -> hj', () => {
        expect(translit('аь')).toBe('ahj');
        expect(translit('ъь')).toBe('hyhj');
      });
    });

    describe('ъ/Ъ rules', () => {
      test('ъ after consonant -> y', () => {
        expect(translit('съ')).toBe('sy');
        expect(translit('дъ')).toBe('dy');
      });

      test('ъ after non-consonant -> hy', () => {
        expect(translit('аъ')).toBe('ahy');
        expect(translit('ъъ')).toBe('hyhy');
      });
    });

    describe('ы/Ы rules', () => {
      test('ы always -> yi', () => {
        expect(translit('ы')).toBe('yi');
        expect(translit('сы')).toBe('syi');
        expect(translit('Ы')).toBe('Yi'); // Follow Go implementation case handling
      });
    });
  });

  describe('Case Handling', () => {
    test('Single uppercase letter at word boundary', () => {
      expect(translit('Съешь')).toBe('Syyeshj');
      expect(translit('Же')).toBe('Zhe');
    });

    test('All caps sequences preserved', () => {
      expect(translit('МКС')).toBe('MKS');
      expect(translit('ЮНЕСКО')).toBe('YUNESKO');
    });

    test('Mixed case handling', () => {
      expect(translit('Петров')).toBe('Petrov');
      expect(translit('ПЕТРОВ')).toBe('PETROV');
    });
  });

  describe('Special Characters and Non-Letters', () => {
    test('Punctuation preserved', () => {
      expect(translit('Съешь!')).toBe('Syyeshj!');
      expect(translit('Привет, мир.')).toBe('Privet, mir.');
    });

    test('Numbers preserved', () => {
      expect(translit('2023 год')).toBe('2023 god');
    });

    test('Spaces preserved', () => {
      expect(translit('Русская Латиница')).toBe('Russkaya Latinica');
    });
  });

  describe('Edge Cases', () => {
    test('Empty string', () => {
      expect(translit('')).toBe('');
      expect(revertTranslit('')).toBe('');
    });

    test('Single characters', () => {
      expect(translit('а')).toBe('a');
      expect(revertTranslit('a')).toBe('а');
    });

    test('Non-Cyrillic text unchanged', () => {
      expect(translit('Hello World')).toBe('Hello World');
      // Note: revertTranslit might change some Latin letters to Cyrillic if they match transliteration patterns
      // This is expected behavior - revertTranslit assumes the input IS transliterated text
      expect(revertTranslit('123 !@#')).toBe('123 !@#'); // Non-letter characters should be unchanged
    });
  });

  describe('Performance Tests', () => {
    test('Long text handling', () => {
      const longText = 'Съешь же ещё этих мягких французских булок, да выпей чаю. '.repeat(100);
      const transliterated = translit(longText);
      const reverted = revertTranslit(transliterated);
      expect(reverted).toBe(longText);
    });
  });

  describe('Reverse Mapping Priority', () => {
    test('Multi-character sequences have priority over single characters', () => {
      // "шь" -> "shj" should revert back to "шь", not "ш" + "ь"
      expect(revertTranslit('shj')).toBe('шь');
      
      // "съе" -> "syye" should revert back to "съе"
      expect(revertTranslit('syye')).toBe('съе');
      
      // "йе" -> "jye" should revert back to "йе"
      expect(revertTranslit('jye')).toBe('йе');
    });

    test('Longest match wins', () => {
      // "yye" should map to "ъе", not "y" + "ye"
      expect(revertTranslit('yye')).toBe('ъе');
      
      // "sjh" should map to "щ", not "s" + "jh"
      expect(revertTranslit('sjh')).toBe('щ');
    });
  });

  describe('Hard Sign Special Cases', () => {
    test('Hard sign followed by е gets special treatment', () => {
      expect(translit('ъе')).toBe('hyye');
      expect(translit('съе')).toBe('syye');
      expect(translit('Съе')).toBe('Syye');
    });

    test('Hard sign context affects following е', () => {
      // After hard sign, е should become "ye" regardless of normal context rules
      expect(translit('съешь')).toBe('syyeshj');
    });
  });
});