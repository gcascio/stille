import { downloadBookmarksGroupsCsv } from "./csv";
import { useStore } from "./store";

export const useBookmarksCsvExport = () => {
  const bookmarks = useStore((state) => state.bookmarks);

  return {
    bookmarksPresent: bookmarks.length > 0,
    exportBookmarksCsv: () => downloadBookmarksGroupsCsv(bookmarks),
  }
}