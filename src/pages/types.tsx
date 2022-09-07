export type DataSet = {
  users: { id: string; name: string; size: number }[];
  animes: { id: string; title: string; size: number }[];
  statuses: { userId: string; animeId: string; status: "WATCHED" | "WATCHING" }[];
};
