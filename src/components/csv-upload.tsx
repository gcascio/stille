import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ShareableFeedStore } from '@/lib/store';
import { feedGroupsFromCsv, bookmarksFromCsv } from '@/lib/csv';

interface CsvUploadProps {
  onUpload: React.Dispatch<React.SetStateAction<ShareableFeedStore | undefined>>;
  className?: string;
}

export function CsvUpload({
  onUpload,
  className,
  ...props
}: CsvUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const uploadedFile = files[0];

    if (!uploadedFile) {
      setError('No file uploaded');
      return;
    }

    if (!uploadedFile.name.endsWith('.csv')) {
      setError('Not a CSV file!');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const csv = e.target?.result as string;

      if (!csv) {
        setError('Failed to read file');
        return;
      }

      const feedGroups = feedGroupsFromCsv(csv);
      const bookmarks = bookmarksFromCsv(csv);

      onUpload({
        version: 1,
        feedGroups,
        bookmarks,
      });
    };

    reader.readAsText(uploadedFile);

    setError(null);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card
      className={`border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50 ${className}`}
      {...props}
    >
      <CardContent
        className="flex flex-col items-center justify-center space-y-2 px-2 py-4 h-full"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="">Drag & Drop CSV or</span>
          <Button
            variant="link"
            className="text-base ml-auto flex h-8 space-x-2 px-0 pl-1"
            onClick={handleButtonClick}
          >
            Browse
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </CardContent>
    </Card>
  );
}