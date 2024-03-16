import { z } from "zod";
import Parser from 'rss-parser'
import { MAX_FEED_LENGTH } from "@/constants";
import type { RssFeed } from "@/lib/types";

const parser = new Parser<RssFeed>();

const paramsSchema = z.object({ url: z.string().url() });

export async function GET(
  request: Request,
  { params }: { params: { url: string } }
) {
  const parsedParams = paramsSchema.safeParse(params);

  if (!parsedParams.success) {
    return new Response('Invalid URL', { status: 400 });
  }

  const { items, ...feedInfo }: RssFeed = await parser.parseURL(parsedParams.data.url);

  return Response.json({
    ...feedInfo,
    items: items.slice(0, MAX_FEED_LENGTH),
  });
}
