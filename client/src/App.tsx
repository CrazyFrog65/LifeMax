import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Dashboard from './components/Dashboard';
import RecordTasks from './pages/RecordTasks';
import EisenhowerMatrix from './pages/EisenhowerMatrix';
import Trends from './pages/Trends';
import Categories from './pages/Categories';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <SettingsProvider>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected Application Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/record-tasks" element={<RecordTasks />} />
                  <Route path="/eisenhower" element={<EisenhowerMatrix />} />
                  <Route path="/trends" element={<Trends />} />
                  <Route path="/categories" element={<Categories />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
