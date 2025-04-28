export type FilterDB = {
  items: Record<string, FilterDBItemList>;
};

export type FilterDBItemList = {
  name: string;
  items: Item[];
};

export type Item = {
  name: string;
};
