import { type FeedGroup } from "./store";

const feedGroupsToCsv = (feedGroups: Record<FeedGroup['id'], FeedGroup>) => {
  const flatFeedGroups = Object.values(feedGroups)
    .map((feedGroup) => feedGroup.feeds.map((feed) => ({
      groupId: feedGroup.id,
      group: feedGroup.name,
      groupPosition: feedGroup.position,
      feed: feed.name,
      feedUrl: feed.feedUrl,
    })))
    .flat();

  if (flatFeedGroups.length === 0) return null;

  const header = Object.keys(flatFeedGroups[0]!).join(',');
  const rows = flatFeedGroups.map((obj) => Object.values(obj).join(',')).join('\n');

  return `${header}\n${rows}`;
}

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const downloadFeedGroupsCsv = (feedGroups: Record<FeedGroup['id'], FeedGroup>) => {
  const csv = feedGroupsToCsv(feedGroups);

  if (!csv) return;

  downloadCSV(csv, 'stille-feed-groups.csv');
}