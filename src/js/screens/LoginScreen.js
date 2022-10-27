import React, { useState, useEffect } from 'react';

const LoginScreen = ({ setIsLogedin }) => {
    return (
  
      <div className="bg-img">
        <form className="container" onSubmit={() => {
          setIsLogedin(true)
        }}>
          <h1>로그인</h1>
          <label for="email"><b>Email</b></label>
          <input type="text" placeholder="Enter Email" name="email" required />
          <label for="psw"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name="psw" required />
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
  
    )
  }

export default LoginScreen;