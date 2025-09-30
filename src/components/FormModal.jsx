import { useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Grid, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

const FormModal = ({ open, onClose, onSubmit, title, fields, defaultValues = {} }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: '0 8px 32px hsl(220 20% 15% / 0.12)',
          p: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2}>
            {fields.map((field) => (
              <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
                <Controller
                  name={field.name}
                  control={control}
                  rules={field.rules}
                  render={({ field: controllerField }) => (
                    <TextField
                      {...controllerField}
                      label={field.label}
                      type={field.type || 'text'}
                      fullWidth
                      multiline={field.multiline}
                      rows={field.rows}
                      select={field.select}
                      SelectProps={field.SelectProps}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]?.message}
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: 'none',
                background: 'linear-gradient(135deg, hsl(220 70% 50%), hsl(265 60% 55%))',
                '&:hover': {
                  background: 'linear-gradient(135deg, hsl(220 70% 45%), hsl(265 60% 50%))',
                },
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default FormModal;
