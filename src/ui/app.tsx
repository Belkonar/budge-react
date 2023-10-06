import * as ReactDOM from 'react-dom/client';
import React from 'react';
import {
  createMemoryRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';
import Home from './components/home';
import { AppBar, Box, CssBaseline, Drawer, PaletteMode, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import AccountsMenu from './components/menus/accounts-menu';
import ActionsMenu from './components/menus/actions-menu';
import AccountsComponent from './components/accounts';

function Root() {
  const drawerWidth = 200;

  return <Box sx={{ display: 'flex' }}>
    <AppBar
      position='fixed'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar variant='dense'>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Budge
        </Typography>

      </Toolbar>
    </AppBar>
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar variant='dense' />
      <ActionsMenu />
      <AccountsMenu />
    </Drawer>
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
    >
      <Toolbar variant='dense' />
      <Outlet />
    </Box>

  </Box>
}

function AppRoot() {
  const [state] = React.useState<{ mode: PaletteMode }>({
    mode: 'dark'
  });

  const router = createMemoryRouter([
    {
      element: <Root />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/accounts',
          element: <AccountsComponent />,
        },
      ]
    }
  ]);

  const darkTheme = createTheme({
    palette: {
      mode: state.mode,
    },
    components: {
      MuiListItemIcon: {
        defaultProps: {
          sx: {
            minWidth: 32,
          }
        }
      }
    }
  });

  return <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>
}

function render() {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

  root.render(
    <React.StrictMode>
      <AppRoot />
    </React.StrictMode>
  );
}

render();
