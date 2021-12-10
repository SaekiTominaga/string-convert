import StringConvert from '../src/StringConvert';

describe('README.md', () => {
	test('Sample 1', () => {
		expect(
			StringConvert.convert('foo\r\nbar', {
				newline: 'LF',
			})
		).toBe('foo\nbar');
	});
	test('Sample 2', () => {
		expect(
			StringConvert.convert('  foo  \r\n  bar  ', {
				trim: true,
			})
		).toBe('foo  \r\n  bar');
	});
	test('Sample 3', () => {
		expect(
			StringConvert.convert('  Ｆｏｏ  \r\n\r\n  Ｂａｒ　　　　　　Ｂａｚ💖  ', {
				newline: 'LF',
				trimMultiLine: true,
				noBlankLine: true,
				toHankakuEisu: true,
				toHankakuSpace: true,
				combineSpace: true,
				toLowerCase: true,
				table: {
					'💖': '⭐',
				},
			})
		).toBe('foo\nbar baz⭐');
	});
});

describe('変換', () => {
	test('newline (CR → LF)', () => {
		expect(
			StringConvert.convert('  hoge  \r\r\r  piyo  \r\r\r  fuga  ', {
				newline: 'LF',
			})
		).toBe('  hoge  \n\n\n  piyo  \n\n\n  fuga  ');
	});
	test('newline (CRLF → CR)', () => {
		expect(
			StringConvert.convert('  hoge  \r\n\r\n\r\n  piyo  \r\n\r\n\r\n  fuga  ', {
				newline: 'CR',
			})
		).toBe('  hoge  \r\r\r  piyo  \r\r\r  fuga  ');
	});
	test('newline (LF → CRLF)', () => {
		expect(
			StringConvert.convert('  hoge  \n\n\n  piyo  \n\n\n  fuga  ', {
				newline: 'CRLF',
			})
		).toBe('  hoge  \r\n\r\n\r\n  piyo  \r\n\r\n\r\n  fuga  ');
	});
	test('trim', () => {
		expect(
			StringConvert.convert('  hoge  \n\n\n  piyo    \n\n\n  fuga  ', {
				trim: true,
			})
		).toBe('hoge  \n\n\n  piyo    \n\n\n  fuga');
	});
	test('trimMultiLine (CR)', () => {
		expect(
			StringConvert.convert('  hoge  \r\r\r  piyo    \r\r\r  fuga  ', {
				trimMultiLine: true,
			})
		).toBe('hoge\r\r\rpiyo\r\r\rfuga');
	});
	test('trimMultiLine (LF)', () => {
		expect(
			StringConvert.convert('  hoge  \n\n\n  piyo    \n\n\n  fuga  ', {
				trimMultiLine: true,
			})
		).toBe('hoge\n\n\npiyo\n\n\nfuga');
	});
	test('trimMultiLine (CRLF)', () => {
		expect(
			StringConvert.convert('  hoge  \r\n\r\n\r\n  piyo    \r\n\r\n\r\n  fuga  ', {
				trimMultiLine: true,
			})
		).toBe('hoge\r\n\r\n\r\npiyo\r\n\r\n\r\nfuga');
	});
	test('noBlankLine (CR)', () => {
		expect(
			StringConvert.convert('  hoge  \r\r\r  piyo  \r\r\r  fuga  ', {
				noBlankLine: true,
			})
		).toBe('  hoge  \r  piyo  \r  fuga  ');
	});
	test('noBlankLine (LF)', () => {
		expect(
			StringConvert.convert('  hoge  \n\n\n  piyo  \n\n\n  fuga  ', {
				noBlankLine: true,
			})
		).toBe('  hoge  \n  piyo  \n  fuga  ');
	});
	test('noBlankLine (CRLF)', () => {
		expect(
			StringConvert.convert('  hoge  \r\n\r\n\r\n  piyo  \r\n\r\n\r\n  fuga  ', {
				noBlankLine: true,
			})
		).toBe('  hoge  \r\n  piyo  \r\n  fuga  ');
	});
	test('toHankakuEisu', () => {
		expect(
			StringConvert.convert(' ｈｏｇｅＨＯＧＥ１２３ ', {
				toHankakuEisu: true,
			})
		).toBe(' hogeHOGE123 ');
	});
	test('toZenkakuEisu', () => {
		expect(
			StringConvert.convert(' hogeHOGE123 ', {
				toZenkakuEisu: true,
			})
		).toBe(' ｈｏｇｅＨＯＧＥ１２３ ');
	});
	test('toHankakuSpace', () => {
		expect(
			StringConvert.convert('　hoge　', {
				toHankakuSpace: true,
			})
		).toBe(' hoge ');
	});
	test('combineSpace', () => {
		expect(
			StringConvert.convert('  hoge  ', {
				combineSpace: true,
			})
		).toBe(' hoge ');
	});
	test('toLowerCase', () => {
		expect(
			StringConvert.convert('  HOGE  ', {
				toLowerCase: true,
			})
		).toBe('  hoge  ');
	});
	test('toUpperCase', () => {
		expect(
			StringConvert.convert('  hoge  ', {
				toUpperCase: true,
			})
		).toBe('  HOGE  ');
	});
	test('table', () => {
		expect(
			StringConvert.convert('  hoge．．piyo  ', {
				table: {
					'．': '.',
				},
			})
		).toBe('  hoge..piyo  ');
	});
});

describe('改行コード', () => {
	test('CR + LF 混在', () => {
		expect(() => {
			StringConvert.convert('hoge\rpiyo\nfuga', {});
		}).toThrow('Multiple newline codes are mixed. (CR, LF)');
	});
	test('CR + CRLF 混在', () => {
		expect(() => {
			StringConvert.convert('hoge\rpiyo\r\nfuga', {});
		}).toThrow('Multiple newline codes are mixed. (CR, CR+LF)');
	});
	test('LF + CR 混在', () => {
		expect(() => {
			StringConvert.convert('hoge\npiyo\rfuga', {});
		}).toThrow('Multiple newline codes are mixed. (CR, LF)');
	});
	test('LF + CRLF 混在', () => {
		expect(() => {
			StringConvert.convert('hoge\npiyo\r\nfuga', {});
		}).toThrow('Multiple newline codes are mixed. (LF, CR+LF)');
	});
	test('CRLF + CR 混在', () => {
		expect(() => {
			StringConvert.convert('hoge\r\npiyo\rfuga', {});
		}).toThrow('Multiple newline codes are mixed. (CR, CR+LF)');
	});
	test('CRLF + LF 混在', () => {
		expect(() => {
			StringConvert.convert('hoge\r\npiyo\nfuga', {});
		}).toThrow('Multiple newline codes are mixed. (LF, CR+LF)');
	});
});
