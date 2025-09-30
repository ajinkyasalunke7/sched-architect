import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './app/store';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DataManagementPage from './pages/DataManagementPage';
import GeneratePage from './pages/GeneratePage';
import TimetablePage from './pages/TimetablePage';
import PreferencesPage from './pages/PreferencesPage';
import NotFound from './pages/NotFound';

const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(220, 70%, 50%)',
    },
    secondary: {
      main: 'hsl(265, 60%, 55%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
  },
});

const App = () => (
  <Provider store={store}>
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="timetable" element={<TimetablePage />} />
              <Route path="generate" element={<GeneratePage />} />
              <Route path="manage/:dataType" element={<DataManagementPage />} />
              <Route path="preferences" element={<PreferencesPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
      </ThemeProvider>
    </CustomThemeProvider>
  </Provider>
);

export default App;
