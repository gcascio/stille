'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Copy } from "lucide-react"
import { useStore } from "@/lib/store"
import { Label } from "@radix-ui/react-label"
import { Checkbox } from "./ui/checkbox"

type ShareFeedsFormProps = {
  groupId?: string;
}

export const ShareFeedsForm = ({
  groupId
}: ShareFeedsFormProps) => {
  const [shareLink, setShareLink] = useState('');
  const [withBookmarks, setWithBookmarks] = useState(false);
  const [loading, setLoading] = useState(false);
  const getShareableStore = useStore((state) => state.getShareableStore)

  const generateLink = async () => {
    setLoading(true);

    try {
      const sharableStore = getShareableStore({ withBookmarks });
      const response = await fetch('/api/share', {
        method: 'POST',
        body: JSON.stringify(sharableStore),
      });

      if (!response.ok) {
        throw new Error('Failed to generate share link');
      }

      const { url } = await response.json() as { url: string };

      if (!url) {
        throw new Error('No share link present');
      }

      setShareLink(url);
    } catch (error) {
      console.error('Failed to generate share link', error);
    }

    setLoading(false);
  };
  
  // const onSubmit = () => {
  //   console.log('== shareLink: ', shareLink);
  // }

  const copyToClipboard = () => {
    void navigator.clipboard.writeText(shareLink);
  };

  const onCheck = (state: unknown) => {
    if (typeof state !== 'boolean') return;
    
    setWithBookmarks(state);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {shareLink && (
          <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            Share link
          </Label>
          <Input
            id="link"
            defaultValue={shareLink}
            readOnly
          />
        </div>
        )}
        <Button
          type="button"
          size="sm"
          className={shareLink ? 'px-3' : 'px-3 w-full'}
          onClick={shareLink ? copyToClipboard : generateLink}
          disabled={loading}
        >
          <span className="sr-only">
            {shareLink ? 'Copy' : 'Share'}
          </span>
          {shareLink
            ? <Copy className="h-4 w-4" />
            : 'Share'
          }
        </Button>
      </div>
      {!groupId && !shareLink && (
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox onCheckedChange={onCheck} />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            With bookmarks
          </label>
        </div>
      )}
      {shareLink && (
        <p className="text-xs text-muted-foreground mt-1">The link will be valid for 24 hours</p>
      )}
    </>
  )
}
