import { downloadFeedGroupsCsv } from "./csv";
import { useStore } from "./store";

export const useCsvExport = () => {
  const feedGroups = useStore((state) => state.feedGroups);

  if (!Object.values(feedGroups).some(({ feeds }) => feeds.length > 0)) {
    return null;
  }

  return () => downloadFeedGroupsCsv(feedGroups)
}