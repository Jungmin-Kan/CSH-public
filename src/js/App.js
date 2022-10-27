import React, { useState, useEffect } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import '../css/App.css';
import Header from './component/Header';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import NoticeListScreen from './screens/NoticeListScreen';
import RestaurantListScreen from './screens/RestaurantListScreen';



const App = () => {
  
  const [isLogedin, setIsLogedin] = useState(false);

  if (isLogedin) {
    return (
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/RestaurantList/*" element={<RestaurantListScreen />} />
          <Route path="/NoticeList/*" element={<NoticeListScreen />} />
        </Routes>
      </HashRouter>
    )
  }
  return ( <LoginScreen setIsLogedin={setIsLogedin} />)
}

export default App;