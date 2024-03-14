import { Skeleton } from "./ui/skeleton";

export const FeedListSkeleton = () => (
  <>
    <div className="space-y-2">
      <Skeleton className="h-5 w-[100px]" />
      <Skeleton className="h-9 w-10/12" />
      <Skeleton className="h-5 w-[150px]" />
    </div>

    <div className="space-y-2">
      <Skeleton className="h-5 w-[100px]" />
      <Skeleton className="h-9 w-4/12" />
      <Skeleton className="h-5 w-[150px]" />
    </div>

    <div className="space-y-2">
      <Skeleton className="h-5 w-[250px]" />
      <Skeleton className="h-9 w-8/12" />
      <Skeleton className="h-5 w-[150px]" />
    </div>

    <div className="space-y-2">
      <Skeleton className="h-5 w-[250px]" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-5 w-[150px]" />
    </div>

    <div className="space-y-2">
      <Skeleton className="h-5 w-[250px]" />
      <Skeleton className="h-9 w-8/12" />
      <Skeleton className="h-5 w-[150px]" />
    </div>

    <div className="space-y-2">
      <Skeleton className="h-5 w-[100px]" />
      <Skeleton className="h-9 w-6/12" />
      <Skeleton className="h-5 w-[150px]" />
    </div>

    {/* This helps to restore the scroll position when navigating and the content has not loaded yet */}
    <div className="h-[3000rem]" />
  </>
)
