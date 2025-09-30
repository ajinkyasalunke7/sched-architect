import { useState } from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

const ExportMenu = ({ anchorEl, open, onClose, data, type }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(`${type} Report`, 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);

    const headers = Object.keys(data[0] || {}).filter(key => key !== 'id' && key !== 'actions');
    const rows = data.map(item => 
      headers.map(key => {
        const value = item[key];
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
      })
    );

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175] },
    });

    doc.save(`${type}-${Date.now()}.pdf`);
    onClose();
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handlePrint = () => {
    window.print();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { minWidth: 200, borderRadius: 2 },
      }}
    >
      <MenuItem onClick={exportToPDF}>
        <ListItemIcon>
          <PdfIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Export as PDF</ListItemText>
      </MenuItem>
      <MenuItem onClick={exportToCSV}>
        <ListItemIcon>
          <CsvIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Export as CSV</ListItemText>
      </MenuItem>
      <MenuItem onClick={handlePrint}>
        <ListItemIcon>
          <PrintIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Print</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ExportMenu;
