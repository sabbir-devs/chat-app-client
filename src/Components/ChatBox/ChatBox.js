import React, { useEffect, useRef, useState } from 'react';
import { BiConversation } from 'react-icons/bi';
import { BsImages } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { format } from 'timeago.js';
import { baseUrl } from '../../utils/constantData/constantData';
import defaultProfile from '../../images/defaultProfile.png';
import InputEmoji from 'react-input-emoji';
import './ChatBox.css';


const ChatBox = ({ currentChat, setSendMessage, reciveMessage, currentUser, online }) => {
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState('');

    const scroll = useRef();
    const imageRef = useRef();

    useEffect(() => {
        if (reciveMessage !== null && reciveMessage.chatId === currentChat._id) {
            setMessages([...messages, reciveMessage])
        }
    }, [reciveMessage])


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
                    setMessages(data.data)
                })
        }
    }, [currentChat, newMessages]);

    // Always scroll to last Message
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    // send message function
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessages !== '') {
            const message = {
                senderId: currentUser,
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
                    console.log(data)
                    setMessages([...messages, data])
                    setNewMessages("");
                });
        }
    }

    return (
        <div className='chat-box-wrapper'>
            {currentChat ? (<>
                <div className="chat-box-container">
                    <div className='conversesion-user chat-box-conversesion'>
                        {online && <div className="online-dot"></div>}
                        {/* <img className='follower-img' src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + 'defaultProfile.png'} alt="" /> */}
                        <img className='follower-img' src={defaultProfile} alt="" />
                        <div className="userNameMsg">
                            <span className='user-name'>{userData?.name}</span>
                            {online && <p className='active-now'>Active Now</p>}
                        </div>
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
                        <button className="send-images" ><BsImages></BsImages></button>
                        <InputEmoji style={{ width: "500px" }}
                            value={newMessages}
                            onChange={(newMessage) => setNewMessages(newMessage)}
                        />
                        <button onClick={handleSendMessage} className='send-button'><IoSend className='send-button-icon'></IoSend></button>
                        <input
                            type="file"
                            name=""
                            id=""
                            style={{ display: "none" }}
                            ref={imageRef}
                        />
                    </div>{" "}
                </div>
            </>) : (
                <div className='tap-on-chat'>
                    <p className='tap-on-chat-text'>Tap on a Chat to start Conversation <BiConversation style={{ fontSize: "35px", margin: "10px 0 0 10px" }}></BiConversation></p>
                </div>
            )}

        </div>
    );
};

export default ChatBox;