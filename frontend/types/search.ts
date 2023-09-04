interface SearchType {
  id: number;
  recommend: number;
  reply: number;
  time: number;
  title: string;
  url: string;
}

type SortOptionType = "최신순" | "추천순" | "댓글순";
