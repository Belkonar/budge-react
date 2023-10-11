import * as ReactDOM from 'react-dom/client';
import React from 'react';
import {
  createMemoryRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';
import Home from './components/home';
import { AppBar, Box, CssBaseline, Drawer, IconButton, PaletteMode, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import AccountsMenu from './components/menus/accounts-menu';
import ActionsMenu from './components/menus/actions-menu';
import AccountsComponent from './components/accounts';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountEditComponent from './components/account-edit';
import { AlertsComponent } from './components/alerts';
import { Provider } from 'react-redux';

import { store } from './main-store';

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

  const toggleTheme = () => {
    const newMode = state.mode === 'light' ? 'dark' : 'light';
    setTheme(newMode);
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
          <Box>
            <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
              {state.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
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
    <AlertsComponent />
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
        {
          path: '/account-new',
          element: <AccountEditComponent />,
        },
        {
          path: '/account-edit/:id',
          element: <AccountEditComponent />,
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />
}

function render() {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <AppRoot />
      </Provider>
    </React.StrictMode>
  );
}

render();
