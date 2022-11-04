import React from 'react';
import './Chat.css';
import { useEffect } from 'react';
import { useState } from 'react';
import { baseUrl } from '../../utils/constantData/constantData';
import defaultProfile from '../../images/defaultProfile.png';

const ChatUsers = ({ chat, currentUserId }) => {
    const [userData, setUserData] = useState(null);
    console.log(chat)
    // console.log('current user id',currentUserId)

    useEffect(() => {
        const userId = chat.members.find((id) => id !== currentUserId);
        fetch(`${baseUrl}/user/${userId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setUserData(data.data)
            })
    }, [chat.members, currentUserId])

    return (
        <div className='follower conversation'>
            <div className='conversesion-user'>
                <div className="online-dot"></div>
                {/* <img className='follower-img' src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + 'defaultProfile.png'} alt="" /> */}
                <img className='follower-img' src={defaultProfile} alt="" />
                <div className="userNameMsg">
                    <span className='user-name'>{userData?.name}</span>
                    <span className='online-offline'>Online</span>
                </div>
            </div>
        </div>
    );
};

export default ChatUsers;