import { downloadFeedGroupsCsv } from "./csv";
import { useStore } from "./store";

export const useFeedGroupCsvExport = () => {
  const feedGroups = useStore((state) => state.feedGroups);

  return {
    feedGroupsPresent: Object.values(feedGroups).some(({ feeds }) => feeds.length > 0),
    exportFeedGroupCsv: () => downloadFeedGroupsCsv(feedGroups),
  }
}