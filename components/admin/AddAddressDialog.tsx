// ============================================
// components/admin/AddAddressDialog.tsx
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

interface AddAddressDialogProps {
  onAddAddress: (address: string, comment: string) => void;
}

export default function AddAddressDialog({ onAddAddress }: AddAddressDialogProps) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (address.trim()) {
      onAddAddress(address, comment);
      setAddress('');
      setComment('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Enter the address details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Input
              id="comment"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Add Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
