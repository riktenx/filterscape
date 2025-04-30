import type { FilterDB, FragmentGenerator } from './types.ts';

export abstract class FragmentGeneratorBase implements FragmentGenerator {
  abstract generate(db: FilterDB): string;
}
