'use client'

import { useStore } from "@/lib/store";
import { unstable_noStore as noStore } from "next/cache";
import { useSearchParams } from "next/navigation";
import { shareableFeedStoreSchema } from "@/lib/validation";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Import() {
  noStore();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const mergeShareableStore = useStore((state) => state.mergeShareableStore);
  const storeHasHydrated = useStore((state) => state.hasHydrated);
  const [loading, setLoading] = useState(!!id);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const importRemote = useCallback(async (id: string) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/share?id=${id}`);
      const data = await response.json() as unknown;
      console.log('== data: ', data);
      const shareableFeeds = shareableFeedStoreSchema.parse(data);

      mergeShareableStore(shareableFeeds);

      setSuccess(true);
    } catch (error) {
      console.error('Failed to import remote feed', error);
      setError(true);
    }

    setLoading(false);
  }, [mergeShareableStore]);

  useEffect(() => {
    if (!id || !storeHasHydrated) return;

    void importRemote(id);
  }, [id, storeHasHydrated, importRemote]);

  return (
    <div className="flex justify-center items-center p-8 w-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Feed Import</CardTitle>
          <CardDescription>Import feeds to sync devices or explore new content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-center items-center">
            <Status success={success} error={error} loading={loading} />
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className={`w-full ${loading ? 'opacity-50' : ''}`} disabled={loading}>
            <Link href="/" className={loading ? 'pointer-events-none' : ''}>Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

const Status = ({ success, error, loading }: { success: boolean; error: boolean; loading: boolean; }) => {
  if (!loading && success) {
    return (
      <>
        <CheckCircle size={80} className="text-green-500" />
        <p className="mt-6 text-muted-foreground">Import successful</p>
      </>
    )
  }

  if (!loading && error) {
    return (
      <>
        <XCircle size={80} className="text-red-500" />
        <p className="mt-6 text-muted-foreground">Failed to import feeds</p>
      </>
    )
  }

  return (
    <>
      <Loader2 size={80} className="animate-spin" />
      <p className="mt-6 text-muted-foreground">Importing feeds</p>
    </>
  )
}