import { Token, TokenType } from './token.ts'

/**
 * Manipulator for a stream of tokens returned from lexing.
 *
 * This is conceptually equivalent to, BUT behaviorally different from the
 * plugin version of TokenStream - that one ignores comments and needs a bunch
 * more logic for handling expressions, etc. - this one _needs_ comments in
 * certain situations.
 */
export class TokenStream {
    private readonly tokens: Token[]
    private readonly firstToken: Token

    constructor(tokens: Token[]) {
        this.tokens = [...tokens]
        this.firstToken = tokens[0]
    }

    getTokens(): Token[] {
        return [...this.tokens]
    }

    hasTokens(): boolean {
        return this.tokens.some((t) => !isWhitespace(t))
    }

    /**
     * Peek at the first non-whitespace token in the stream without consuming
     * it.
     */
    peek(): Token {
        const token = this.tokens.find((t) => !isWhitespace(t))
        if (token === undefined) {
            throw new TokenStreamEOFError(this.firstToken)
        }
        return token
    }

    /**
     * Consume the first token in the stream, optionally including whitespace.
     */
    take(includeWhitespace?: boolean): Token {
        while (this.tokens.length !== 0) {
            const next = this.tokens.shift()!!
            if (includeWhitespace || !isWhitespace(next)) {
                return next
            }
        }
        throw new TokenStreamEOFError(this.firstToken)
    }

    /**
     * Consume the first non-whitespace token in the stream while asserting
     * that it is of the given type.
     */
    takeExpect(expect: TokenType): Token {
        if (!this.hasTokens()) {
            throw new TokenStreamEOFError(this.firstToken)
        }

        const first = this.take()
        if (first?.type !== expect) {
            throw new TokenStreamError('unexpected token', first)
        }
        return first
    }

    /**
     * Take a complete line from the stream, including whitespace, and
     * excluding the newline at the end.
     */
    takeLine(): TokenStream {
        const line: Token[] = []
        while (this.tokens.length !== 0) {
            const next = this.tokens.shift()!!
            if (next.type === TokenType.NEWLINE) {
                return new TokenStream(line)
            }
            line.push(next)
        }
        return new TokenStream(line)
    }

    toString(): string {
        return this.tokens
            .map((t) =>
                t.type === TokenType.LITERAL_STRING ? `"${t.value}"` : t.value
            )
            .join('')
    }

    takeInt(): number {
        return parseInt(this.takeExpect(TokenType.LITERAL_INT).value)
    }

    takeBool(): boolean {
        const first = this.take()!!
        switch (first.type) {
            case TokenType.TRUE:
                return true
            case TokenType.FALSE:
                return false
            default:
                throw new TokenStreamError('unexpected token', first)
        }
    }

    takeString(): string {
        return this.takeExpect(TokenType.LITERAL_STRING).value
    }

    takeIntList(): number[] {
        return this.takeList().map((token) => {
            if (token.type !== TokenType.LITERAL_INT) {
                throw new TokenStreamError('unexpected token', token)
            }
            return parseInt(token.value)
        })
    }

    takeStringList(): string[] {
        return this.takeList().map((token) => {
            if (token.type !== TokenType.LITERAL_STRING) {
                throw new TokenStreamError('unexpected token', token)
            }
            return token.value
        })
    }

    private takeList(): Token[] {
        const list: Token[] = []
        this.takeExpect(TokenType.LIST_START)
        while (this.hasTokens()) {
            if (this.peek().type === TokenType.LIST_END) {
                return list
            }

            list.push(this.take())

            const next = this.peek()
            if (next.type === TokenType.COMMA) {
                this.take()
            } else if (next.type === TokenType.LIST_END) {
                this.take()
                break
            } else {
                throw new TokenStreamError('unexpected token', next)
            }
        }
        return list
    }

    takeBlock(): TokenStream {
        const block: Token[] = []
        this.takeExpect(TokenType.BLOCK_START)
        while (this.hasTokens()) {
            const next = this.take()
            if (next.type === TokenType.BLOCK_END) {
                return new TokenStream(block)
            }
            block.push(next)
        }
    }
}

export function isWhitespace(token: Token): boolean {
    return (
        token.type === TokenType.WHITESPACE || token.type === TokenType.NEWLINE
    )
}

export class TokenStreamError extends Error {
    constructor(message: string, token: Token) {
        var loc = token.location
        super(
            `${message} '${token.value}' at line ${loc.line}, char ${loc.char}`
        )
    }
}

export class TokenStreamEOFError extends Error {
    constructor(token: Token) {
        super(`unexpected end of token stream near line ${token.location.line}`)
    }
}
