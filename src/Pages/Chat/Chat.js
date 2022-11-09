import React, { useRef, useState } from 'react';
import './Chat.css';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../Components/Loading/Loading';
import { useEffect } from 'react';
import { baseUrl } from '../../utils/constantData/constantData';
import { io } from "socket.io-client";
import ChatBox from '../../Components/ChatBox/ChatBox';
import Coversation from '../../Components/Coversation/Coversation';
import { IoCreateOutline } from 'react-icons/io5';
import { RiLogoutCircleRLine, RiVideoAddFill } from 'react-icons/ri';
import { BsFillCameraFill, BsThreeDots } from 'react-icons/bs';
import { GoSearch } from 'react-icons/go';
import menImg1 from '../../images/men-img-1.jpg'
import { BiEditAlt, BiLeftArrowAlt } from 'react-icons/bi';
import { logOut } from '../../lib/reducers/authSlice';
import CropImage from '../../Components/CropImage/CropImage';

const Chat = () => {
    const { isLoading, user, error } = useSelector((state) => state.user)
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sendMessage, setSendMessage] = useState(null)
    const [reciveMessage, setReciveMessage] = useState(null)
    const [lastMessage, setLastMessage] = useState('');
    const [leftSideModal, setLeftSideModal] = useState(false);
    const [profileImage, setProfileImage] = useState('');
    const socket = useRef();
    const inputRef = useRef();
    const dispatch = useDispatch();



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

    const handleOnlineStatus = (chat) => {
        const chatMember = chat?.members.find((member) => member !== user._id);
        const online = onlineUsers.find((user) => user.userId === chatMember)
        return online ? true : false
    }

    // left side modal toggle
    const profileImageClick = () => {
        setLeftSideModal(!leftSideModal)
    }


    // send image to server

    const handleOnChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.addEventListener('load', () =>{
                console.log(reader.result)
                setProfileImage(reader.result);
            })
        }
    }

    // const handleImageSubmit = (event) => {
    //     const formData = new FormData();
    //     formData.append('image', profileImage)
    //     setImage(formData)

    //     console.log('form data', formData);

    //     fetch(`${baseUrl}/user/profile-picture`, {
    //         method: "POST",
    //         body: JSON.stringify(formData)
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log(data)

    //         })
    // }

    if (isLoading) {
        return <Loading></Loading>
    }
    if (error) {
        return toast.error(error.message);
    }
    return (<>
        {/* center modals */}
        <div className="crop-image-modal" style={{ display: profileImage ? 'grid' : 'none' }}>
            <CropImage image={profileImage} setProfileImage={setProfileImage}></CropImage>
            {/* <img src={image} alt="" style={{width:'400px', height:'400px'}}/> */}
        </div>
        <div className='chat'>
            {/* Left side Chat */}
            <div className="left-side-chat">
                <div className="chat-container">
                    <div className="chat-container-profile-top">
                        <div className="chat-container-profile-name">
                            <img onClick={profileImageClick} className='chat-container-profile-img' src={menImg1} alt="" />
                            <h3>{user?.name.slice(0, 15) + '...'}</h3>
                        </div>
                        <div className='chat-container-profile-button'>
                            <h2>Chat</h2>
                            <div className='chat-container-profile-buttons'>
                                <button className='chat-container-profile-button-icon'><BsFillCameraFill></BsFillCameraFill></button>
                                <button className='chat-container-profile-button-icon'><BsThreeDots></BsThreeDots></button>
                                <button className='chat-container-profile-button-icon'><RiVideoAddFill></RiVideoAddFill></button>
                                <button className='chat-container-profile-button-icon'><IoCreateOutline></IoCreateOutline></button>
                            </div>
                        </div>
                        <div className="chat-container-searchbar">
                            <div className="chat-search-bar">
                                <span className='search-bar-icon'><GoSearch></GoSearch></span>
                                <input type="text" placeholder='Search' />
                            </div>
                        </div>
                    </div>
                    <div className="chat-container-profile-bottom">

                    </div>
                    {/* left side modal */}
                    <div className="left-side-modal" style={{ left: leftSideModal ? '0px' : '-100000px' }}>
                        <div className='tob-button'>
                            <button title='Close' className='left-modal-closeBtn' onClick={() => { setLeftSideModal(!leftSideModal) }}><BiLeftArrowAlt></BiLeftArrowAlt></button>
                            <button title='Edit' className='left-modal-closeBtn' onClick={() => { console.log('Edit profile button click') }}><BiEditAlt></BiEditAlt></button>
                        </div>
                        <div className="left-modal-top">
                            <div className="lmt-profile-img">
                                <img src={menImg1} alt="" />
                                <input type="file" accept='image/*' name='image' ref={inputRef} onChange={handleOnChange} style={{ display: 'none' }} id="" />
                                <button onClick={() => { inputRef.current.click() }} className='lmt-profile-cam'><BsFillCameraFill className='lmt-profile-cam-icon'></BsFillCameraFill></button>
                            </div>
                            <h3>{user?.name}</h3>
                        </div>
                        <div className="left-modal-middle">
                        </div>
                        <div className="left-modal-bottom">
                            <button className='logout-btn' onClick={() => { dispatch(logOut()) }}><RiLogoutCircleRLine style={{ marginRight: '8px', fontSize: '25px' }}></RiLogoutCircleRLine>Log Out</button>
                        </div>
                    </div>
                </div>
                <div className="chat-list">
                    {chats?.map((chat) => (
                        <div key={chat._id} onClick={() => { setCurrentChat(chat) }}>
                            <Coversation currentUserId={user._id} chat={chat} online={handleOnlineStatus(chat)} lastMessage={lastMessage
                            }></Coversation>
                        </div>))}
                </div>
            </div>
            {/* RIGHT SIDE Chat */}
            <div className="right-side-chat" onClick={() => {
                setLeftSideModal(false)
                setProfileImage('')
            }}>
                <ChatBox currentChat={currentChat} setSendMessage={setSendMessage} reciveMessage={reciveMessage} currentUser={user._id} online={handleOnlineStatus(currentChat)} setLastMessage={setLastMessage}></ChatBox>
            </div>
        </div>
    </>
    );
};

export default Chat;