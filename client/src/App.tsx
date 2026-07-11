import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Dashboard from './components/Dashboard';
import RecordTasks from './pages/RecordTasks';
import EisenhowerMatrix from './pages/EisenhowerMatrix';

import Trends from './pages/Trends';
import Categories from './pages/Categories';

import Layout from './components/Layout';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SettingsProvider>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/record-tasks" element={<RecordTasks />} />
              <Route path="/eisenhower" element={<EisenhowerMatrix />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/categories" element={<Categories />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
