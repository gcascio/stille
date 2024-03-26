import { nanoid } from 'nanoid'
import { Redis } from '@upstash/redis'
import {
  type ShareableFeedStoreSchema,
  shareableFeedStoreSchema,
} from "@/lib/validation";
import type { NextRequest } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_URL!,
  token: process.env.UPSTASH_TOKEN!,
})

export async function GET(
  req: NextRequest,
) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response('Invalid ID', { status: 400 });
  }

  const shareableFeeds = await redis.get<ShareableFeedStoreSchema>(id);

  return Response.json(shareableFeeds);
}

export async function POST(
  request: Request,
) {
  const data = await request.json() as unknown;
  const shareableFeeds = shareableFeedStoreSchema.parse(data);
  const id = nanoid();

  const insertStatus = await redis.set(id, shareableFeeds, { nx: true, ex: 60 * 60 * 24 });

  if (insertStatus !== 'OK') {
    return new Response('ID already exists', { status: 400 });
  }

  return Response.json({
    url: `https://stille.app/import?id=${id}`
  });
}