export type SSet = {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: {
    unlimied: string;
    expanded: string;
  };
  ptcgoCode: string;
  releaseDate: string;
  updatedAt: string;
  images: {
    symbol: string;
    logo: string;
  };
};

export type Card = {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp: string;
  types: string[];
  evolvesFrom: string;
  //   abilities: any[];
  //   attacks: any[];
  //   weaknesses: any[];
  retreatCost: string[];
  convertedRetreatCost: number;
  set: SSet;
  number: string;
  artist: string;
  rarity: string;
  flavorText: string;
  nationalPokedexNumbers: string[];
  legalities: {
    unlimited: string;
    standard: string;
    expanded: string;
  };
  images: {
    small: string;
    large: string;
  };
  tcgplayer: {
    url: string;
    updatedAt: string;
    prices: {
      normal?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      holofoil?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      reverseHolofoil?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      unlimitedHolofoil?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      "1EditionHolofoil"?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      unlimited?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      "1stEdition"?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
    };
  };
};

export type TradeObject = {
  id: string;
  name: string;
  price: number;
};

export type Trade = {
  user: string;
  haves: TradeObject[];
  wants: TradeObject[];
  partner: string;
  completed: boolean;
};

export type List = {
  id: string;
  user: string;
  listName: string;
  cards: Card[];
};

export type User = {
  id: string;
  email: string;
  createdAt: Date;
  cardLists: List[];
  trades: Trade[];
};
