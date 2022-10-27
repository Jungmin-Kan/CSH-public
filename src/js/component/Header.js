import React, { useState, useEffect } from 'react';
import {
    HashRouter,
    Routes,
    Route,
    Link
  } from "react-router-dom";
const Header = () => {
    let styles = {
      nav_container: { flex: 1, display: 'inline-flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1, backgroundColor: '#333' },
      nav: { padding: 10, flex: 1, textAlign: 'center', height: '100%', textDecoration: 'none', fontSize: 20, color: '#ffffff', fontWeight: 'bold' }
    }
    const [eventControl, setEventControl] = useState(false);
    const _onMouseOver = (_this) => {
      if (!eventControl) {
        _this.target.style.backgroundColor = "#4271ff";
      }
    }
    const _onMouseOut = (_this) => {
      if (!eventControl) {
        _this.target.style.backgroundColor = "#333";
      }
    }
    const _onClick = (_this) => {
      _this.target.parentNode.childNodes.forEach((value, index, arr) => { value.style.backgroundColor = "#333" })
      _this.target.style.backgroundColor = "#04AA6D";
      setEventControl(true);
      setTimeout(() => { setEventControl(false); }, 500);
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={styles.nav_container}>
  
          <Link to="/" style={styles.nav} onMouseOver={_onMouseOver} onMouseOut={_onMouseOut}
            onClick={_onClick}>Home</Link>
  
          <Link to="/RestaurantList" style={styles.nav} onMouseOver={_onMouseOver} onMouseOut={_onMouseOut}
            onClick={_onClick}>RestaurantList</Link>
  
          <Link to="/NoticeList" style={styles.nav} onMouseOver={_onMouseOver} onMouseOut={_onMouseOut}
            onClick={_onClick}>NoticeList</Link>
        </div>
      </div>
    );
  }

  export default Header;