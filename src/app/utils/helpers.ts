import type { Card } from "../types";

export function fixedTwoDecimals(val: number | undefined) {
  if (val === 0) return Number(0).toFixed(2);
  if (!val) return undefined;
  return (Math.round(val * 100) / 100).toFixed(2);
}

export function sortByDateAndThenNumber(a: Card, b: Card) {
  let d1;
  let d2;
  if (a?.set?.releaseDate !== undefined) d1 = new Date(a.set.releaseDate);
  else d1 = new Date();
  if (b?.set?.releaseDate !== undefined) d2 = new Date(b.set.releaseDate);
  else d2 = new Date();

  const n1 = parseInt(a?.number ?? "0");
  const n2 = parseInt(b?.number ?? "0");

  return d2.valueOf() - d1.valueOf() || n1 - n2;
}

export function getPrice(card: Card | null) {
  if (card === null) return "-";

  const unlimitedHolo = fixedTwoDecimals(
    card?.price
      ? card.price
      : card?.tcgplayer?.prices?.unlimitedHolofoil?.market,
  );
  const firstEditionHolo = fixedTwoDecimals(
    card?.price ? card.price : card?.tcgplayer?.prices?.["1stEdition"]?.market,
  );
  const unlimited = fixedTwoDecimals(
    card?.price ? card.price : card?.tcgplayer?.prices?.unlimited?.market,
  );
  const firstEdition = fixedTwoDecimals(
    card?.price ? card.price : card?.tcgplayer?.prices?.["1stEdition"]?.market,
  );
  const holo = fixedTwoDecimals(
    card?.price ? card.price : card?.tcgplayer?.prices?.holofoil?.market,
  );
  const reverse = fixedTwoDecimals(
    card?.price ? card.price : card?.tcgplayer?.prices?.reverseHolofoil?.market,
  );
  const normal = fixedTwoDecimals(
    card?.price ? card.price : card?.tcgplayer?.prices?.normal?.market,
  );

  return (
    firstEditionHolo ??
    unlimitedHolo ??
    firstEdition ??
    unlimited ??
    holo ??
    reverse ??
    normal ??
    "-"
  );
}

// create query string
export function createQueryString(
  params: Record<string, string | number | null>,
  searchParams: string,
) {
  const newSearchParams = new URLSearchParams(searchParams?.toString());

  for (const [key, value] of Object.entries(params)) {
    if (value === null) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, String(value));
    }
  }

  return newSearchParams.toString();
}

export function formatType(type: string) {
  if (type === "normal") return "Normal";
  if (type === "reverseHolofoil") return "Reverse Holofoil";
  if (type === "holofoil") return "Holofoil";
  return type;
}
