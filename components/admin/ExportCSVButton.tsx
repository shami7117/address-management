// ============================================
// components/admin/ExportCSVButton.tsx
// ============================================

import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Address {
  id: string;
  address: string;
  checked: boolean;
  lastChanged: Date;
}

interface ExportCSVButtonProps {
  addresses: Address[];
}

export default function ExportCSVButton({ addresses }: ExportCSVButtonProps) {
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleExport = () => {
    // Create CSV content with UTF-8 BOM for proper encoding
    const BOM = '\uFEFF';
    const headers = 'Address,Checked,Last Changed\n';
    const rows = addresses.map(addr => 
      `"${addr.address}",${addr.checked ? 'Yes' : 'No'},${formatDate(addr.lastChanged)}`
    ).join('\n');
    
    const csvContent = BOM + headers + rows;
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `addresses_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}