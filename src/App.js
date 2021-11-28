import './App.css';
import React, { useState } from 'react'
import { ethers } from 'ethers'
import metaMaskIcon from './metamask.png'
import ABI from './abi.json'
import ReactDOM from 'react-dom';
import errorbackground from './errorbackground.png'



function App() {
  const [connButtonText, setConnButtonText] = useState('Connect to Ethereum')
  const [defaultAccount, setDefaultAccount] = useState(null)
  const [disableLoginBtn, setLoginBtnState] = useState(false)





  window.addEventListener('load', function() {
    if (typeof web3 !== 'undefined') {
      console.log('Web3 installed')
    } else {
      console.log('No Web3 detected')  
      // alert("No Web3 Device Detected. Please install Metamask from www.metamask.io")
      ReactDOM.render(noWeb3, document.getElementById('root'))
    }
  
  });


  const noWeb3=(
      <div id='helpPage'>
        <h1 className='helpTitle'>Cannot connect to Web3 Random Password Generator</h1>
        <div id='helpContainer'>
          <h2> Error- no Web3 identity detected </h2>
          <p>But no problem! We can fix that! <a href='https://metamask.io'>Metamask</a> is a free browser extension which allows you to interact with blockchains and securely store assets like NFTS and cryptocurrencies.</p>
          <div className="metamaskLink">
              <a href='https://metamask.io/'><img id='metaMaskImg' src={metaMaskIcon} alt='link to MetaMask'/></a>
          </div>
          <p>Install metamask and reload this page to continue to Web3 Password Generator</p>
        </div>
      <img id='errorBkgImg' src={errorbackground} alt='error Background'></img>
      </div>
    )


  //Login Logic********************
  const loginHandler= ()=>{
    if (window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' })
    .then (result =>{
      accountChangeHandler(result[0])
      setConnButtonText('Wallet Connected at:  ')
      setLoginBtnState(true)
      setLoginBtnClass('disabledBtn')
      setAppClass('AppLoggedIn')
      setTitleClass('titleClassLoggedIn')
      setAppDescriptionClass('appDescriptionClassLoggedIn')
      setFooterClass('loggedInFooter')
      setBubbleDisplayClass('bubble')
    })
    }else{
      setConnButtonText('Need to Install Metamask')
    }  

    const accountChangeHandler = (newAccount)=>{
      setDefaultAccount(newAccount)
      console.log(defaultAccount)
  }
  }

  const[loginBtnClass, setLoginBtnClass]=useState('button')
  const loginHandlerBtn=()=>{
    return(
      <div>
        <button onClick={loginHandler} disabled={disableLoginBtn} className={loginBtnClass}>{connButtonText}{defaultAccount}</button>
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
    // console.log(randomNum)
    setContractRandomNum(randomNum)
    tempRandomNum=0
    setResultBtnDisabled(true)
    setResultBtnTxt('Randomness Retrieved Successfully')
    setResultBtnClass('disabledBtn')
    setPassShowBtn(false)
    setPassShowBtnClass('button')
  }


  const[resultBtnDisabled, setResultBtnDisabled]=useState(false)
  const[resultBtnTxt, setResultBtnTxt]=useState('Initiate Randomness From Blockchain')
  const[resultBtnClass, setResultBtnClass]=useState('button')



  const getResultBtn = () =>{
    return(
      <button onClick={fetchRandomNumber}  className={resultBtnClass} disabled={resultBtnDisabled} >{resultBtnTxt}</button>
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

//suffle randomNumArr and return randomNumArrShuffled
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const randomNumArrShuffled=shuffle(randomNumArr)

const [passShowBtnClass, setPassShowBtnClass]= useState('disabledBtn')
const [passShowBtn, setPassShowBtn]= useState(true)

const showPassBtn=()=>{
  return(
    <div id='showPassBtn'>
      {showPassDisplay}
      <button onClick={toggleShowPass} className={passShowBtnClass}  disabled={passShowBtn}>Show Password</button>
    </div>
  )
}

const toggleShowPass=()=>{
  setPassDisplay(passDisplay())
  setPassShowBtnClass('disabledBtn')
  setPassShowBtn(true)

}

const passDisplay=()=>{
  return(
    <div>
    <div id='passwordContainer'>
      <div className='passwordChar'>{randomNumArrShuffled[0]}</div>
      <div className='passwordChar'>{randomNumArrShuffled[1]}</div>
      <div className='passwordChar'>{randomNumArrShuffled[2]}</div>
      <div className='passwordChar'>{randomNumArrShuffled[3]}</div>
      <div className='passwordChar'>{randomNumArrShuffled[4]}</div>
      <div className='passwordChar'>{randomNumArrShuffled[5]}</div>
      <div className='passwordChar'>{randomNumArrShuffled[6]}</div>
      <div className='passwordChar'>{randomNumArrShuffled[7]}</div>
      <div className='passwordChar'>{randomNumArrShuffled[8]}</div>
      <div className='passwordChar'>{randomNumArrShuffled[9]}</div>
      <div className='passwordChar'>{randomNumArrShuffled[10]}</div>
    </div>
    {copyToClipboard()}
    </div>
  )
}

const hidePassDisplay=()=>{
  return(
    <div id='passwordContainer'>
      <div className='passwordCharBlur'>{randomNumArrShuffled[1]}</div>
      <div className='passwordCharBlur'>{randomNumArrShuffled[0]}</div>
      <div className='passwordCharBlur'>{randomNumArrShuffled[2]}</div>
      <div className='passwordCharBlur'>{randomNumArrShuffled[3]}</div>
      <div className='passwordCharBlur'>{randomNumArrShuffled[4]}</div>
      <div className='passwordCharBlur'>{randomNumArrShuffled[5]}</div>
      <div className='passwordCharBlur'>{randomNumArrShuffled[6]}</div>
      <div className='passwordCharBlur'>{randomNumArrShuffled[7]}</div>
      <div className='passwordCharBlur'>{randomNumArrShuffled[8]}</div>
      <div className='passwordCharBlur'>{randomNumArrShuffled[9]}</div>
      <div className='passwordCharBlur'>{randomNumArrShuffled[10]}</div>
    </div>
  )
}
const [showPassDisplay, setPassDisplay]=useState(hidePassDisplay())

//button to copy to clipboard
const copyToClipboard=()=>{
  return(
    <div>
      <button id='copyBtn' onClick={() => {navigator.clipboard.writeText(randomNumArrShuffled.join(''))}} className="button">copy to clipboard</button>

    </div>

  )
}

// console.log('heyhey',randomNumArrShuffled)

const [appClass, setAppClass] = useState('App')
const [titleClass, setTitleClass] = useState('title')
const [appDescriptionClass, setAppDescriptionClass] = useState('appDescription')
const [footerClass, setFooterClass] =useState('notLoggedInFooter')
const [bubbleDisplayClass, setBubbleDisplayClass] = useState('disableBubble')

  //App Display**********************
  return (
    <div className={appClass}>
      <div className="container">
        <div className="header">
          {loginHandlerBtn()}
        </div>
          <h1 className={titleClass}>Random Password Generator</h1>
          <h2 className={appDescriptionClass}>A Web3 solution to
            <span className="span r"> R</span>
            <span className="span a">a</span>
            <span className="span n1">N</span>
            <span className="span d">d</span>
            <span className="span o">o</span>
            <span className="span m">m</span>
            <span className="span n">n</span>
            <span className="span e">e</span>
            <span className="span s1">S</span>
            <span className="span s">s</span>
          . <br/><br/>Generate a new password in seconds with cryptographic proof of how that password was generated by leveraging the security and tamper-resistant properties of the Ethereum blockchain.</h2>
              <div className={bubbleDisplayClass}>
                <div id='bubble1'></div>
                <div id='bubble2'></div>
                <div id='bubble3'></div>
              </div>
        </div>
      <div className={footerClass}>
        {getResultBtn()}
        {showPassBtn()}
      </div>
    </div>
  );
}

export default App;
