import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PropertiesPage from "./PropertiesPage"

import RealEstatePremium from "./RealEstatePremium"
import About from "./CasaVivaAbout"
import BookAVisit  from './BookAVisit';



function App() {

  const router = createBrowserRouter([

    {
      path:"/PropertiesPage",
      element: <PropertiesPage/> 
    },
     {
      path:"/about",
      element: <About/> 
    },
     {
      path:"/about",
      element: <About/> 
    },
     {
      path:"/BookAVisit",
      element: <BookAVisit/> 
    },
     {
      path:"/",
      element: <RealEstatePremium/> 
    }
    

  ]);

  return (
    <>
      {/*<SignIn/> */}
      <RouterProvider router={router} />
      <filter/>

    </>
  );
}

export default App;
