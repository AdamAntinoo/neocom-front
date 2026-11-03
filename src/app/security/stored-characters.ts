/** Local store of characters already authorized (LOGIN-006 / UI-CHAR). */

export type StoredCharacter = {
  characterId: number;
  characterName: string;
};

const STORAGE_KEY = 'neocom_stored_characters';

export function listStoredCharacters(): StoredCharacter[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as StoredCharacter[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function rememberStoredCharacter(character: StoredCharacter): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  const next = listStoredCharacters().filter((c) => c.characterId !== character.characterId);
  next.unshift(character);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 8)));
}
