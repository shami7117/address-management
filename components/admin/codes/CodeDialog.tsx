'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Shuffle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Code } from '@/app/(dashboard)/admin/codes/page';

interface CodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: Code | null;
  onSave: (code: Omit<Code, 'id' | 'usageCount'>) => void;
  existingCodes: string[];
}

export default function CodeDialog({
  open,
  onOpenChange,
  code,
  onSave,
  existingCodes,
}: CodeDialogProps) {
  const [formData, setFormData] = useState({
    code: '',
    redirectUrl: '',
    expiryDate: new Date(),
    active: true,
  });
  const [errors, setErrors] = useState({
    code: '',
    redirectUrl: '',
  });

  useEffect(() => {
    if (open) {
      if (code) {
        setFormData({
          code: code.code,
          redirectUrl: code.redirectUrl,
          expiryDate: code.expiryDate,
          active: code.active,
        });
      } else {
        setFormData({
          code: '',
          redirectUrl: '',
          expiryDate: new Date(),
          active: true,
        });
      }
      setErrors({ code: '', redirectUrl: '' });
    }
  }, [open, code]);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newCode = '';
    do {
      newCode = '';
      for (let i = 0; i < 6; i++) {
        newCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (existingCodes.includes(newCode) && newCode !== code?.code);
    
    setFormData({ ...formData, code: newCode });
    setErrors({ ...errors, code: '' });
  };

  const validateForm = () => {
    const newErrors = { code: '', redirectUrl: '' };
    let isValid = true;

    if (!formData.code) {
      newErrors.code = 'Code is required';
      isValid = false;
    } else if (formData.code.length !== 6) {
      newErrors.code = 'Code must be exactly 6 characters';
      isValid = false;
    } else if (
      existingCodes.includes(formData.code) &&
      formData.code !== code?.code
    ) {
      newErrors.code = 'Code already exists';
      isValid = false;
    }

    if (!formData.redirectUrl) {
      newErrors.redirectUrl = 'Redirect URL is required';
      isValid = false;
    } else {
      try {
        new URL(formData.redirectUrl);
      } catch {
        newErrors.redirectUrl = 'Invalid URL format';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {code ? 'Edit Code' : 'New Code'}
          </DialogTitle>
          <DialogDescription>
            {code
              ? 'Update the code details below.'
              : 'Create a new registration code with redirect URL.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Registration Code</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().slice(0, 6);
                    setFormData({ ...formData, code: value });
                    setErrors({ ...errors, code: '' });
                  }}
                  placeholder="ABC123"
                  maxLength={6}
                  className={`font-mono ${errors.code ? 'border-red-500' : ''}`}
                />
                {errors.code && (
                  <p className="text-sm text-red-500 mt-1">{errors.code}</p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateRandomCode}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="redirectUrl">Redirect URL</Label>
            <Input
              id="redirectUrl"
              type="url"
              value={formData.redirectUrl}
              onChange={(e) => {
                setFormData({ ...formData, redirectUrl: e.target.value });
                setErrors({ ...errors, redirectUrl: '' });
              }}
              placeholder="https://example.com/product"
              className={errors.redirectUrl ? 'border-red-500' : ''}
            />
            {errors.redirectUrl && (
              <p className="text-sm text-red-500 mt-1">{errors.redirectUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.expiryDate, 'dd.MM.yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.expiryDate}
                  onSelect={(date) =>
                    date && setFormData({ ...formData, expiryDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Active</Label>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, active: checked })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}