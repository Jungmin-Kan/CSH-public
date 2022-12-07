import React, { useState, useEffect } from 'react';

const LoginScreen = ({ setIsLogedin }) => {
    return (
  
      <div className="bg-img">
        <form className="container" onSubmit={() => {
          setIsLogedin(true)
        }}>
          <h1>로그인</h1>
          <label for="email"><b>아이디</b></label>
          <input type="text" placeholder="아이디" name="email" required />
          <label for="psw"><b>비밀번호</b></label>
          <input type="password" placeholder="비밀번호" name="psw" required />
          <button type="submit" className="btn">로그인</button>
        <p>* 회원가입이 필요할 경우 관리자에게 문의하십시오.</p>
        </form>
      </div>
  
    )
  }

export default LoginScreen;



/**
 * 
 * 식당이름?
 * 
 */