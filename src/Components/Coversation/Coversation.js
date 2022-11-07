import React, { useEffect, useState } from 'react';
import './Coversation.css';
import defaultProfile from '../../images/defaultProfile.png';
import { baseUrl } from '../../utils/constantData/constantData';
import { format } from 'timeago.js';

const Coversation = ({ chat, currentUserId, online, lastMessage }) => {
    const [userData, setUserData] = useState(null);

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
    }, [chat, currentUserId])
    return (
        <div className='follower conversation'>
            <div className='conversesion-user'>
                {online && <div className="online-dot"></div>}
                {/* <img className='follower-img' src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + 'defaultProfile.png'} alt="" /> */}
                <img className='follower-img' src={defaultProfile} alt="" />
                <div className="userNameMsg">
                    <span className='user-name'>{userData?.name}</span>
                    {/* <span style={{ color: online ? "#51e200" : "" }}>{online ? "Online" : "Offline"}</span> */}
                    <div className='last-text-time'>
                        {lastMessage && <span>{lastMessage[0]?.text?.slice(0, 8) + '..'}</span>}
                        {lastMessage && <span>{format(lastMessage[0]?.createdAt)?.slice(0, 3)}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Coversation;