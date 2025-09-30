import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { generateTimetableAsync } from '../app/slices/timetableSlice';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, ArrowForward, AutoAwesome } from '@mui/icons-material';
import { toast } from 'react-toastify';

const steps = ['Select Parameters', 'Set Constraints', 'Generate'];

const GeneratePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  const [parameters, setParameters] = useState({
    academicYear: '2024-25',
    program: 'Computer Science',
    semester: 'Fall 2024',
  });

  const [constraints, setConstraints] = useState({
    avoidBackToBack: true,
    respectFacultyAvailability: true,
    balanceWorkload: true,
    preferMorningSlots: false,
    maxConsecutiveHours: 3,
    breakDuration: 15,
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      await dispatch(generateTimetableAsync({ parameters, constraints })).unwrap();
      setGenerationProgress(100);
      toast.success('Timetable generated successfully!');
      setTimeout(() => {
        navigate('/timetable');
      }, 500);
    } catch (error) {
      toast.error('Failed to generate timetable');
      setGenerating(false);
      clearInterval(progressInterval);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Academic Year"
                value={parameters.academicYear}
                onChange={(e) => setParameters({ ...parameters, academicYear: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Program"
                value={parameters.program}
                onChange={(e) => setParameters({ ...parameters, program: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Semester"
                value={parameters.semester}
                onChange={(e) => setParameters({ ...parameters, semester: e.target.value })}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                Scheduling Constraints
              </FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={constraints.avoidBackToBack}
                      onChange={(e) => setConstraints({ ...constraints, avoidBackToBack: e.target.checked })}
                    />
                  }
                  label="Avoid back-to-back classes for faculty"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={constraints.respectFacultyAvailability}
                      onChange={(e) => setConstraints({ ...constraints, respectFacultyAvailability: e.target.checked })}
                    />
                  }
                  label="Respect faculty availability"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={constraints.balanceWorkload}
                      onChange={(e) => setConstraints({ ...constraints, balanceWorkload: e.target.checked })}
                    />
                  }
                  label="Balance workload across days"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={constraints.preferMorningSlots}
                      onChange={(e) => setConstraints({ ...constraints, preferMorningSlots: e.target.checked })}
                    />
                  }
                  label="Prefer morning time slots"
                />
              </FormGroup>
            </FormControl>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Consecutive Hours"
                  value={constraints.maxConsecutiveHours}
                  onChange={(e) => setConstraints({ ...constraints, maxConsecutiveHours: parseInt(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Break Duration (minutes)"
                  value={constraints.breakDuration}
                  onChange={(e) => setConstraints({ ...constraints, breakDuration: parseInt(e.target.value) })}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, hsl(220 70% 50%), hsl(265 60% 55%))',
                mb: 3,
              }}
            >
              <AutoAwesome sx={{ fontSize: 64, color: 'white' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Ready to Generate
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              All parameters are set. Click the button below to generate your AI-powered timetable.
            </Typography>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'hsl(220 20% 97%)',
                textAlign: 'left',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Summary:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Academic Year: {parameters.academicYear}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Program: {parameters.program}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Semester: {parameters.semester}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {Object.values(constraints).filter(Boolean).length} constraints enabled
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Generate Timetable
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Configure parameters and constraints for AI-powered timetable generation
      </Typography>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 300 }}>{renderStepContent(activeStep)}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ textTransform: 'none' }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleGenerate}
              startIcon={<AutoAwesome />}
              sx={{
                textTransform: 'none',
                px: 4,
                background: 'linear-gradient(135deg, hsl(220 70% 50%), hsl(265 60% 55%))',
                '&:hover': {
                  background: 'linear-gradient(135deg, hsl(220 70% 45%), hsl(265 60% 50%))',
                },
              }}
            >
              Generate Timetable
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
              sx={{
                textTransform: 'none',
                background: 'linear-gradient(135deg, hsl(220 70% 50%), hsl(265 60% 55%))',
                '&:hover': {
                  background: 'linear-gradient(135deg, hsl(220 70% 45%), hsl(265 60% 50%))',
                },
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>

      <Backdrop open={generating} sx={{ zIndex: 9999, bgcolor: 'rgba(0, 0, 0, 0.8)' }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress size={80} sx={{ color: 'white', mb: 3 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Generating Timetable...
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            AI is analyzing constraints and optimizing schedule
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {generationProgress}%
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
};

export default GeneratePage;
