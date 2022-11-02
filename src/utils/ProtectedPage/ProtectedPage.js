import React from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from '../../Components/Loading/Loading';

const ProtectedPage = ({children}) => {
    const {isLoading, user, error} = useSelector((state) => state.user)
    const location = useLocation();
    if(isLoading){
        return <Loading></Loading>
    }
    if(error){
        return toast.error(error.messge);
    }
    if(!user){
        return <Navigate to={"/login"} state={{from:location}} replace={true}></Navigate>
    }
    return children;
};

export default ProtectedPage;