import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillEye, AiFillEyeInvisible, AiOutlineExclamationCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signupUser } from '../../lib/reducers/authSlice';
import Loading from '../Loading/Loading';
import './Signup.css';

const Signup = () => {
    const [passwordEye, setPassworeEye] = useState(false)
    const [confirmPasswordEye, setConfirmPassworeEye] = useState(false)
    const [nameError, setNameError] = useState("")
    const [userError, setUserError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    const dispatch = useDispatch();

    const {isLoading, user, error} = useSelector((state) => state.user)
    console.log(user)
    
    const handleLoginSubmit = (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const username = event.target.username.value.toLowerCase();;
        const password = event.target.password.value;
        const confirmPassword = event.target.confirmPassword.value;
        console.log(name, username, password, confirmPassword)
        if (event.target.name.value === '') {
            return setNameError('Enter your name')
        }
        else if (event.target.username.value === '') {
            return setUserError('Enter your username')
        }
        else if (event.target.username.value.length<4) {
            return setUserError('Password length must be atleast 4 characters')
        }
        else if (event.target.password.value === '') {
            return setPasswordError("Password field is empty")
        }
        else if (event.target.password.value.length < 6) {
            return setPasswordError("Password length must be atleast 6 characters")
        }
        else if (event.target.confirmPassword.value === '') {
            return setConfirmPasswordError("Confirm password field is empty")
        }
        else if (event.target.password.value !== event.target.confirmPassword.value) {
            return setConfirmPasswordError("password are not same")
        }
        const forminput = { name, username, password, confirmPassword };
        dispatch(signupUser(forminput));
        event.target.reset();
        // fetch(`${baseUrl}/user/signup`, {
        //     method: "POST",
        //     headers: {
        //         'content-type': 'application/json',
        //         authorization: `Bearer ${localStorage.getItem("accessToken")}`
        //     },
        //     body: JSON.stringify(forminput)
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log(data)
        //         event.target.reset();
        //         localStorage.setItem('accessToken', data.access_token)
        //         if (data.error.includes('username_1 dup key')) {
        //             return toast.error('username alrady taken try something unic')
        //         }
        //         if (data.status === "success" || data.status === "success!") {
        //             return toast.success(data.message);
        //         }
        //     })
    }
    const checkUsernameText = (e) => {
        const username = e.target.value;
        for (var i = 0; i<username.length; i++) {
            if (username[i] !== username[i].toUpperCase()
                && username[i] === username[i].toLowerCase()) {
                setUserError("")
            }else{
                setUserError('Username All letter Are takken Lowercase')

            }
        }
        
    }
    if(isLoading){
        return <Loading></Loading>
    }
    if(error){
        return toast.error(error.message)
    }
    return (
        <div className='signup'>
            <form onSubmit={handleLoginSubmit} className="form glass">
                <h1>Create Accout</h1>
                <div className='form-inputs'>
                    <label htmlFor='name'><span>Your Name</span></label>
                    <input type="text" name="name" onChange={() => { setNameError('') }} id="name" />
                    {nameError && <p className='error-text'><AiOutlineExclamationCircle style={{ marginRight: "3px", fontSize: "16px" }}></AiOutlineExclamationCircle>{nameError}</p>}
                </div>
                <div className='form-inputs'>
                    <label htmlFor='username'><span>Username</span></label>
                    <input type="text" name="username" onChange={(e) => {checkUsernameText(e)}} id="username" />
                    {userError && <p className='error-text'><AiOutlineExclamationCircle style={{ marginRight: "3px", fontSize: "16px" }}></AiOutlineExclamationCircle>{userError}</p>}
                </div>
                <div className='form-inputs'>
                    <label htmlFor='password'><span>Password</span></label>
                    <input type={passwordEye ? "text" : "password"} onChange={() => { setPasswordError("") }} name="password" id="password" />
                    <span className='eye' onClick={() => { setPassworeEye(!passwordEye) }}>{passwordEye ? <AiFillEyeInvisible className='eye-icon'></AiFillEyeInvisible> : <AiFillEye className='eye-icon'></AiFillEye>}</span>
                    {passwordError && <p className='error-text'><AiOutlineExclamationCircle style={{ marginRight: "3px", fontSize: "16px" }}></AiOutlineExclamationCircle>{passwordError}</p>}
                </div>
                <div className='form-inputs'>
                    <label htmlFor='confirmPassword'><span>Confirm Password</span></label>
                    <input type={confirmPasswordEye ? "text" : "password"} onChange={() => { setConfirmPasswordError('') }} name="confirmPassword" id="confirmPassword" />
                    <span className='eye' onClick={() => { setConfirmPassworeEye(!confirmPasswordEye) }}>{confirmPasswordEye ? <AiFillEyeInvisible className='eye-icon'></AiFillEyeInvisible> : <AiFillEye className='eye-icon'></AiFillEye>}</span>
                    {confirmPasswordError && <p className='error-text'><AiOutlineExclamationCircle style={{ marginRight: "3px", fontSize: "16px" }}></AiOutlineExclamationCircle>{confirmPasswordError}</p>}
                </div>
                <div className='form-inputs'>
                    <p className='dont-have'>Alrady have accout? <Link to={"/login"} className="creat-accout">Login</Link></p>
                </div>
                <input type="submit" value="Create Account" className='login-btn' />
            </form>
        </div>
    );
};

export default Signup;