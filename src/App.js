import './App.css';
import React, { useState } from 'react'
import { ethers } from 'ethers'


function App() {
  const [connButtonText, setConnButtonText] = useState('Connect to Ethereum')
  const [defaultAccount, setDefaultAccount] = useState(null)
  const [disableLoginBtn, setLoginBtnState] = useState(false)



  // const provider = new ethers.providers.Web3Provider(window.ethereum)

  // console.log({provider})


  //Login Logic
  const loginHandler= ()=>{
    if (window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' })
    .then (result =>{
      accountChangeHandler(result[0])
      setConnButtonText('Wallet Connected at:  ')
      setLoginBtnState(true)
    })
    }else{
      setConnButtonText('Need to Install Metamask')
    }  

    const accountChangeHandler = (newAccount)=>{
      setDefaultAccount(newAccount)
      console.log(defaultAccount)
  }
  }

  const loginHandlerBtn=()=>{
    return(
      <div>
        <button onClick={loginHandler} disabled={disableLoginBtn}>{connButtonText}{defaultAccount}</button>
      </div>
    )
  }
  

  //Interact with Contract
  

  //App Display
  return (
    <div className="App">
      <h1>helloworld</h1>
      {loginHandlerBtn()}
    </div>
  );
}

export default App;
