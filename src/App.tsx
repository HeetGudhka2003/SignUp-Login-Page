import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import SignUp from "./components/SignUp";

import LoginForm from "./components/LoginForm";

const router = createBrowserRouter([

  {
    path: "/",

    element: <Navigate to="/signup" replace />
  },

  {
    path: "/signup",

    element: <SignUp />
  },
  {

    path: "/login",

    element: <LoginForm />
  }

]);

const App = () => {

  return <RouterProvider router={router} />;
  
};

export default App;