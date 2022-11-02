import React, { useState } from 'react';
import './Chat.css';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Loading from '../Loading/Loading';
import { useEffect } from 'react';
import { baseUrl } from '../../utils/constantData/constantData.ts';
import ChatUsers from './ChatUsers';
import ChatBox from './ChatBox';

const Chat = () => {
    const { isLoading, user, error } = useSelector((state) => state.user)
    console.log(user)
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    console.log(chats)

    useEffect(() => {
        fetch(`${baseUrl}/chat/${user._id}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setChats(data.data)
            })
    }, [user._id])


    if (isLoading) {
        return <Loading></Loading>
    }
    if (error) {
        return toast.error(error.message);
    }
    return (
        <div className='chat'>
            {/* Left side Chat */}
            <div className="left-side-chat">
                <div className="chat-container">
                    <h2>Profile Setting</h2>
                </div>
                <div className="chat-list">
                    {chats?.map((chat) => (
                    <div onClick={() => {setCurrentChat(chat)}}>
                        <ChatUsers currentUserId={user._id} chat={chat} key={chat._id}></ChatUsers>
                    </div>))}
                </div>
            </div>
            {/* RIGHT SIDE Chat */}
            <div className="right-side-chat">
                <ChatBox currentChat={currentChat} currentUser={user._id}></ChatBox>
            </div>
        </div>
    );
};

export default Chat;