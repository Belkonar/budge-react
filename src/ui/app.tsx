import * as ReactDOM from 'react-dom/client';
import React from 'react';
import {
  createBrowserRouter,
  createMemoryRouter,
  MemoryRouter,
  Route,
  Routes,
  RouterProvider,
  useNavigate,
  Outlet,
} from "react-router-dom";
import Home from './components/home';
import Nav from './nav';
import { AppBar, Box, Button, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { dark } from '@mui/material/styles/createPalette';

function Root() {
  const [state, setState] = React.useState({
    open: false,
  });

  const nav = useNavigate();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
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

function render() {
  const root = ReactDOM.createRoot(document.getElementById('root')!);

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
      mode: 'dark',
    },
  });

  root.render(
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  );
}

render();
