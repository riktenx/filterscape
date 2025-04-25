import { Token, TokenType } from './token.ts'

export class Lexer {
    private static readonly STATICS = {
        '\\\n': TokenType.WHITESPACE,
        '#define': TokenType.PREPROC_DEFINE,
        ['apply']: TokenType.APPLY,
        ['false']: TokenType.FALSE,
        ['true']: TokenType.TRUE,
        ['meta']: TokenType.META,
        ['rule']: TokenType.RULE,
        ['if']: TokenType.IF,
        '&&': TokenType.OP_AND,
        '||': TokenType.OP_OR,
        '>=': TokenType.OP_GTEQ,
        '<=': TokenType.OP_LTEQ,
        '==': TokenType.OP_EQ,
        '!': TokenType.OP_NOT,
        '>': TokenType.OP_GT,
        '<': TokenType.OP_LT,
        ';': TokenType.STMT_END,
        ':': TokenType.COLON,
        '=': TokenType.ASSIGN,
        ',': TokenType.COMMA,
        '(': TokenType.EXPR_START,
        ')': TokenType.EXPR_END,
        '{': TokenType.BLOCK_START,
        '}': TokenType.BLOCK_END,
        '[': TokenType.LIST_START,
        ']': TokenType.LIST_END,
        '\n': TokenType.NEWLINE,
    }

    private readonly input: string

    // lexer state
    private tokens: Token[] = []
    private cOffset: number = 0
    private cLine: number = 1
    private cChar: number = 1

    constructor(input: string) {
        this.input = input.trim().replaceAll('\r', '') // fuck windows
    }

    tokenize(): Token[] {
        while (this.cOffset < this.input.length) {
            if (this.tokenizeStatic()) {
                continue
            }
            if (this.tokenizeComment()) {
                continue
            }

            const ch = this.input.charAt(this.cOffset)
            if (this.isTokenWhitespace(ch)) {
                this.tokenizeWhitespace()
            } else if (
                isNumeric(ch) ||
                (ch == '-' && isNumeric(this.input.charAt(this.cOffset + 1)))
            ) {
                this.tokenizeLiteralInt()
            } else if (ch == '"') {
                this.tokenizeLiteralString()
            } else if (isLegalIdent(ch)) {
                this.tokenizeIdentifier()
            } else {
                throw new Error(
                    `unrecognized character '${ch}' at line ${this.cLine}, char ${this.cChar}`
                )
            }
        }

        return this.tokens // un-map escaped newlines
            .map((token) => {
                const { type, value, location } = token
                return value === '\\\n' ? { type, location, value: '' } : token
            })
    }

    private tokenizeStatic(): boolean {
        for (const [value, type] of Object.entries(Lexer.STATICS)) {
            if (this.input.startsWith(value, this.cOffset)) {
                this.pushToken(type, value)
                this.cChar += value.length
                this.cOffset += value.length
                // Checking for \n here captures both escaped and unescaped newlines
                // allowing us to properly track position within newline-escaped macros
                if (value.endsWith('\n')) {
                    this.cLine += 1
                    this.cChar = 1
                }
                return true
            }
        }
        return false
    }

    private tokenizeComment(): boolean {
        return this.tokenizeLineComment() || this.tokenizeBlockComment()
    }

    private tokenizeLineComment(): boolean {
        if (!this.input.startsWith('//', this.cOffset)) {
            return false
        }

        var lineEnd = this.input.indexOf('\n', this.cOffset)
        var text =
            lineEnd > -1
                ? this.input.substring(this.cOffset, lineEnd)
                : this.input.substring(this.cOffset)
        this.pushToken(TokenType.COMMENT, text)
        this.cChar += text.length
        this.cOffset += text.length
        return true
    }

    private tokenizeBlockComment(): boolean {
        if (!this.input.startsWith('/*', this.cOffset)) {
            return false
        }

        const line = this.cLine
        const char = this.cChar
        for (let i = this.cOffset + 2; i < this.input.length; ++i) {
            if (this.input.startsWith('*/', i)) {
                this.cChar += 2

                const value = this.input.substring(this.cOffset, i + 2)
                this.tokens.push({
                    type: TokenType.COMMENT,
                    value,
                    location: { line, char },
                })
                this.cOffset += value.length
                return true
            } else if (this.input.charAt(i) == '\n') {
                ++this.cLine
                this.cChar = 1
            } else {
                ++this.cChar
            }
        }

        throw new Error(
            `unterminated block comment at line ${line}, char ${char}`
        )
    }

    private tokenizeWhitespace() {
        for (let i = this.cOffset; i < this.input.length; ++i) {
            if (!this.isTokenWhitespace(this.input.charAt(i))) {
                var ws = this.input.substring(this.cOffset, i)
                this.pushToken(TokenType.WHITESPACE, ws)
                this.cChar += i - this.cOffset
                this.cOffset += i - this.cOffset
                return
            }
        }
        var ws = this.input.substring(this.cOffset)
        this.pushToken(TokenType.WHITESPACE, ws)
        this.cChar += ws.length
        this.cOffset = this.input.length
    }

    private tokenizeLiteralInt() {
        var start =
            this.input.charAt(this.cOffset) == '-'
                ? this.cOffset + 1
                : this.cOffset
        for (let i = start; i < this.input.length; ++i) {
            if (this.input.charAt(i) == '_') {
                continue
            }
            if (!isNumeric(this.input.charAt(i))) {
                const value = this.input.substring(this.cOffset, i)
                this.pushToken(TokenType.LITERAL_INT, value)
                this.cChar += value.length
                this.cOffset += value.length
                return
            }
        }
        const value = this.input.substring(this.cOffset)
        this.pushToken(TokenType.LITERAL_INT, value)
        this.cChar += value.length
        this.cOffset = this.input.length
    }

    private tokenizeLiteralString() {
        for (let i = this.cOffset + 1; i < this.input.length; ++i) {
            if (this.input.charAt(i) == '"') {
                const literal = this.input.substring(this.cOffset + 1, i) // for quotes, which the captured literal omits
                this.pushToken(TokenType.LITERAL_STRING, literal)
                this.cChar += literal.length + 2
                this.cOffset += literal.length + 2
                return
            }
        }
        throw new Error('unterminated string literal')
    }

    private tokenizeIdentifier() {
        for (let i = this.cOffset; i < this.input.length; ++i) {
            if (!isLegalIdent(this.input.charAt(i))) {
                var ident = this.input.substring(this.cOffset, i)
                this.pushToken(TokenType.IDENTIFIER, ident)
                this.cChar += ident.length
                this.cOffset += ident.length
                return
            }
        }

        const value = this.input.substring(this.cOffset)
        this.pushToken(TokenType.IDENTIFIER, value)
        this.cChar += value.length
        this.cOffset = this.input.length
    }

    private pushToken(type: TokenType, value: string) {
        this.tokens.push({
            type,
            value,
            location: { line: this.cLine, char: this.cChar },
        })
    }

    private isTokenWhitespace(c: string): boolean {
        // newlines are tokenized separately
        return c == ' ' || c == '\t'
    }
}

export function isWhitespace(c: string): boolean {
    return c == ' ' || c == '\t' || c == '\n' || c == '\r'
}

export function isAlpha(c: string): boolean {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
}

export function isNumeric(c: string): boolean {
    return c >= '0' && c <= '9'
}

export function isLegalIdent(c: string): boolean {
    return c == '_' || isAlpha(c) || isNumeric(c)
}
