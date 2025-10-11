
// ============================================
// components/admin/ImportCSVDialog.tsx
// ============================================

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
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
import { Label } from '@/components/ui/label';

interface Address {
  id: string;
  address: string;
  checked: boolean;
  lastChanged: Date;
}

interface ImportCSVDialogProps {
  onImport: (addresses: Address[]) => void;
}

export default function ImportCSVDialog({ onImport }: ImportCSVDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header row if present
      const dataLines = lines[0].toLowerCase().includes('address') ? lines.slice(1) : lines;
      
      const importedAddresses: Address[] = dataLines.map((line, index) => {
        const address = line.trim();
        return {
          id: `import-${Date.now()}-${index}`,
          address,
          checked: false,
          lastChanged: new Date(),
        };
      }).filter(addr => addr.address);

      onImport(importedAddresses);
      setFile(null);
      setOpen(false);
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Addresses from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with address data. One address per line.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="csvFile">CSV File</Label>
            <input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
            />
            {file && (
              <p className="text-sm text-gray-600">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleImport} disabled={!file}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
