import { useState } from 'react';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#0D1117' }}>
      {/* Mobile Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 220, bgcolor: '#161B22', borderRight: '1px solid rgba(255,255,255,0.06)' },
        }}
      >
        <Sidebar onClose={handleDrawerToggle} isMobile={true} />
      </Drawer>

      {/* Desktop Sidebar */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar />
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar onMenuClick={handleDrawerToggle} showMenuButton={isMobile} />
        <Box sx={{ flex: 1, overflow: 'auto', px: { xs: 2, md: 4 }, py: 3, pb: 10 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
