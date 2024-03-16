export type RssItem = {
  title: string;
  link: string;
  isoDate: string;
  comments?: string;
}

export type RssFeed = {
  title: string;
  description: string;
  link: string;
  items: Array<RssItem>
}