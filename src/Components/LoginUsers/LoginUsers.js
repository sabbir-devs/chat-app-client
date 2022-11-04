import React, { useState } from 'react';
import './LoginUsers.css';
import { AiFillEye, AiFillEyeInvisible, AiOutlineExclamationCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../lib/reducers/authSlice';
import Loading from '../Loading/Loading';
import toast from 'react-hot-toast';

const LoginUsers = () => {
    const [passwordEye, setPassworeEye] = useState(false)
    const [userError, setUserError] = useState("")
    const [passwordError, setPasswordError] = useState("");
    const dispatch = useDispatch();
    
    const {isLoading, user, error} = useSelector((state) => state.user)
    console.log(user)

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        if (event.target.username.value === '') {
            return setUserError('Enter your username')
        }
        if (event.target.password.value === '') {
            return setPasswordError("Enter Password")
        }
        const forminput = { username, password };
        dispatch(loginUser(forminput))
        event.target.reset();

        
        // fetch(`${baseUrl}/user/login`, {
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
        //         if (data.status === "fail" || data.status === "fail!") {
        //             return toast.error(data.message)
        //         }
        //         if (data.status === "success" || data.status === "success!") {
        //             navigate('/', { replace: true })
        //             return toast.success(`Welcome ${data.data[0].name}`)
        //         }
        //     })
    }
    if(isLoading){
        return <Loading></Loading>
    }
    if(error){
        return toast.error(error.message)
    }
    
    // left color code: #9e03a3
    // middle color code: #2199eC
    // right color code: #00ffff
    return (
        <div className='login'>
            <form onSubmit={handleLoginSubmit} className="form glass">
                <h1>Please Login!</h1>
                <div className='form-inputs'>
                    <label htmlFor='username'><span>Username</span></label>
                    <input onChange={() => { setUserError('') }} type="text" name="username" id="username" />
                    {userError && <p className='error-text'><AiOutlineExclamationCircle style={{ marginRight: "3px", fontSize: "16px" }}></AiOutlineExclamationCircle>{userError}</p>}
                </div>
                <div className='form-inputs'>
                    <label htmlFor='password'><span>Password</span></label>
                    <input type={passwordEye ? "text" : "password"} onChange={() => { setPasswordError("") }} name="password" id="password" />
                    <span className='eye' onClick={() => { setPassworeEye(!passwordEye) }}>{passwordEye ? <AiFillEyeInvisible className='eye-icon'></AiFillEyeInvisible> : <AiFillEye className='eye-icon'></AiFillEye>}</span>
                    {passwordError && <p className='error-text'><AiOutlineExclamationCircle style={{ marginRight: "3px", fontSize: "16px" }}></AiOutlineExclamationCircle>{passwordError}</p>}
                </div>
                <div className='form-inputs'>
                    <p className='dont-have'>don't have accout? <Link to={"/signup"} className="creat-accout">Create Accout</Link></p>
                </div>
                <input type="submit" value="Login" className='login-btn' />
            </form>
        </div>
    );
};

export default LoginUsers;