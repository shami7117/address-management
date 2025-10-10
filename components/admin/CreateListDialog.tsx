// ============================================
// components/admin/CreateListDialog.tsx
// ============================================

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateListDialogProps {
  onCreateList: (name: string, areaCode: string) => void;
}

export default function CreateListDialog({ onCreateList }: CreateListDialogProps) {
  const [open, setOpen] = useState(false);
  const [listName, setListName] = useState('');
  const [areaCode, setAreaCode] = useState('');

  const handleSubmit = () => {
    if (listName && areaCode) {
      onCreateList(listName, areaCode);
      setListName('');
      setAreaCode('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
          <DialogDescription>
            Add a new list to your dashboard. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="listName">List Name</Label>
            <Input
              id="listName"
              placeholder="Enter list name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="areaCode">Area Code</Label>
            <Input
              id="areaCode"
              placeholder="e.g., 030"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Create List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}