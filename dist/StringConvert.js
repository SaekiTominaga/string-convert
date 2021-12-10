/**
 * Performs conversions such as `trim()` and hankaku / zenkaku conversion.
 */
export default class {
    /**
     * Convert execution
     *
     * @param {string} text - Text to be converted
     * @param {Option} options - Conversion options
     *
     * @returns {string} Converted text
     */
    static convert(text, options) {
        const SPACE = '\u0020'; // 半角スペース
        const IDEOGRAPHIC_SPACE = '\u3000'; // 全角スペース
        const newline = this.#judgeNewlineCode(text);
        let convertedText = text;
        let normalizedNewline = newline;
        if (options.newline !== undefined && newline !== null) {
            switch (options.newline) {
                case 'CR': {
                    normalizedNewline = '\r';
                    break;
                }
                case 'LF': {
                    normalizedNewline = '\n';
                    break;
                }
                case 'CRLF': {
                    normalizedNewline = '\r\n';
                    break;
                }
            }
            convertedText = convertedText.replaceAll(newline, normalizedNewline);
        }
        if (options.trim === true) {
            /* 両端の空白を削除 */
            convertedText = convertedText.trim();
        }
        else if (options.trimMultiLine === true) {
            /* 行ごとに両端の空白を削除 */
            convertedText = convertedText.trim();
            if (normalizedNewline !== null) {
                convertedText = convertedText
                    .split(normalizedNewline)
                    .map((currentValue) => currentValue.trim())
                    .join(normalizedNewline);
            }
        }
        if (options.noBlankLine === true && normalizedNewline !== null) {
            /* 空行を削除 */
            convertedText = convertedText.replaceAll(new RegExp(`[${normalizedNewline}]+`, 'g'), normalizedNewline);
        }
        if (options.toHankakuEisu === true) {
            /* 英数字を半角化 */
            convertedText = convertedText.replaceAll(/[ａ-ｚＡ-Ｚ０-９]/g, (str) => String.fromCharCode(str.charCodeAt(0) - 0xfee0));
        }
        else if (options.toZenkakuEisu === true) {
            /* 英数字を全角化 */
            convertedText = convertedText.replaceAll(/[a-zA-Z0-9]/g, (str) => String.fromCharCode(str.charCodeAt(0) + 0xfee0));
        }
        if (options.toHankakuSpace === true) {
            /* 全角スペースを半角化 */
            convertedText = convertedText.replaceAll(IDEOGRAPHIC_SPACE, SPACE);
        }
        if (options.combineSpace === true) {
            /* 連続したスペースを統合 */
            convertedText = convertedText.replaceAll(new RegExp(`${SPACE}+`, 'g'), SPACE);
        }
        if (options.toLowerCase === true) {
            /* 小文字化 */
            convertedText = convertedText.toLowerCase();
        }
        else if (options.toUpperCase) {
            /* 大文字化 */
            convertedText = convertedText.toUpperCase();
        }
        if (options.table !== undefined) {
            /* 変換テーブルによる変換 */
            for (const [searchValue, replaceValue] of Object.entries(options.table)) {
                convertedText = convertedText.replaceAll(searchValue, replaceValue);
            }
        }
        return convertedText;
    }
    static #judgeNewlineCode(text) {
        const CR = '\r';
        const LF = '\n';
        const CRLF = `${CR}${LF}`;
        const existCr = new RegExp(`${CR}(?!${LF})`).test(text);
        const existLf = new RegExp(`(?<!${CR})${LF}`).test(text);
        const existCrlf = text.includes(CRLF);
        if (existCr && existLf) {
            throw new Error('Multiple newline codes are mixed. (CR, LF)');
        }
        if (existCr && existCrlf) {
            throw new Error('Multiple newline codes are mixed. (CR, CR+LF)');
        }
        if (existLf && existCrlf) {
            throw new Error('Multiple newline codes are mixed. (LF, CR+LF)');
        }
        if (existCr) {
            return CR;
        }
        else if (existLf) {
            return LF;
        }
        else if (existCrlf) {
            return CRLF;
        }
        return null;
    }
}
//# sourceMappingURL=StringConvert.js.map