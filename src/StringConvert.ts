/* Convert options */
interface Option {
	newline?: Newline; // Converts newline
	trim?: boolean; // Remove whitespace at both ends (Only one of `trim` and `trimMultiLine` can be specified)
	trimMultiLine?: boolean; // Remove whitespace at both ends of each line (Only one of `trim` and `trimMultiLine` can be specified)
	noBlankLine?: boolean; // Delete blank lines
	toHankakuEisu?: boolean; // Make alphanumeric characters half-width (Only one of `toHankakuEisu` and toZenkakuEisu` can be specified)
	toZenkakuEisu?: boolean; // Make alphanumeric characters full-width (Only one of `toHankakuEisu` and toZenkakuEisu` can be specified)
	toHankakuSpace?: boolean; // Make full-width space half-width (IDEOGRAPHIC SPACE: U+3000 → SPACE: U+0020)
	combineSpace?: boolean; // Consolidate contiguous spaces
	toLowerCase?: boolean; // Make the alphabet lowercase (Only one of `toLowerCase` and `toUpperCase` can be specified)
	toUpperCase?: boolean; // Make the alphabet uppercase (Only one of `toLowerCase` and `toUpperCase` can be specified)
	table?: Table; // Proprietary conversion table (An associative array that specifies the character string before conversion as the key and the character string after conversion as the value)
}

/* Converts newline */
type Newline = 'CR' | 'LF' | 'CRLF';

/* Proprietary conversion table */
interface Table {
	[key: string]: string;
}

/**
 * Converts newlines in a string, `trim()`, half-width / full-width conversion, etc
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
	static convert(text: string, options: Option): string {
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
		} else if (options.trimMultiLine === true) {
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
		} else if (options.toZenkakuEisu === true) {
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
		} else if (options.toUpperCase) {
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

	static #judgeNewlineCode(text: string): string | null {
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
		} else if (existLf) {
			return LF;
		} else if (existCrlf) {
			return CRLF;
		}

		return null;
	}
}
