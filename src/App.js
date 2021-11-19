import './App.css';
import React, { useState } from 'react'
import { ethers } from 'ethers'
import metaMaskIcon from './metamask.png'
import ABI from './abi.json'


function App() {
  const [connButtonText, setConnButtonText] = useState('Connect to Ethereum')
  const [defaultAccount, setDefaultAccount] = useState(null)
  const [disableLoginBtn, setLoginBtnState] = useState(false)




  // console.log({provider})


  //Login Logic********************
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
  
//Help Popup***************
const [helpDisplay, setHelpDisplay]= useState(false)

const toggleHelp= () =>{
helpDisplay ? setHelpDisplay(false) : setHelpDisplay(true)
}

const showHelp = () =>{
return(
<div id='helpContainer'>
    <div>this is where all the helpful info goes</div>
    <div className="metamaskLink">
        <p>A free wallet extension for your browser is available from Metamask</p>
        <a href='https://metamask.io/'><img src={metaMaskIcon} alt='link to MetaMask'/></a>
    </div>
</div>
)
}

const hideHelp = () =>{
    return(
    <div></div>
 )
}

const helpBtn= () =>{
return(
    <div id="helpButton">
        <button onClick={toggleHelp}>help</button>
        {helpDisplay?showHelp():hideHelp()}
    </div>
)
}





  //Interact with Contract****************
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contractAddress='0x5c587a0ace97d103c6f81ec1bb5e75deb1725803'
  const contractAbi= ABI
  const contractSigner= provider.getSigner()
  const contract= new ethers.Contract(contractAddress, contractAbi, contractSigner)
  const[contractRandomNum, setContractRandomNum] = useState('')
  
  let randomNum
  let tempRandomNum
  
  const fetchRandomNumber = async()=>{
    await contract.getRandomNumber()
    tempRandomNum = await contract.randomResult()
    randomNum=tempRandomNum.toString()
    console.log(randomNum)
    setContractRandomNum(randomNum)
    // randomNum=0
    tempRandomNum=0
  }

  const getResultBtn = () =>{
    return(
      <button onClick={fetchRandomNumber}>get results</button>
    )
  }

  //Password Generator Logic********************************************
  //77 numbers to 11 random characters
  //7 numbers to 1 random characters 11 times
  //3 lower 3 upper 3 num 2 special

let contractRandomArr=contractRandomNum.split('')

const lowerCase= 'abcdefghijklmnopqrstuvwxyz'
const lowerCaseArr= lowerCase.split('')
const upperCase= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const upperCaseArr=upperCase.split('')
const numSet   = '1234567890'
const numSetArr= numSet.split('')
const specialSet='!@#$%^&*()?/*-+'
const specialSetArr=specialSet.split('')
let randomNumArr=[]


for(let i=0, j=0, k=7;i<3;i++, j+=7, k+=7) {
  let newLowerArr=contractRandomArr.slice(j,k)
  let newNewLowerArr=newLowerArr.join('')
  randomNumArr.push(lowerCaseArr[(newNewLowerArr%lowerCaseArr.length)])
}

for(let i=0, j=21, k=28;i<3;i++, j+=7, k+=7) {
  let newUpperArr=contractRandomArr.slice(j,k)
  let newNewUpperArr=newUpperArr.join('')
  randomNumArr.push(upperCaseArr[(newNewUpperArr%upperCaseArr.length)])
}

for(let i=0, j=42, k=49;i<3;i++, j+=7, k+=7) {
  let newNumArr=contractRandomArr.slice(j,k)
  let newNewNumArr=newNumArr.join('')
  randomNumArr.push(numSetArr[(newNewNumArr%numSetArr.length)])
}

for(let i=0, j=63, k=70;i<2;i++, j+=7, k+=7) {
  let newSpecialArr=contractRandomArr.slice(j,k)
  let newNewSpecialArr=newSpecialArr.join('')
  randomNumArr.push(specialSetArr[(newNewSpecialArr%specialSetArr.length)])
}

const [showPass, setShowPass] = useState(false)

const showPassBtn=()=>{
  return(
    <div id='showPassBtn'>
      {showPass?passDisplay():hidePassDisplay()}
      <button onClick={toggleShowPass}>Show Password</button>
    </div>
  )
}

const toggleShowPass=()=>{
showPass?setShowPass(false):setShowPass(true)
}

const passDisplay=()=>{
  return(
    <div id='passwordContainer'>
      <div className='passwordChar'>{randomNumArr[0]}</div>
      <div className='passwordChar'>{randomNumArr[1]}</div>
      <div className='passwordChar'>{randomNumArr[2]}</div>
      <div className='passwordChar'>{randomNumArr[3]}</div>
      <div className='passwordChar'>{randomNumArr[4]}</div>
      <div className='passwordChar'>{randomNumArr[5]}</div>
      <div className='passwordChar'>{randomNumArr[6]}</div>
      <div className='passwordChar'>{randomNumArr[7]}</div>
      <div className='passwordChar'>{randomNumArr[8]}</div>
      <div className='passwordChar'>{randomNumArr[9]}</div>
      <div className='passwordChar'>{randomNumArr[10]}</div>
    </div>
  )
}

const hidePassDisplay=()=>{
  return(
    <div></div>
  )
}

console.log('heyhey',randomNumArr)


  //App Display**********************
  return (
    <div className="App">
      <h1>helloworld</h1>
      {loginHandlerBtn()}
      {helpBtn()}
      {getResultBtn()}
      {showPassBtn()}
    </div>
  );
}

export default App;
