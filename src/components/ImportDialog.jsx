import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import Papa from 'papaparse';
import { toast } from 'react-toastify';

const ImportDialog = ({ open, onClose, onImport, dataType }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLoading(true);

      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setPreview(results.data.slice(0, 5));
          setLoading(false);
        },
        error: (error) => {
          toast.error('Error parsing CSV file');
          setLoading(false);
        },
      });
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          await onImport(results.data);
          toast.success(`Successfully imported ${results.data.length} records`);
          onClose();
          setFile(null);
          setPreview([]);
        } catch (error) {
          toast.error('Import failed');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import {dataType} from CSV</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Upload a CSV file with the appropriate columns. The first row should contain column headers.
          </Alert>

          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            fullWidth
            sx={{ py: 3, mb: 2 }}
          >
            Choose CSV File
            <input type="file" hidden accept=".csv" onChange={handleFileChange} />
          </Button>

          {file && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selected: {file.name}
            </Typography>
          )}

          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {preview.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Preview (first 5 rows):
              </Typography>
              <Box
                sx={{
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 1,
                  p: 2,
                  maxHeight: 200,
                  overflow: 'auto',
                  bgcolor: 'hsl(var(--muted) / 0.3)',
                }}
              >
                <pre style={{ margin: 0, fontSize: '0.8rem' }}>
                  {JSON.stringify(preview, null, 2)}
                </pre>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!file || loading}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportDialog;
