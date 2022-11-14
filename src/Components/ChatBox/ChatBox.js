import React, { useEffect, useRef, useState } from 'react';
import { BiConversation, BiLeftArrowAlt } from 'react-icons/bi';
import { BsImages } from 'react-icons/bs';
import { IoCall, IoSend } from 'react-icons/io5';
import { FaBell, FaUserAlt, FaVideo } from 'react-icons/fa';
import { HiExclamationCircle } from 'react-icons/hi';
import { baseUrl } from '../../utils/constantData/constantData';
import myImage from '../../images/men-img-1.jpg';
import InputEmoji from 'react-input-emoji';
import './ChatBox.css';
import { format } from 'timeago.js';
import ChatBoxAccordion from '../ChatBoxAccordion/ChatBoxAccordion';


const ChatBox = ({ currentChat, setSendMessage, reciveMessage, currentUser, online, setLastMessage }) => {
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState('');
    const [profileDetails, setProfileDetails] = useState(false)
    const scroll = useRef();
    const imageRef = useRef();

    // send last chat to parent component
    useEffect(() => {
        setLastMessage(messages.slice(-1))
    }, [messages, setLastMessage])

    useEffect(() => {
        if (reciveMessage !== null && reciveMessage.chatId === currentChat._id) {
            setMessages([...messages, reciveMessage])
        }
    }, [currentChat, reciveMessage])


    useEffect(() => {
        const userId = currentChat?.members?.find((id) => id !== currentUser);

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
    }, [currentChat, currentUser]);

    // fetch messages
    useEffect(() => {
        if (currentChat !== null) {
            fetch(`${baseUrl}/message/${currentChat._id}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
            })
                .then(res => res.json())
                .then(data => {
                    setMessages(data.data);
                })
        }
    }, [currentChat, newMessages]);

    // Always scroll to last Message
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "auto" });
    }, [messages])

    // send message function
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessages !== '') {
            const message = {
                senderId: currentUser,
                reciverId: currentChat._id,
                text: newMessages,
                chatId: currentChat._id
            }

            // send message to socket server
            const reciverId = currentChat.members.find((id) => id !== currentUser);
            setSendMessage({ ...message, reciverId })

            // send message to mongodb
            fetch(`${baseUrl}/message`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(message)
            })
                .then(res => res.json())
                .then(data => {
                    setMessages([...messages, data])
                    setNewMessages("");
                });
        }
    }

    return (
        <div className='chat-box-wrapper'>
            {currentChat ? (<>
                <div className="chat-box-half-container">
                    <div style={{ width: profileDetails ? '70%' : "100%" }} className="chat-box-half-left">
                        <div key={userData?._id} className="chat-box-container">
                            <div style={{ display: 'flex' }}>
                                <button className='left-arrow-btn'><BiLeftArrowAlt></BiLeftArrowAlt></button>
                                <div className='conversesion-user chat-box-conversesion'>
                                    {online && <div className="online-dot"></div>}
                                    {/* <img className='follower-img' src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + 'defaultProfile.png'} alt="" /> */}
                                    <img className='follower-img' src={myImage} alt="" />
                                    <div className="userNameMsg">
                                        <span className='user-name'>{userData?.name}</span>
                                        {online && <p className='active-now'>Active Now</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="call-user">
                                <button className='call-user-icon'><IoCall></IoCall></button>
                                <button className='call-user-icon'><FaVideo></FaVideo></button>
                                <button style={{ background: profileDetails ? "#147fc722" : "" }} onClick={() => { setProfileDetails(!profileDetails) }} className='call-user-icon'><HiExclamationCircle></HiExclamationCircle></button>
                            </div>
                        </div>
                        <div className="chat-body">
                            {messages?.map(message => (
                                <div key={message._id}>
                                    <div ref={scroll} className={message.senderId === currentUser ? 'message own' : 'message'}>
                                        <p className='message-text'>{message.text}</p>
                                        <p className='message-time'>{format(message.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Chat Sender */}
                        <div className='chat-sender-set-bottom'>
                            <div className="chat-sender">
                                <button onClick={() => { imageRef.current.click() }} className="send-images" ><BsImages></BsImages></button>
                                <InputEmoji style={{ width: "500px" }}
                                    value={newMessages}
                                    onChange={(newMessage) => setNewMessages(newMessage)}
                                    onKeyPress={(e) => { console.log(e.target) }}
                                />
                                <button onClick={handleSendMessage} className='send-button'><IoSend className='send-button-icon'></IoSend></button>
                                <input
                                    type="file"
                                    name=""
                                    id=""
                                    style={{ display: "none" }}
                                    accept="image/*"
                                    ref={imageRef}
                                />
                            </div>{" "}
                        </div>
                    </div>

                    {/* Chat box right */}
                    <div style={{ display: profileDetails ? "block" : "none" }} className="chat-box-half-right">
                        <div className="chat-half-right-top">
                            <div>
                                {online && <div className="online-dot-profile"></div>}
                                <img src={myImage} alt="" />
                            </div>
                            <p className='chat-half-right-top-text'>{userData?.name}</p>
                            <p className='chat-half-right-top-active-text'>Active now</p>
                            <div className="chat-half-right-top-icons">
                                <div className='chat-half-right-profile-buttons'>
                                    <button><IoCall className='icons'></IoCall></button>
                                    <p>Audio</p>
                                </div>
                                <div className='chat-half-right-profile-buttons'>
                                    <button><FaVideo className='icons'></FaVideo></button>
                                    <p>Video</p>
                                </div>
                                <div className='chat-half-right-profile-buttons'>
                                    <button><FaUserAlt className='icons'></FaUserAlt></button>
                                    <p>Profile</p>
                                </div>
                                <div className='chat-half-right-profile-buttons'>
                                    <button><FaBell className='icons'></FaBell></button>
                                    <p>Mute</p>
                                </div>
                            </div>
                        </div>
                        <div style={{display:'none'}} className="chat-half-right-middle">
                            <h1>chat box right middle</h1>
                        </div>
                        
                        <div className="chat-half-right-bottom">
                            <ChatBoxAccordion></ChatBoxAccordion>
                        </div>
                    </div>
                </div>
            </>) : (
                <div className='tap-on-chat'>
                    <p className='tap-on-chat-text'>Tap on a Chat to start Conversation<BiConversation style={{ fontSize: "35px", margin: "10px 0 0 10px" }}></BiConversation></p>
                </div>
            )}

        </div>
    );
};

export default ChatBox;