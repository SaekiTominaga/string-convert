interface Option {
    newline?: Newline;
    trim?: boolean;
    trimMultiLine?: boolean;
    noBlankLine?: boolean;
    toHankakuEisu?: boolean;
    toZenkakuEisu?: boolean;
    toHankakuSpace?: boolean;
    combineSpace?: boolean;
    toLowerCase?: boolean;
    toUpperCase?: boolean;
    table?: Table;
}
declare type Newline = 'CR' | 'LF' | 'CRLF';
interface Table {
    [key: string]: string;
}
/**
 * Performs conversions such as `trim()` and hankaku / zenkaku conversion.
 */
export default class {
    #private;
    /**
     * Convert execution
     *
     * @param {string} text - Text to be converted
     * @param {Option} options - Conversion options
     *
     * @returns {string} Converted text
     */
    static convert(text: string, options: Option): string;
}
export {};
//# sourceMappingURL=StringConvert.d.ts.map