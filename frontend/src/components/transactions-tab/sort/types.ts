export type SortOption = {
  value: string;
  label: string;
  ascLabel: string;
  descLabel: string;
};

export const sortOptions: SortOption[] = [
  {
    value: "date",
    label: "Date",
    ascLabel: "Oldest to Newest",
    descLabel: "Newest to Oldest",
  },
  {
    value: "amount",
    label: "Amount",
    ascLabel: "Lowest to Highest",
    descLabel: "Highest to Lowest",
  },
  {
    value: "category",
    label: "Category",
    ascLabel: "A to Z",
    descLabel: "Z to A",
  },
  {
    value: "tags",
    label: "Tags",
    ascLabel: "A to Z",
    descLabel: "Z to A",
  },
  {
    value: "title",
    label: "Description",
    ascLabel: "A to Z",
    descLabel: "Z to A",
  },
  {
    value: "person",
    label: "Person",
    ascLabel: "A to Z",
    descLabel: "Z to A",
  },
];

export type SortDirection = "asc" | "desc";

export type Sort = {
  field: string;
  direction: SortDirection;
};

export const defaultSort: Sort = {
  field: "date",
  direction: "desc",
};
