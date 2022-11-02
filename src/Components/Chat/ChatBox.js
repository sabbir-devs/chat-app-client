import React, { useState } from 'react';
import { useEffect } from 'react';
import './Chat.css';
import { baseUrl } from '../../utils/constantData/constantData.ts';
import defaultProfile from '../../images/defaultProfile.png';
import { format } from 'timeago.js';
import { BsImages } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { BiConversation } from 'react-icons/bi';
import InputEmoji from 'react-input-emoji';

const ChatBox = ({ currentChat, currentUser, }) => {
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState('');

    const handleChange = (newMessage) => {
        setNewMessages(newMessage)
    }
    const selectImage = (e) => {

    }

    useEffect(() => {
        const userId = currentChat?.members?.find((id) => id !== currentUser);

        console.log('another user id', userId)
        fetch(`${baseUrl}/user/${userId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log('another user', data.data)
                setUserData(data.data)
            })
    }, [currentChat, currentUser]);

    useEffect(() => {
        if (currentChat !== null) {
            fetch(`${baseUrl}/message/${currentChat._id}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setMessages(data.data)
                })
        }
    }, [currentChat])
    return (
        <div className='chat-box-wrapper'>
            {currentChat ? (<><div className="chat-box-container">
                <div className='conversesion-user chat-box-conversesion'>
                    <div className="online-dot"></div>
                    {/* <img className='follower-img' src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + 'defaultProfile.png'} alt="" /> */}
                    <img className='follower-img' src={defaultProfile} alt="" />
                    <div className="userNameMsg">
                        <span className='user-name'>{userData?.name}</span>
                    </div>
                </div>
            </div>
                <div className="chat-body">
                    {messages?.map(message => (
                        <div key={message._id}>
                            <div className={message.senderId === currentUser ? 'message own' : 'message'}>
                                <p className='message-text'>{message.text}</p>
                                <p className='message-time'>{format(message.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Chat Sender */}
                <div className="chat-sender">
                    <button className="send-images" onClick={() => selectImage()}><BsImages></BsImages></button>
                    <InputEmoji style={{ width: "500px" }}
                        value={newMessages}
                        onChange={handleChange}
                    />
                    <div className='send-button'><IoSend className='send-button-icon'></IoSend></div>
                </div></>) : (
                <div className='tap-on-chat'>
                    <p className='tap-on-chat-text'>Tap on a Chat to start Conversation <BiConversation style={{fontSize:"35px", margin:"10px 0 0 10px"}}></BiConversation></p>
                </div>
            )}

        </div>
    );
};

export default ChatBox;