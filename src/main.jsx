import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { router } from './Component/Routes/Routes.jsx';
import AuthProvider from './Component/Authentication/AuthProvider/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>

      <div className='max-w-screen-2xl mx-auto'>
        <RouterProvider router={router} />
      </div>

    </AuthProvider>
  </React.StrictMode>
)
