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

function Root() {
  return <div>
    <div data-bs-theme="dark">
      <nav data-bs-theme="dark" className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Budge</span>
        </div>
      </nav>
      <div className='container-fluid content-container'>
        <div className="row">
          <Nav />
          <div className="col">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
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

  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

render();
