// The main entrypoint file which is configured in `index.html` root 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from './app/provider/AppProvider'
import { App } from './app/App'
import './index.css'

// import { createBrowserRouter, RouterProvider } from 'react-router';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 

// import { QueryProvider } from './app/provider/QueryProvider.jsx';
// import routes from './routes.jsx';
// import { AuthProvider } from './context/AuthContext.jsx';

// const queryClient = new QueryClient();
// const routesRouter = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
    {/* <QueryProvider> */}
      {/* <AuthProvider> */}
        {/* <RouterProvider router = {routesRouter}/> */}
      {/* </AuthProvider> */}
    {/* </QueryProvider> */}
  </StrictMode>,
)
