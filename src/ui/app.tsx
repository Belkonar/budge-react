import * as ReactDOM from 'react-dom/client';
import React from 'react';
import {
  createMemoryRouter,
  RouterProvider,
  useNavigate,
  Outlet,
} from "react-router-dom";
import Home from './components/home';
import { AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, PaletteMode, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Root() {
  const [state, setState] = React.useState({
    open: false,
  });

  const nav = useNavigate();

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, open: open });
  }

  const send = (location: string) => {
    toggleDrawer(false);
    nav(location);
  }

  return <div>
    <AppBar position='static'>
      <Toolbar variant='dense'>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Budge
        </Typography>

      </Toolbar>
    </AppBar>
    <Drawer
      anchor="left"
      open={state.open}
      onClose={toggleDrawer(false)}>
      <Box
        sx={{ width: 250 }}
        role="presentation">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => send('/')}>
              <ListItemText>
                Hi
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
    <Outlet />
  </div>
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
          path: "/",
          element: <Home />,
        },
        {
          path: "/a",
          element: <div>Hello world!</div>,
        },
      ]
    }
  ]);

  const darkTheme = createTheme({
    palette: {
      mode: state.mode,
    },
  });

  return <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>
}

function render() {
  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(
    <React.StrictMode>
      <AppRoot />
    </React.StrictMode>
  );
}

render();
