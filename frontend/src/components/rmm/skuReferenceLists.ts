export const DOSAGE_FORMS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Solution",
  "Suspension",
  "Injection",
  "Cream",
  "Ointment",
  "Drops",
  "Spray",
  "Powder",
  "Granules",
] as const;

export const UNITS_OF_MEASURE = [
  "tablets",
  "capsules",
  "ml",
  "l",
  "mg",
  "g",
  "kg",
  "units",
  "vials",
  "bottles",
  "sachets",
  "ampoules",
] as const;

// Mirror backend validation in rmm_is_valid_dosage_strength (best-effort UX; server is source of truth).
export const DOSAGE_STRENGTH_REGEX = /^\s*\d+(\.\d+)?\s*(mg|g|mcg|iu|%)\s*(\/\s*(ml|l))?\s*$/i;

// Best-effort pack-size format: "<number><optional space><text>" (e.g. "30 tablets", "100ml bottle").
export const PACK_SIZE_REGEX = /^\s*\d+(\.\d+)?\s*\S.+$/;

