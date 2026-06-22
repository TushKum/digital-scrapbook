import { dispatchRepository } from '../repositories/dispatchRepository';
import { LANGS } from '../types';
import type { Lang } from '../types';
import type { AddDispatchInput } from '../schemas';

export const dispatchService = {
  // All dispatches keyed by language (the shape the ticker consumes).
  async getAll(): Promise<Record<Lang, string[]>> {
    const entries = await Promise.all(
      LANGS.map(async (lang) => [lang, (await dispatchRepository.findByLang(lang)).map((d) => d.text)] as const),
    );
    return Object.fromEntries(entries) as Record<Lang, string[]>;
  },

  async getByLang(lang: Lang): Promise<string[]> {
    return (await dispatchRepository.findByLang(lang)).map((d) => d.text);
  },

  async add(input: AddDispatchInput) {
    return dispatchRepository.create(input);
  },
};
