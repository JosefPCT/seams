import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 

import { QueryProvider } from './provider/QueryProvider.jsx';
import './index.css'
import routes from './routes.jsx';

// import { AuthProvider } from './context/AuthContext.jsx';
// const queryClient = new QueryClient();
const routesRouter = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      {/* <AuthProvider> */}
        <RouterProvider router = {routesRouter}/>
      {/* </AuthProvider> */}
    </QueryProvider>
  </StrictMode>,
)
