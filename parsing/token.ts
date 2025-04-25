export type Token = {
    readonly type: TokenType
    readonly value: string
    readonly location: Location
}

export type Location = {
    readonly line: number
    readonly char: number
}

export enum TokenType {
    WHITESPACE,
    NEWLINE,
    IF,
    APPLY,
    RULE,
    META,
    COLON,
    COMMA,
    TRUE,
    FALSE,
    IDENTIFIER,
    LITERAL_INT,
    LITERAL_STRING,
    ASSIGN,
    OP_EQ,
    OP_GT,
    OP_LT,
    OP_GTEQ,
    OP_LTEQ,
    OP_AND,
    OP_OR,
    OP_NOT,
    EXPR_START,
    EXPR_END,
    BLOCK_START,
    BLOCK_END,
    LIST_START,
    LIST_END,
    STMT_END,
    PREPROC_DEFINE,
    COMMENT,
}
