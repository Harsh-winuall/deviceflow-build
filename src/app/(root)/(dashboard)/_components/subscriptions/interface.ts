export interface Subscriptions {
  totalPrice: number;
  totalSeatsPrice: number;
  platformCounts: PlatformCount[];
  teamWiseStats: TeamWiseStat[];
  totalSeats: number;
}

export interface PlatformCount {
  platform: string;
  price: number;
  count: number;
}

export interface TeamWiseStat {
  title: string;
  totalPrice: number;
  userCount: number;
}
