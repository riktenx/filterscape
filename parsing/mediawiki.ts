export type Token = {
  readonly type: TokenType;
  readonly value: string;
  readonly location: Location;
};

export type Location = {
  readonly line: number;
  readonly char: number;
};

export enum TokenType {
  SPACE,
  TAB,
  NEWLINE,
  EQUAL,
  LINK_START,
  LINK_END,
  PIPE,
  WORD,
  UNTOKENIZED,
}

export class Lexer {
  private static readonly STATICS = {
    '[[': TokenType.LINK_START,
    ']]': TokenType.LINK_END,
    '=': TokenType.EQUAL,
    '|': TokenType.PIPE,
    ' ': TokenType.SPACE,
    ['\t']: TokenType.TAB,
    ['\n']: TokenType.NEWLINE,
  };

  private readonly input: string;

  private tokens: Token[] = [];
  private cOffset: number = 0;
  private cLine: number = 1;
  private cChar: number = 1;

  constructor(input: string) {
    this.input = input.trim().replaceAll('\r', '');
  }

  tokenize(): Token[] {
    while (this.cOffset < this.input.length) {
      if (this.tokenizeStatic()) {
        continue;
      }

      const c = this.input.charAt(this.cOffset);
      if (isAlphanumeric(c)) {
        this.tokenizeWord();
      } else {
        this.pushToken(TokenType.UNTOKENIZED, c);
        ++this.cOffset;
        ++this.cChar;
      }
    }

    return this.tokens;
  }

  private tokenizeStatic(): boolean {
    for (const [value, type] of Object.entries(Lexer.STATICS)) {
      if (this.input.startsWith(value, this.cOffset)) {
        this.pushToken(type, value);
        this.cChar += value.length;
        this.cOffset += value.length;
        if (value === '\n') {
          this.cLine += 1;
          this.cChar = 1;
        }
        return true;
      }
    }
    return false;
  }

  private tokenizeWord() {
    const start = this.cOffset;
    while (isAlphanumeric(this.input.charAt(this.cOffset))) {
      ++this.cOffset;
    }

    const value = this.input.substring(start, this.cOffset);
    this.pushToken(TokenType.WORD, value);
    this.cChar += value.length;
  }

  private pushToken(type: TokenType, value: string) {
    this.tokens.push({
      type,
      value,
      location: { line: this.cLine, char: this.cChar },
    });
  }
}

export class TokenStream {
  private readonly tokens: Token[];
  private readonly firstToken: Token;

  constructor(tokens: Token[]) {
    this.tokens = [...tokens];
    this.firstToken = tokens[0];
  }

  getTokens(): Token[] {
    return [...this.tokens];
  }

  hasTokens(): boolean {
    return this.tokens.some((t) => !isWhitespace(t));
  }

  peek(): Token {
    const token = this.tokens.find((t) => !isWhitespace(t));
    if (token === undefined) {
      throw new TokenStreamEOFError(this.firstToken);
    }
    return token;
  }

  take(includeWhitespace?: boolean): Token {
    while (this.tokens.length !== 0) {
      const next = this.tokens.shift()!!;
      if (includeWhitespace || !isWhitespace(next)) {
        return next;
      }
    }
    throw new TokenStreamEOFError(this.firstToken);
  }

  takeExpect(expect: TokenType): Token {
    if (!this.hasTokens()) {
      throw new TokenStreamEOFError(this.firstToken);
    }

    const first = this.take();
    if (first?.type !== expect) {
      throw new TokenStreamError('unexpected token', first);
    }
    return first;
  }

  peekLine(includeNewline?: boolean): TokenStream {
    const line = this.takeLine(true);
    this.tokens.unshift(...line.getTokens());
    if (!includeNewline) {
      line.tokens.pop();
    }
    return line;
  }

  takeLine(includeNewline?: boolean): TokenStream {
    const line: Token[] = [];
    while (this.tokens.length !== 0) {
      const next = this.tokens.shift()!!;
      if (next.type === TokenType.NEWLINE) {
        if (includeNewline) {
          line.push(next);
        }
        return new TokenStream(line);
      }
      line.push(next);
    }
    return new TokenStream(line);
  }

  toString(): string {
    return this.tokens.map((t) => t.value).join('');
  }
}

export class TokenStreamError extends Error {
  constructor(message: string, token: Token) {
    var loc = token.location;
    super(`${message} '${token.value}' at line ${loc.line}, char ${loc.char}`);
  }
}

export class TokenStreamEOFError extends Error {
  constructor(token: Token) {
    super(`unexpected end of token stream near line ${token.location.line}`);
  }
}

export const isAlphanumeric = (c: string): boolean =>
  (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9');

export const isWhitespace = (token: Token): boolean =>
  token.type === TokenType.SPACE ||
  token.type === TokenType.TAB ||
  token.type === TokenType.NEWLINE;

type WikiSection = {
  name: string;
  text: string;
};

const parseSections = (input: string): WikiSection[] => {
  const sections: WikiSection[] = [
    {
      name: '__pre__',
      text: '',
    },
  ];

  const tokens = new TokenStream(new Lexer(input).tokenize());

  while (tokens.hasTokens()) {
    var next = tokens.take(true);

    if (next.type === TokenType.EQUAL && next.location.char === 1) {
      const [section, ok] = parseSectionName(
        '=' + tokens.peekLine().toString()
      );
      if (!ok) {
        sections[sections.length - 1].text += next.value;
        continue;
      }

      tokens.takeLine();
      sections.push({
        name: section,
        text: '',
      });
    } else {
      sections[sections.length - 1].text += next.value;
    }
  }

  return sections;
};

const parseSectionName = (line: string): [string, boolean] => {
  const start = countStart(line, '=');
  const end = countEnd(line, '=');
  const whence = Math.min(start, end);

  return whence > 0
    ? [line.substring(whence, line.length - whence), true]
    : ['', false];
};

const countStart = (str: string, want: string): number => {
  let count = 0;
  for (const c of str) {
    if (c === want) {
      ++count;
    } else {
      break;
    }
  }
  return count;
};

const countEnd = (str: string, want: string): number => {
  let count = 0;
  for (let i = str.length - 1; i >= 0; --i) {
    if (str.charAt(i) === want) {
      ++count;
    } else {
      break;
    }
  }
  return count;
};

/*
const sections = parseSections('');
for (const section of sections) {
  console.log(section.name);

  const matches = section.text.match(/{{GEP\|[A-Za-z0-9' ]+}}/g);
  console.log(matches);
}
*/
