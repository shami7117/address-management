'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar'
import CodesTable from '@/components/admin/codes/CodesTable';
import CodeCard from '@/components/admin/codes/CodeCard';
import CodeDialog from '@/components/admin/codes/CodeDialog';
import DeleteCodeDialog from '@/components/admin/codes/DeleteCodeDialog';

export interface Code {
  id: string;
  code: string;
  redirectUrl: string;
  expiryDate: Date;
  active: boolean;
  usageCount: number;
}

export default function CodesPage() {
  const [codes, setCodes] = useState<Code[]>([
    {
      id: '1',
      code: 'ABC123',
      redirectUrl: 'https://example.com/product1',
      expiryDate: new Date('2025-12-31'),
      active: true,
      usageCount: 45,
    },
    {
      id: '2',
      code: 'XYZ789',
      redirectUrl: 'https://example.com/product2',
      expiryDate: new Date('2025-11-30'),
      active: false,
      usageCount: 12,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<Code | null>(null);
  const [deletingCode, setDeletingCode] = useState<Code | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredCodes = codes.filter(
    (code) =>
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.redirectUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveCode = (codeData: Omit<Code, 'id' | 'usageCount'>) => {
    if (editingCode) {
      setCodes(
        codes.map((c) =>
          c.id === editingCode.id
            ? { ...codeData, id: c.id, usageCount: c.usageCount }
            : c
        )
      );
    } else {
      const newCode: Code = {
        ...codeData,
        id: Date.now().toString(),
        usageCount: 0,
      };
      setCodes([...codes, newCode]);
    }
    setIsDialogOpen(false);
    setEditingCode(null);
  };

  const handleEdit = (code: Code) => {
    setEditingCode(code);
    setIsDialogOpen(true);
  };

  const handleDelete = (code: Code) => {
    setDeletingCode(code);
  };

  const confirmDelete = () => {
    if (deletingCode) {
      setCodes(codes.filter((c) => c.id !== deletingCode.id));
      setDeletingCode(null);
    }
  };

  const handleToggleActive = (id: string) => {
    setCodes(
      codes.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}  />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header  onMenuClick={() => setSidebarOpen(!sidebarOpen)}/>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Code Redirects
            </h1>

            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search by code or redirect URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={() => {
                    setEditingCode(null);
                    setIsDialogOpen(true);
                  }}
                  className="whitespace-nowrap"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Code
                </Button>
              </div>
            </div>

            <div className="hidden md:block">
              <CodesTable
                codes={filteredCodes}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            </div>

            <div className="md:hidden space-y-4">
              {filteredCodes.map((code) => (
                <CodeCard
                  key={code.id}
                  code={code}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      <CodeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        code={editingCode}
        onSave={handleSaveCode}
        existingCodes={codes.map((c) => c.code)}
      />

      <DeleteCodeDialog
        open={!!deletingCode}
        onOpenChange={() => setDeletingCode(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}