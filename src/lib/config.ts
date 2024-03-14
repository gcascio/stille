import { env } from "@/env";

export const config = {
  name: "stille",
  url: env.NEXT_PUBLIC_BASE_URL.startsWith("https://") ? env.NEXT_PUBLIC_BASE_URL : `https://${env.NEXT_PUBLIC_BASE_URL}`,
  description: "RSS reader",
}
