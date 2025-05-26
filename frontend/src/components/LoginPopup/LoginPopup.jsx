import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"

const LoginPopup = ({setShowLogin}) => {
  const {url, setToken} = useContext(StoreContext)
  
  const [currState, setCurrState] = useState("Login")
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })
  
  // State for error handling
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]: value}))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const onLogin = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }

    try {
      const response = await axios.post(newUrl, data);
      
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token)
        setShowLogin(false)
      } else {
        // Handle specific error messages
        const message = response.data.message;
        
        if (currState === "Login") {
          if (message.toLowerCase().includes("password")) {
            setError("❌ Incorrect password. Please try again.")
          } else if (message.toLowerCase().includes("user") || message.toLowerCase().includes("email")) {
            setError("❌ User not found. Please check your email or sign up.")
          } else {
            setError(`❌ Login failed: ${message}`)
          }
        } else {
          // Registration errors
          if (message.toLowerCase().includes("exist") || message.toLowerCase().includes("already")) {
            setError("❌ Account already exists. Please login instead.")
          } else if (message.toLowerCase().includes("email")) {
            setError("❌ Invalid email address.")
          } else {
            setError(`❌ Registration failed: ${message}`)
          }
        }
      }
    } catch (error) {
      // Network or server errors
      if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || "Server error occurred";
        
        if (currState === "Login") {
          if (error.response.status === 401) {
            setError("❌ Invalid credentials. Please check your email and password.")
          } else if (error.response.status === 404) {
            setError("❌ User not found. Please check your email or sign up.")
          } else {
            setError(`❌ Login failed: ${message}`)
          }
        } else {
          if (error.response.status === 409) {
            setError("❌ Account already exists. Please login instead.")
          } else if (error.response.status === 400) {
            setError("❌ Invalid information provided. Please check your details.")
          } else {
            setError(`❌ Registration failed: ${message}`)
          }
        }
      } else if (error.request) {
        // Network error
        setError("❌ Network error. Please check your internet connection.")
      } else {
        // Other errors
        setError("❌ An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        
        {/* Error Message Display */}
        {error && (
          <div className="error-message" style={{
            background: '#ffe6e6',
            border: '1px solid #ff4444',
            borderRadius: '5px',
            padding: '10px',
            margin: '10px 0',
            color: '#cc0000',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <div className="login-popup-inputs">
          {currState === "Login" ? <></> : 
            <input 
              name='name' 
              onChange={onChangeHandler} 
              value={data.name} 
              type="text" 
              placeholder='Your name' 
              required
            />
          }
          <input 
            name='email' 
            onChange={onChangeHandler} 
            value={data.email} 
            type="email" 
            placeholder='Your email' 
            required
          />
          <input 
            name='password' 
            onChange={onChangeHandler} 
            value={data.password} 
            type="password" 
            placeholder='Password' 
            required
          />
        </div>
        
        <button type='submit' disabled={isLoading} style={{
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}>
          {isLoading ? 'Please wait...' : (currState === "Sign Up" ? "Create account" : "Login")}
        </button>
        
        <div className="login-popup-condition">
          <input type="checkbox" required/>
          <p className='continuee'>By continuing, i agree to the terms of use & privacy policy</p>
        </div>
        
        {currState === "Login"
          ? <p>Create a new account? <span onClick={() => {setCurrState("Sign Up"); setError("")}}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => {setCurrState("Login"); setError("")}}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup