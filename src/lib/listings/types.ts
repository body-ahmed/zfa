export type ListingPrice = {
  id: string;
  title: string;
  price: number;
  unit: string;
};

export type ListingPhoto = {
  id: string;
  url: string;
};

export type ListingSlot = {
  id: string;
  date: string;
  booked: boolean;
};

export type Listing = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  bio: string;
  rating: number;
  coverUrl: string;
  ownerProfileId: string | null;
  photos: ListingPhoto[];
  prices: ListingPrice[];
  slots: ListingSlot[];
};
