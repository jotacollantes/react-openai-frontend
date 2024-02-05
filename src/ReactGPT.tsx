import { RouterProvider } from 'react-router-dom';
import { router } from './presentation/router/router';

export const ReactGPT = () => {
  return (
    //Mostrar el proveedor de rutas
    <RouterProvider router={ router } />
  )
}