"use client";
import React, { useState } from 'react';
import { Calendar, Save, Trash2, ExternalLink, Globe, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

// Delete Code Dialog Component
const DeleteCodeDialog = ({ open, onOpenChange, onConfirm }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Short Code</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this code? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// Code Editor Form Component
const CodeEditorForm = ({ formData, onChange }: {
  formData: any;
  onChange: (field: string, value: any) => void;
}) => {
  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isUrlValid = formData.redirectUrl ? validateUrl(formData.redirectUrl) : true;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Settings</CardTitle>
        <CardDescription>Manage redirect URL and code configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="redirectUrl">Redirect URL *</Label>
          <div className="relative">
            <Input
              id="redirectUrl"
              type="url"
              placeholder="https://example.com/destination"
              value={formData.redirectUrl}
              onChange={(e) => onChange('redirectUrl', e.target.value)}
              className={!isUrlValid ? 'border-red-500' : ''}
            />
            <ExternalLink className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </div>
          {!isUrlValid && formData.redirectUrl && (
            <p className="text-sm text-red-500">Please enter a valid URL</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <div className="relative">
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => onChange('expiryDate', e.target.value)}
            />
            <Calendar className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-sm text-slate-500">Leave empty for no expiry</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="active">Active Status</Label>
            <p className="text-sm text-slate-500">Enable or disable this short code</p>
          </div>
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => onChange('active', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Admin Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add internal notes about this code (optional)"
            rows={4}
            value={formData.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            className="resize-none"
          />
          <p className="text-sm text-slate-500">These notes are only visible to admins</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Code Analytics Component
const CodeAnalytics = ({ stats, recentHits }: {
  stats: { totalUsage: number; lastUsed: string | null };
  recentHits: Array<{ date: string; ip: string; location: string; userAgent: string }>;
}) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics</CardTitle>
        <CardDescription>Track how often this code is used</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Total Uses</p>
            <p className="text-3xl font-bold">{stats.totalUsage}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Last Used</p>
            <p className="text-lg font-semibold">
              {stats.lastUsed || 'Never'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest redirects using this code</CardDescription>
      </CardHeader>
      <CardContent>
        {recentHits.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No activity yet</p>
        ) : (
          <div className="space-y-3">
            {recentHits.map((hit, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <span className="font-mono text-slate-900">{hit.ip}</span>
                    <span className="text-slate-500">• {hit.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Smartphone className="h-3 w-3" />
                    <span className="truncate">{hit.userAgent}</span>
                  </div>
                </div>
                <div className="text-sm text-slate-500">{hit.date}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

// Main Page Component
export default function CodeDetailPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: 'ABC123',
    redirectUrl: 'https://example.com/destination-page',
    expiryDate: '2025-12-31',
    active: true,
    notes: 'Marketing campaign for Q4 2025'
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = {
    totalUsage: 1247,
    lastUsed: '15.10.2025 14:32'
  };

  const recentHits = [
    {
      date: '16.10.2025 09:15',
      ip: '192.168.1.45',
      location: 'New York, US',
      userAgent: 'Chrome 118 on Windows'
    },
    {
      date: '16.10.2025 08:42',
      ip: '203.45.67.89',
      location: 'London, UK',
      userAgent: 'Safari 17 on iPhone'
    },
    {
      date: '15.10.2025 22:18',
      ip: '104.28.15.22',
      location: 'Tokyo, JP',
      userAgent: 'Firefox 119 on macOS'
    },
    {
      date: '15.10.2025 19:05',
      ip: '185.92.34.11',
      location: 'Berlin, DE',
      userAgent: 'Chrome 118 on Android'
    }
  ];

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving changes:', formData);
    alert('Changes saved successfully!');
  };

  const handleDelete = () => {
    console.log('Deleting code:', formData.code);
    alert('Code deleted successfully!');
    setDeleteDialogOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 ">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)}/>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodeEditorForm formData={formData} onChange={handleFormChange} />
            <CodeAnalytics stats={stats} recentHits={recentHits} />
          </div>
          </main>
      </div>

      <DeleteCodeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}