import * as fs from 'fs';

import { Lexer } from './lexer.ts';
import { Token, TokenType } from './token.ts';
import { TokenStream } from './tokenstream.ts';

const files = fs.readdirSync('./filters');

const meta = `meta {
  name = "migrated-area-filter";
}`;
const migrated = [meta];

const extractArea = (block: TokenStream): number[] | undefined => {
  while (block.hasTokens()) {
    const next = block.take();
    if (next.type === TokenType.IDENTIFIER && next.value === "area") {
      block.takeExpect(TokenType.ASSIGN);
      return block.takeIntList();
    }
  }
  return undefined;
};

const location = { line: -1, char: -1 };

for (const file of files) {
  const rs2f = fs.readFileSync(`./filters/${file}`, 'utf-8');
  const macroSuffix = file
    .replace('.rs2f', '')
    .toUpperCase();

  const tokens = new TokenStream(new Lexer(rs2f).tokenize());
  const migratedTokens: Token[] = [];

  migrated.push(`// start: ${file}`);

  let hasArea = false;
  while (tokens.hasTokens()) {
    const next = tokens.take(true);
    if (next.type === TokenType.META) {
      const area = extractArea(tokens.takeBlock());
      if (area !== undefined) {
        hasArea = true;
        const areaLiteral = JSON.stringify(area);
        migrated.push(`#define RULE_${macroSuffix}(_cond) rule (area:${areaLiteral} && (_cond))`);
        migrated.push(`#define APPLY_${macroSuffix}(_cond) apply (area:${areaLiteral} && (_cond))`);
      }
      continue;
    }

    if (hasArea && (next.type === TokenType.IF || next.type === TokenType.RULE)) {
      migratedTokens.push({ type: TokenType.IDENTIFIER, value: `RULE_${macroSuffix}`, location });
    } else if (hasArea && next.type === TokenType.APPLY) {
      migratedTokens.push({ type: TokenType.IDENTIFIER, value: `APPLY_${macroSuffix}`, location });
    } else {
      migratedTokens.push(next);
    }
  }

  migrated.push(new TokenStream(migratedTokens).toString());
  migrated.push(`// end: ${file}`);
}

fs.writeFileSync('migrated.rs2f', migrated.join('\n\n'));
