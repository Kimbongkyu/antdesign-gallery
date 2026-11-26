import type {ApiDoc} from './parse';
export {SLUGS} from './slugs';
export type {ApiDoc, ApiRow, ApiSection} from './parse';

const files = import.meta.glob<ApiDoc>('./data/*.json', {eager: true, import: 'default'});

export const API_DOCS: Record<string, ApiDoc> = Object.fromEntries(
  Object.values(files).map((d) => [d.slug, d]),
);
