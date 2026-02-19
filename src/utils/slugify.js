// Simple slugify utility — remove diacritics, non-alphanumerics -> hyphens
export default function slugify(text) {
  if (!text) return '';
  return String(text)
    .normalize('NFD')                 // split accented letters
    .replace(/\p{Diacritic}/gu, '')   // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')      // replace non-alphanumeric with '-'
    .replace(/(^-|-$)+/g, '');        // trim leading/trailing '-'
}
