// =============================================
// FILE: components/admin/WallboardControls.tsx
// =============================================
'use client';

import React, { useState } from 'react';
import { Copy, ExternalLink, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface WallboardControlsProps {
  wallboardUrl: string | null;
  onGenerate: () => void;
  onDelete: () => void;
}

export default function WallboardControls({
  wallboardUrl,
  onGenerate,
  onDelete,
}: WallboardControlsProps) {
  const [copied, setCopied] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fullUrl = wallboardUrl
    ? `${window.location.origin}${wallboardUrl}`
    : null;

  const handleCopy = async () => {
    if (fullUrl) {
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleDelete = () => {
    onDelete();
    setDeleteDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallboard</CardTitle>
        <CardDescription>
          Share a read-only view of this list for public display
        </CardDescription>
      </CardHeader>
      <CardContent>
        {wallboardUrl ? (
          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={fullUrl || ''}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(wallboardUrl, '_blank')}
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" title="Delete wallboard link">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Wallboard Link</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this wallboard link? Anyone with
                        this link will no longer be able to access the wallboard view.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        Delete Link
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              This link provides read-only access to the list status
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              No wallboard link created yet.
            </p>
            <Button onClick={onGenerate}>Generate Wallboard Link</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}