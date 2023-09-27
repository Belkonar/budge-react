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
} from "react-router-dom";

function MyHome() {
  const nav = useNavigate();

  const handleClick = () => {
    nav('/a');
  }

  return <button onClick={handleClick}>Hi</button>
}

function render() {
  const root = ReactDOM.createRoot(document.getElementById('root')!);

  const router = createMemoryRouter([
    {
      path: "*",
      element: <MyHome />,
    },
    {
      path: "/a",
      element: <div>Hello world!</div>,
    }
  ]);

  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

render();
