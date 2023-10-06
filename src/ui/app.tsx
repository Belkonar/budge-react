import * as ReactDOM from 'react-dom/client';
import React from 'react';
import {
  createMemoryRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';
import Home from './components/home';
import { AppBar, Box, CssBaseline, Drawer, FormControl, MenuItem, PaletteMode, Select, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import AccountsMenu from './components/menus/accounts-menu';
import ActionsMenu from './components/menus/actions-menu';
import AccountsComponent from './components/accounts';

function Root() {
  const drawerWidth = 200;

  const [state, setState] = React.useState<{ mode: PaletteMode }>({
    mode: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
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

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
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

  const setTheme = (theme: PaletteMode) => {
    setState({ mode: theme });
    localStorage.setItem('theme', theme);
  }

  return <ThemeProvider theme={state.mode === 'light' ? lightTheme : darkTheme}>
    <CssBaseline />

    <Box sx={{ display: 'flex' }}>
      <AppBar
        position='fixed'
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant='dense'>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Budge
          </Typography>
          <Box sx={{ width: 200 }}>
            <FormControl fullWidth>
              <Select
                value={state.mode}
                onChange={(mode) => { setTheme(mode.target.value as PaletteMode) }}
              >
                <MenuItem value={'light'}>Light Mode</MenuItem>
                <MenuItem value={'dark'}>Dark Mode</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
  </ThemeProvider>
}

function AppRoot() {
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

  return <RouterProvider router={router} />
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
