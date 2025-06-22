/**
 * Russkaya Latinica - TypeScript implementation
 * Based on the Cyrillic to Latin transliteration system
 */
(function() {
    "use strict";
    var ElementType;
    (function (ElementType) {
        ElementType[ElementType["Consonant"] = 0] = "Consonant";
        ElementType[ElementType["Vowel"] = 1] = "Vowel";
        ElementType[ElementType["Other"] = 2] = "Other";
        ElementType[ElementType["NonLetter"] = 3] = "NonLetter";
    })(ElementType || (ElementType = {}));
    var ContextType;
    (function (ContextType) {
        ContextType[ContextType["Unset"] = 0] = "Unset";
        ContextType[ContextType["Consonant"] = 1] = "Consonant";
        ContextType[ContextType["Vowel"] = 2] = "Vowel";
        ContextType[ContextType["Other"] = 3] = "Other";
        ContextType[ContextType["NonLetter"] = 4] = "NonLetter";
        ContextType[ContextType["Any"] = 5] = "Any";
        ContextType[ContextType["NonConsonant"] = 6] = "NonConsonant";
        ContextType[ContextType["NonVowel"] = 7] = "NonVowel";
        ContextType[ContextType["NonOther"] = 8] = "NonOther";
        ContextType[ContextType["Letter"] = 9] = "Letter";
        ContextType[ContextType["HardSign"] = 10] = "HardSign";
    })(ContextType || (ContextType = {}));
    // Create a mapping for quick lookup of element types
    const elementTypeMap = new Map([
        // Vowels
        ['а', ElementType.Vowel], ['А', ElementType.Vowel],
        ['е', ElementType.Vowel], ['Е', ElementType.Vowel],
        ['ё', ElementType.Vowel], ['Ё', ElementType.Vowel],
        ['и', ElementType.Vowel], ['И', ElementType.Vowel],
        ['о', ElementType.Vowel], ['О', ElementType.Vowel],
        ['у', ElementType.Vowel], ['У', ElementType.Vowel],
        ['э', ElementType.Vowel], ['Э', ElementType.Vowel],
        ['ю', ElementType.Vowel], ['Ю', ElementType.Vowel],
        ['я', ElementType.Vowel], ['Я', ElementType.Vowel],
        ['ы', ElementType.Vowel], ['Ы', ElementType.Vowel],
        // Consonants
        ['б', ElementType.Consonant], ['Б', ElementType.Consonant],
        ['в', ElementType.Consonant], ['В', ElementType.Consonant],
        ['г', ElementType.Consonant], ['Г', ElementType.Consonant],
        ['д', ElementType.Consonant], ['Д', ElementType.Consonant],
        ['ж', ElementType.Consonant], ['Ж', ElementType.Consonant],
        ['з', ElementType.Consonant], ['З', ElementType.Consonant],
        ['к', ElementType.Consonant], ['К', ElementType.Consonant],
        ['л', ElementType.Consonant], ['Л', ElementType.Consonant],
        ['м', ElementType.Consonant], ['М', ElementType.Consonant],
        ['н', ElementType.Consonant], ['Н', ElementType.Consonant],
        ['п', ElementType.Consonant], ['П', ElementType.Consonant],
        ['р', ElementType.Consonant], ['Р', ElementType.Consonant],
        ['с', ElementType.Consonant], ['С', ElementType.Consonant],
        ['т', ElementType.Consonant], ['Т', ElementType.Consonant],
        ['ф', ElementType.Consonant], ['Ф', ElementType.Consonant],
        ['х', ElementType.Consonant], ['Х', ElementType.Consonant],
        ['ц', ElementType.Consonant], ['Ц', ElementType.Consonant],
        ['ч', ElementType.Consonant], ['Ч', ElementType.Consonant],
        ['ш', ElementType.Consonant], ['Ш', ElementType.Consonant],
        ['щ', ElementType.Consonant], ['Щ', ElementType.Consonant],
        // Special cases
        ['й', ElementType.Vowel], ['Й', ElementType.Vowel], // It's actually a semivowel
        ['ь', ElementType.Other], ['Ь', ElementType.Other], // Soft sign - treat as other for context
        ['ъ', ElementType.Other], ['Ъ', ElementType.Other], // Hard sign
    ]);
    function buildScriptTable() {
        // Based on the user's official Russkaya Latinica table
        const cells = [
            // Simple mappings first (no context dependencies)
            { cyrl: "а", latn: "a", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "б", latn: "b", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "в", latn: "v", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "г", latn: "g", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "д", latn: "d", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "ё", latn: "yo", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "ж", latn: "zh", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "з", latn: "z", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "и", latn: "i", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "к", latn: "k", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "л", latn: "l", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "м", latn: "m", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "н", latn: "n", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "о", latn: "o", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "п", latn: "p", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "р", latn: "r", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "с", latn: "s", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "т", latn: "t", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "у", latn: "u", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "ф", latn: "f", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "х", latn: "kh", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "ц", latn: "c", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "ч", latn: "ch", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "ш", latn: "sh", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "щ", latn: "sjh", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "э", latn: "e", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "ю", latn: "yu", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "я", latn: "ya", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            // Uppercase versions
            { cyrl: "А", latn: "A", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Б", latn: "B", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "В", latn: "V", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Г", latn: "G", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Д", latn: "D", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Ё", latn: "YO", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Ж", latn: "ZH", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "З", latn: "Z", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "И", latn: "I", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "К", latn: "K", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Л", latn: "L", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "М", latn: "M", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Н", latn: "N", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "О", latn: "O", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "П", latn: "P", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Р", latn: "R", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "С", latn: "S", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Т", latn: "T", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "У", latn: "U", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Ф", latn: "F", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Х", latn: "KH", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Ц", latn: "C", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Ч", latn: "CH", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Ш", latn: "SH", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Щ", latn: "SJH", elementType: ElementType.Consonant, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Э", latn: "E", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Ю", latn: "YU", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Я", latn: "YA", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            // Context-dependent rules exactly from Swift implementation
            // е rules
            { cyrl: "е", latn: "ye", elementType: ElementType.Vowel, prefixContext: ContextType.NonConsonant, postfixContext: ContextType.Unset },
            { cyrl: "е", latn: "e", elementType: ElementType.Vowel, prefixContext: ContextType.Consonant, postfixContext: ContextType.Unset },
            { cyrl: "Е", latn: "YE", elementType: ElementType.Vowel, prefixContext: ContextType.NonConsonant, postfixContext: ContextType.Unset },
            { cyrl: "Е", latn: "E", elementType: ElementType.Vowel, prefixContext: ContextType.Consonant, postfixContext: ContextType.Unset },
            // э rules (opposite of е rules)
            { cyrl: "э", latn: "ye", elementType: ElementType.Vowel, prefixContext: ContextType.NonConsonant, postfixContext: ContextType.Unset },
            { cyrl: "э", latn: "e", elementType: ElementType.Vowel, prefixContext: ContextType.Consonant, postfixContext: ContextType.Unset },
            { cyrl: "Э", latn: "YE", elementType: ElementType.Vowel, prefixContext: ContextType.NonConsonant, postfixContext: ContextType.Unset },
            { cyrl: "Э", latn: "E", elementType: ElementType.Vowel, prefixContext: ContextType.Consonant, postfixContext: ContextType.Unset },
            // й rules
            { cyrl: "й", latn: "j", elementType: ElementType.Vowel, prefixContext: ContextType.NonConsonant, postfixContext: ContextType.Unset },
            { cyrl: "й", latn: "yj", elementType: ElementType.Vowel, prefixContext: ContextType.Consonant, postfixContext: ContextType.Unset },
            { cyrl: "Й", latn: "J", elementType: ElementType.Vowel, prefixContext: ContextType.NonConsonant, postfixContext: ContextType.Unset },
            { cyrl: "Й", latn: "YJ", elementType: ElementType.Vowel, prefixContext: ContextType.Consonant, postfixContext: ContextType.Unset },
            // ь rules
            { cyrl: "ь", latn: "j", elementType: ElementType.Vowel, prefixContext: ContextType.Consonant, postfixContext: ContextType.Unset },
            { cyrl: "ь", latn: "hj", elementType: ElementType.Vowel, prefixContext: ContextType.NonConsonant, postfixContext: ContextType.Unset },
            { cyrl: "Ь", latn: "J", elementType: ElementType.Vowel, prefixContext: ContextType.Consonant, postfixContext: ContextType.Unset },
            { cyrl: "Ь", latn: "HJ", elementType: ElementType.Vowel, prefixContext: ContextType.NonConsonant, postfixContext: ContextType.Unset },
            // ы rules
            { cyrl: "ы", latn: "yi", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            { cyrl: "Ы", latn: "YI", elementType: ElementType.Vowel, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
            // ъ rules (simplified based on test analysis)
            { cyrl: "ъ", latn: "y", elementType: ElementType.Other, prefixContext: ContextType.Consonant, postfixContext: ContextType.Unset },
            { cyrl: "ъ", latn: "hy", elementType: ElementType.Other, prefixContext: ContextType.NonConsonant, postfixContext: ContextType.Unset },
            { cyrl: "Ъ", latn: "Y", elementType: ElementType.Other, prefixContext: ContextType.Consonant, postfixContext: ContextType.Unset },
            { cyrl: "Ъ", latn: "HY", elementType: ElementType.Other, prefixContext: ContextType.NonConsonant, postfixContext: ContextType.Unset },
            // Add special е/Е rule after hard sign
            { cyrl: "е", latn: "ye", elementType: ElementType.Vowel, prefixContext: ContextType.HardSign, postfixContext: ContextType.Unset },
            { cyrl: "Е", latn: "YE", elementType: ElementType.Vowel, prefixContext: ContextType.HardSign, postfixContext: ContextType.Unset },
            // Special characters
            { cyrl: "ѵ", latn: "y", elementType: ElementType.Other, prefixContext: ContextType.Unset, postfixContext: ContextType.Unset },
        ];
        // Set default contexts where not specified
        for (const cell of cells) {
            if (cell.prefixContext === ContextType.Unset && cell.postfixContext === ContextType.Unset) {
                cell.prefixContext = ContextType.Any;
                cell.postfixContext = ContextType.Any;
            }
            else if (cell.prefixContext !== ContextType.Unset && cell.postfixContext === ContextType.Unset) {
                cell.postfixContext = ContextType.Any;
            }
            else if (cell.prefixContext === ContextType.Unset && cell.postfixContext !== ContextType.Unset) {
                cell.prefixContext = ContextType.Any;
            }
        }
        return cells;
    }
    // Define the mapping table
    const ruScriptTable = buildScriptTable();
    function contextMatches(ctx, elementType, prevChar) {
        switch (ctx) {
            case ContextType.Unset:
            case ContextType.Any:
                return true;
            case ContextType.Consonant:
                return elementType === ElementType.Consonant;
            case ContextType.Vowel:
                return elementType === ElementType.Vowel;
            case ContextType.Other:
                return elementType === ElementType.Other;
            case ContextType.NonLetter:
                return elementType === ElementType.NonLetter;
            case ContextType.NonConsonant:
                return elementType !== ElementType.Consonant;
            case ContextType.NonVowel:
                return elementType !== ElementType.Vowel;
            case ContextType.NonOther:
                return elementType !== ElementType.Other;
            case ContextType.Letter:
                return elementType !== ElementType.NonLetter;
            case ContextType.HardSign:
                return prevChar === 'ъ' || prevChar === 'Ъ';
        }
        return false;
    }
    function getElementType(char) {
        if (!isLetter(char)) {
            return ElementType.NonLetter;
        }
        const elementType = elementTypeMap.get(char);
        if (elementType !== undefined) {
            return elementType;
        }
        // Default for unknown letters
        return ElementType.Other;
    }
    function isLetter(char) {
        return /\p{L}/u.test(char);
    }
    // Check if we're at a word boundary (for proper case handling)
    function isWordBoundary(chars, pos) {
        if (pos === 0 || pos >= chars.length) {
            return true;
        }
        const prevIsLetter = isLetter(chars[pos - 1]);
        const currIsLetter = pos < chars.length && isLetter(chars[pos]);
        return !prevIsLetter && currIsLetter;
    }
    // Check if the next character is also uppercase (for handling abbreviations)
    function isFollowedByUppercase(chars, pos) {
        if (pos + 1 >= chars.length) {
            return false;
        }
        return chars[pos + 1] === chars[pos + 1].toUpperCase() && isLetter(chars[pos + 1]);
    }
    // Check if the previous character is also uppercase
    function isPrecededByUppercase(chars, pos) {
        if (pos === 0) {
            return false;
        }
        return chars[pos - 1] === chars[pos - 1].toUpperCase() && isLetter(chars[pos - 1]);
    }
    // Apply proper case to transliterated text
    function applyProperCase(input, isUppercase, isAtWordBoundary, followedByUpper, precededByUpper) {
        if (!isUppercase) {
            return input;
        }
        // If it's part of an all-caps sequence, keep it uppercase
        if (precededByUpper || followedByUpper) {
            return input;
        }
        // If it's a single uppercase letter at word boundary, capitalize only the first letter
        if (isAtWordBoundary && input.length > 1) {
            return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
        }
        // Otherwise, keep it uppercase
        return input.toUpperCase();
    }
    /**
     * Converts Cyrillic text to Latin using Russkaya Latinica
     */
    function translit(input) {
        if (!input) {
            return "";
        }
        const chars = Array.from(input);
        const result = [];
        for (let i = 0; i < chars.length; i++) {
            // Determine prefix context
            let prefixType;
            if (i === 0) {
                prefixType = ElementType.NonLetter;
            }
            else {
                prefixType = getElementType(chars[i - 1]);
            }
            // Try to match the current character
            let matched = false;
            const currentChar = chars[i];
            // Determine postfix context
            let postfixType;
            if (i + 1 >= chars.length) {
                postfixType = ElementType.NonLetter;
            }
            else {
                postfixType = getElementType(chars[i + 1]);
            }
            // Find matching cell
            const prevChar = i > 0 ? chars[i - 1] : "";
            const nextChar = i + 1 < chars.length ? chars[i + 1] : "";
            for (const cell of ruScriptTable) {
                if (cell.cyrl === currentChar &&
                    contextMatches(cell.prefixContext, prefixType, prevChar) &&
                    contextMatches(cell.postfixContext, postfixType, nextChar)) {
                    // Apply proper case handling
                    let transliterated = cell.latn;
                    if (currentChar === currentChar.toUpperCase() && isLetter(currentChar)) {
                        const isAtBoundary = isWordBoundary(chars, i);
                        const isFollowedByUpper = isFollowedByUppercase(chars, i);
                        const isPrecededByUpper = isPrecededByUppercase(chars, i);
                        transliterated = applyProperCase(transliterated, true, isAtBoundary, isFollowedByUpper, isPrecededByUpper);
                    }
                    result.push(transliterated);
                    matched = true;
                    break;
                }
            }
            // If no match found, copy the character as is
            if (!matched) {
                result.push(currentChar);
            }
        }
        return result.join("");
    }
    // Build reverse mapping table - will be initialized when needed
    let reverseTable = null;
    function buildReverseTable() {
        const table = new Map();
        // Build the reverse mapping from the actual rules
        // Since we guarantee one-to-one conversion, we need to ensure
        // each Latin sequence maps to exactly one Cyrillic sequence
        // First, handle single characters in isolation
        const singleChars = "абвгдеёжзийклмнопрстуфхцчшщыэюяъь";
        for (const char of singleChars) {
            const latinSeq = translit(char);
            const latinLower = latinSeq.toLowerCase();
            const cyrlLower = char.toLowerCase();
            if (!table.has(latinLower)) {
                table.set(latinLower, cyrlLower);
            }
        }
        // Handle uppercase versions
        const upperChars = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЭЮЯЪЬ";
        for (const char of upperChars) {
            const latinSeq = translit(char);
            const latinLower = latinSeq.toLowerCase();
            const cyrlLower = char.toLowerCase();
            if (!table.has(latinLower)) {
                table.set(latinLower, cyrlLower);
            }
        }
        // Handle special context-dependent cases
        const contextCases = [
            "же", // Put же first to ensure it gets priority over жэ in reverse mapping
            "ъе", "ъэ", "съ", "дъ", "ъа", "хъ",
            "Съе", "съе", "тъе", "нъе", // consonant + hard sign + vowel cases
            "ье", "сь", "дь", "нь", "ль",
            "шь", "жь", "чь", "щь", // consonant + soft sign cases
            "йе", "сй", "дй", "ный",
            "се", "де", "не", "те", "ре", "пе", "ле", "ме", "ке", "бе", "ве", "фе", "ге", "хе", "це", "зе",
            "жэ", // жэ comes after же, so же takes priority
            "эе", "эа", "эо", "эу",
        ];
        for (const cyrlSeq of contextCases) {
            const actualLatin = translit(cyrlSeq);
            const latinLower = actualLatin.toLowerCase();
            const cyrlLower = cyrlSeq.toLowerCase();
            if (!table.has(latinLower)) {
                table.set(latinLower, cyrlLower);
            }
            else {
                // Always prefer "же" over "жэ" for "zhe" mapping
                const existing = table.get(latinLower);
                if (cyrlLower === "же" && existing === "жэ") {
                    table.set(latinLower, cyrlLower);
                }
                else if (cyrlSeq.length > 1) {
                    // For multi-character sequences, prefer them over single chars
                    table.set(latinLower, cyrlLower);
                }
            }
            // Special handling: if this is "consonant + ъе", also add "yye" -> "ъе"
            const runeLen = Array.from(cyrlSeq).length;
            if (runeLen === 3 && cyrlSeq.endsWith("ъе")) {
                // "Съе" -> "Syye", so we want "yye" -> "ъе"
                const latinChars = Array.from(actualLatin);
                const cyrlChars = Array.from(cyrlSeq);
                const suffixLatin = latinChars.slice(1).join(""); // Skip first character (consonant)
                const suffixCyrl = cyrlChars.slice(1).join(""); // Skip first character (consonant)
                const suffixLatinLower = suffixLatin.toLowerCase();
                const suffixCyrlLower = suffixCyrl.toLowerCase();
                if (!table.has(suffixLatinLower)) {
                    table.set(suffixLatinLower, suffixCyrlLower);
                }
            }
            // Special handling: if this is "consonant + ь", also add suffix mappings
            if (runeLen === 2 && cyrlSeq.endsWith("ь")) {
                // "шь" -> "shj", so we want "shj" -> "шь"
                // This should be handled by the normal mapping, but let's ensure priority
                if (!table.has(latinLower)) {
                    table.set(latinLower, cyrlLower);
                }
                else {
                    // Prefer the multi-character sequence over individual characters
                    table.set(latinLower, cyrlLower);
                }
            }
        }
        // Force specific priorities for ambiguous cases
        // "же" is more common than "жэ", so it should be the default for "zhe"
        if (table.get("zhe") === "жэ") {
            table.set("zhe", "же");
        }
        return table;
    }
    /**
     * Converts Latin text back to Cyrillic
     */
    function revertTranslit(input) {
        if (!input) {
            return "";
        }
        // Initialize reverse table if not done yet
        if (!reverseTable) {
            reverseTable = buildReverseTable();
        }
        // Get all Latin sequences sorted by length (longest first)
        const latinSeqs = Array.from(reverseTable.keys()).sort((a, b) => b.length - a.length);
        const result = [];
        let i = 0;
        while (i < input.length) {
            let matched = false;
            // Try to match the longest possible Latin sequence
            for (const latinSeq of latinSeqs) {
                if (i + latinSeq.length <= input.length) {
                    // Extract the substring
                    const substr = input.slice(i, i + latinSeq.length);
                    const substrLower = substr.toLowerCase();
                    if (substrLower === latinSeq) {
                        // Found a match
                        let cyrlChar = reverseTable.get(latinSeq);
                        // Handle case preservation
                        if (substr.length > 0 && substr[0] === substr[0].toUpperCase() && isLetter(substr[0])) {
                            if (substr.length > 1 && substr[1] === substr[1].toUpperCase() && isLetter(substr[1])) {
                                // All uppercase
                                cyrlChar = cyrlChar.toUpperCase();
                            }
                            else {
                                // Title case
                                const cyrlChars = Array.from(cyrlChar);
                                if (cyrlChars.length > 0) {
                                    cyrlChars[0] = cyrlChars[0].toUpperCase();
                                    cyrlChar = cyrlChars.join("");
                                }
                            }
                        }
                        result.push(cyrlChar);
                        i += latinSeq.length;
                        matched = true;
                        break;
                    }
                }
            }
            // If no match found, copy the character as is
            if (!matched) {
                result.push(input[i]);
                i++;
            }
        }
        return result.join("");
    }

    // Export functions to global scope
    window.translit = translit;
    window.revertTranslit = revertTranslit;
    window.ElementType = ElementType;
    window.ContextType = ContextType;
})();
