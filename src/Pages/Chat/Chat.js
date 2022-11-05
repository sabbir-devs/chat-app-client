import React, { useRef, useState } from 'react';
import './Chat.css';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Loading from '../../Components/Loading/Loading';
import { useEffect } from 'react';
import { baseUrl } from '../../utils/constantData/constantData';
import { io } from "socket.io-client";
import ChatBox from '../../Components/ChatBox/ChatBox';
import Coversation from '../../Components/Coversation/Coversation';

const Chat = () => {
    const { isLoading, user, error } = useSelector((state) => state.user)
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sendMessage, setSendMessage] = useState(null)
    const [reciveMessage, setReciveMessage] = useState(null)
    const socket = useRef()


    // get chats from server
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
                setChats(data.data)
            })
    }, [user])

    // connect to socket.io
    useEffect(() => {
        socket.current = io('http://localhost:6001');
        socket.current.emit("new-user-add", user._id);
        socket.current.on("get-users", (users) => {
            setOnlineUsers(users)
        });
    }, [user])

    // send message to the socket server
    useEffect(() => {
        if (sendMessage !== null) {
            socket.current.emit('send-message', sendMessage)
            console.log('send message on socket server', sendMessage)
        }
    }, [sendMessage])

    // get message from the socket server
    useEffect(() => {
        socket.current.on('recieve-message', (data) => {
            setReciveMessage(data)
            console.log('recived message', data)
        })

    }, [chats])

    // check online users
    useEffect(() => {

    },[])
    const handleOnlineStatus = (chat) => {
        const chatMember = chat?.members.find((member) => member !== user._id);
        const online = onlineUsers.find((user) => user.userId === chatMember)
        return online ? true : false
    }



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
                        <div key={chat._id} onClick={() => { setCurrentChat(chat) }}>
                            <Coversation currentUserId={user._id} chat={chat} online={handleOnlineStatus(chat)}></Coversation>
                        </div>))}
                </div>
            </div>
            {/* RIGHT SIDE Chat */}
            <div className="right-side-chat">
                <ChatBox currentChat={currentChat} setSendMessage={setSendMessage} reciveMessage={reciveMessage} currentUser={user._id} online={handleOnlineStatus(currentChat)}></ChatBox>
            </div>
        </div>
    );
};

export default Chat;