import { createRef } from 'react';

// Constants
const SPLASH = document.querySelector(".splash");
const PROFILE = document.querySelector(".profile");
const LOGIN = document.querySelector(".login");
const ROOM = document.querySelector(".room");

const UPDATE_ROOM_URL = '/api/update/room';
const LOGIN_URL = '/api/login';
const SIGNUP_URL = '/api/signup';
const MESSAGES_URL = '/api/room/messages';
const UPDATE_PASSWORD_URL = '/api/update/password';
const SEND_MESSAGE_URL = '/api/room/send';
const NEW_ROOM_URL = '/api/rooms/new';
const SIGNUP_DETAILS_URL = '/api/signup/details';
const REPLY_URL = '/api/room/reply';
const ROOMS_URL = '/api/rooms';
const UPDATE_USERNAME_URL = '/api/update/username';
const ERROR_URL = '/api/error';
const SEND_EMOJI_URL = '/api/message/emojipost';
const UNREAD_MESSAGES_URL = '/api/user/unread';
const REPLY_PARENT_URL = '/api/reply/parent';
const REPLIES_URL = '/api/room/replies';
const EMOJIS_URL = '/api/message/emojis';
const UPDATE_UNREAD_MESSAGES_URL = '/api/update/user/unread';


let rooms = {};

let loginDetails = {
  userName: '',
  password: ''
};

let messagesRequest = {
  room_id: 0
};

let repliesRequest = {
  room_id: 0,
  message_id: 0
};

let postRequest = {
  room_id: 0,
  body: ''
};

let sendReplyRequest = {
  room_id: 0,
  body: '',
  message_id: 0,
  replies_to: 0
};

let updateUserNameRequest = {
  user_name: ''
};

let updatePasswordRequest = {
  Password: ''
};

let updateRoomNameRequest = {
  name: '',
  room_id: 0
};

let signUpDetails = {
  userName: '',
  Password: ''
};

let newRoomRequest = {
  channelName: ''
};

let noOfEmojis = {
  message_id: '',
  emoji_id: ''
};

let sendEmoji = {
  message_id: '',
  emoji_id: ''
};

let updateUnread = {
  message_id: '',
  channel_id: ''
};

let replyParentDict = {
  message_id: ''
};


const createUrl = async (endPoint, requestBody, requestHeader, endType) => {
  let url = endPoint + (Object.keys(requestBody).length > 0 ? ("?" + Object.keys(requestBody).map((key) => key + "=" + encodeURIComponent(requestBody[key])).join("&")) : "");
  const urlHeaders = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Api-Key": localStorage.getItem('PRUDHVI-PULI-API-KEY'),
    "User-Id": localStorage.getItem('PRUDHVI-PULI-User-Id')
  });

  Object.keys(requestHeader).forEach(function (key) {
    urlHeaders.append(key, requestHeader[key]);
  });

  const myInit = {
    method: endType,
    headers: urlHeaders,
  };

  let data = await fetch(url, myInit);
  let jsonForm = await data.json();
  return jsonForm;
};

const login = () => {
  return !(localStorage.getItem('PRUDHVI-PULI-API-KEY') == null || localStorage.getItem('PRUDHVI-PULI-API-KEY') == '');
};


const Header = ({ handleLogout }) => {
  const history = ReactRouterDOM.useHistory();

    const iconClicked = () => {
        handleLogout();
        history.push('/belay');
    };

    const updateProfileClicked = () => {
        handleLogout();
        history.push('/update');
    };

    const logoutClicked = () => {
        localStorage.clear();
        handleLogout();
        history.push('/login');
    };

    return (
        <div className="header">
            <div className="left-section" onClick={iconClicked}>
                <img src="/static/images/belay.png" alt="Company Icon" />
            </div>
                <h1 className="welcome-message">Welcome to Belay,{localStorage.getItem('PRUDHVI-PULI-User-Name')}</h1>
            <div className="right-section">
                <button onClick={updateProfileClicked}>Update Profile</button>
                <button onClick={logoutClicked}>Logout</button>
            </div>
        </div>
    );
};

const Image = ({ url, title }) => (
  <img src={url} alt={title} />
);

const Login = () => {
    const history = ReactRouterDOM.useHistory();
    const location = ReactRouterDOM.useLocation();
    if(login()){
        history.push('/belay')
        return <></>
    }
    
    const requestedPath = location.state?.requestedPath || '/';
    console.log(requestedPath);

    document.title = 'Login';
    const [formData, setFormData] = React.useState({
        username: '',
        password: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        loginDetails.userName = formData.username;
        loginDetails.password = formData.password;
        let loginRequest = await createUrl(LOGIN_URL, {}, loginDetails, 'POST');
        if(loginRequest.api_key.length > 0){
            localStorage.setItem('PRUDHVI-PULI-API-KEY', loginRequest.api_key);
            localStorage.setItem('PRUDHVI-PULI-User-Id', loginRequest.user_id);
            localStorage.setItem('PRUDHVI-PULI-User-Name', loginRequest.user_name);

            setFormData({
                username: '',
                password: ''
            });

            if(requestedPath != '/'){
                history.replace(requestedPath);
            }
            else{
                history.push('/belay');
            }
        }
    };

    const changeInput = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const signUP = (e) => {
        history.push('/signup');
    };

    return (<>
        <div className="container">
            <div className="form-container">
                <Image url={"static/images/belay.png"} title={"Belay Logo"}/>
                <h2>Login</h2>
                <form onSubmit={handleLogin} >
                    <input type='text' name='username' placeholder='Username' value={formData.username} onChange={changeInput} required />
                    <input type='password' name='password' placeholder='Password' value={formData.password} onChange={changeInput} required />
                    <input type='submit' value='Login'></input>
                </form>
                <div className="signup-prompt-container">
                    <p>New User? Please Signup</p>
                    <button className="signup-button" onClick={signUP}>Signup</button>
                </div>
            </div>
        </div>
    </>)
}

const LoginButton = () => {
  const handleLogin = () => {
};

return (
    <button className="login-button" onClick={handleLogin}>
        Login
    </button>
);
};

const LogoutButton = () => {
  const history = ReactRouterDOM.useHistory();

  function handleLogout() {
      localStorage.clear();
      history.push('/belay');
  };

  return (
      <button className="logout-button" onClick={handleLogout}>
          Logout
      </button>
  );
};

const Signup = () => {
  const history = ReactRouterDOM.useHistory();
  if(login()){
      history.push('/belay')
      return <></>
  }
  document.title = 'Signup';
  const [formData, setFormData] = React.useState({
      username: '',
      password: '',
      repeatedPassword: ''
  });
  const [passwordsMatch, setPasswordsMatch] = React.useState(true);

  const signUpHandle = async (e) => {
      if(!passwordsMatch){
          return
      }
      e.preventDefault();
      loginDetails.userName = formData.username;
      loginDetails.password = formData.password;
      let loginRequest = await createUrl(SIGNUP_DETAILS_URL, {}, loginDetails, 'POST');
      if(loginRequest.api_key.length > 0){
        localStorage.setItem('PRUDHVI-PULI-API-KEY', loginRequest.api_key);
        localStorage.setItem('PRUDHVI-PULI-User-Id', loginRequest.user_id);
        localStorage.setItem('PRUDHVI-PULI-User-Name', loginRequest.user_name);

          setFormData({
              username: '',
              password: '',
              repeatedPassword: ''
          });
          
          history.push('/belay');
      }
  };

  const changeInput = (e) => {
      const {name, value} = e.target

      setFormData({
          ...formData,
          [name]: value
      });

      if (name === 'repeatedPassword') {
          setPasswordsMatch(formData.password === value);
      }
  };

  const openLogin = (e) => {
      history.push('/login');
  };

  return (<>
      <div className="container">
          <div className="form-container">
              <Image url={"static/images/belay.png"} title={"Belay Logo"}/>
              <h2>Signup</h2>
              <form onSubmit={signUpHandle} >
                  <input type='text' name='username' placeholder='Username' value={formData.username} onChange={changeInput} required />
                  <input type='password' name='password' placeholder='Password' value={formData.password} onChange={changeInput} required />
                  <input type='password' name='repeatedPassword' placeholder='Repeat Password' className={passwordsMatch ? '' : 'password-mismatch'} value={formData.repeatedPassword} onChange={changeInput} required />
                  <input type='submit' value='Signup'></input>
              </form>
              <div className="signup-prompt-container">
                  <p>Already have an account?</p>
                  <button className="signup-button" onClick={openLogin}>Login</button>
              </div>
          </div>
      </div>
  </>)
}

  
  const updateProfileClicked = () => {
    const history = ReactRouterDOM.useHistory();
    if(!login()){
        const requestedPath = history.location.pathname;
        history.push('/login', { requestedPath })
        return <></>
    }
    document.title = 'Profile Update';
    const [formData, setFormData] = React.useState({
        username: '',
        password: '',
        repeatedPassword: ''
    });
    const [passwordsMatch, setPasswordsMatch] = React.useState(true);

    const updateUserName = async (e) => {
        if(!passwordsMatch){
            return
        }
        e.preventDefault();
        updateUserNameRequest.user_name = formData.username;
        await createUrl(UPDATE_USERNAME_URL, updateUserNameRequest, {}, 'POST');
        localStorage.setItem('PRUDHVI-PULI-User-Name', formData.username);
        setFormData({
            ...formData,
            username: '',
        });
    };

    const updatePassword = async (e) => {
        if(!passwordsMatch){
            return
        }
        e.preventDefault();
        updatePasswordRequest.Password = formData.repeatedPassword;
        let postMsg = await createUrl(UPDATE_PASSWORD_URL, {}, updatePasswordRequest, 'POST');
        setFormData({
            ...formData,
            password: '',
            repeatedPassword: ''
        });
    };

    const changeInput = (e) => {
        const {name, value} = e.target

        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'repeatedPassword') {
            setPasswordsMatch(formData.password === value);
        }
    };

    const openLogin = (e) => {
        history.push('/belay');
    };

    return (<>
        <div className="container">
            <div className="form-container">
                <Image url={"static/images/belay.png"} title={"Belay Logo"}/>
                <h2>Update Profile</h2>
                <form onSubmit={updateUserName} >
                    <input type='text' name='username' placeholder='Username' value={formData.username} onChange={changeInput} required />
                    <input type='submit' value='Update username'></input>
                </form>

                <form onSubmit={updatePassword} >
                    <input type='password' name='password' placeholder='Password' value={formData.password} onChange={changeInput} required />
                    <input type='password' name='repeatedPassword' placeholder='Repeat Password' className={passwordsMatch ? '' : 'password-mismatch'} value={formData.repeatedPassword} onChange={changeInput} required />
                    <input type='submit' value='Update password'></input>
                </form>

                <div className="signup-prompt-container">
                  <button className="signup-button" onClick={openLogin}>GO BACK TO THE HOMEPAGE</button>
                </div>
            </div>


        </div>
    </>)
}

  
  const NewChannelCreate = () => {
    const history = ReactRouterDOM.useHistory();
    if(!login()){
        const requestedPath = history.location.pathname;
        history.push('/login', { requestedPath })
        return <></>
    }
    document.title = 'Create Channel';
    const [formData, setFormData] = React.useState({
        roomname: '',
    });

    const handleNewRoom = async (e) => {
        e.preventDefault();
        newRoomRequest.channelName = formData.roomname;
        let newRoom = await createUrl(NEW_ROOM_URL, newRoomRequest, {}, 'POST');
        history.push('/channel/' + newRoom.channel_id);
    };

    const changeInput = (e) => {
        const {name, value} = e.target

        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (<>
        <div className="container">
            <div className="form-container">
                <Image url={"static/images/belay.png"} title={"Belay Logo"}/>
                <h2>Create Channel</h2>
                <form onSubmit={handleNewRoom} >
                    <input type='text' name='roomname' placeholder='Channel Name' value={formData.roomname} onChange={changeInput} required />
                    <input type='submit' value='Create'></input>
                </form>
            </div>
        </div>
    </>)
  }

  const MainPage = ({ channelNo, messageNo }) => {
  const history = ReactRouterDOM.useHistory();
  if(!login()){
    const requestedPath = history.location.pathname;
    history.push('/login', { requestedPath })
    return <></>
  }
  
  document.title = 'Channel ' + channelNo;

  const [widthOfWindow, setWidthOfWindow] = React.useState(window.innerWidth);
  const [parentMessage, setParentMessage] = React.useState('');
  const [channelsPanelVisibility, setChannelsPanelVisibility] = React.useState(false);
  const [messageContainerVisibility, setMessageContainerVisibility] = React.useState(false);
  const [repliesContainerVisibility, setRepliesContainerVisibility] = React.useState(false);
  const [allChannels, setAllChannels] = React.useState([]);
  const [intervalId, setIntervalId] = React.useState(null);
  const [roomName, setNewRoomName] = React.useState("");
  const [editingChannel, setEditingChannel] = React.useState(-1);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [reply, setReply] = React.useState('');
  const [replies, setReplies] = React.useState([]);
  const [unreadMessages, setUnreadMessages] = React.useState({});
  const [replyParentName, setReplyParentName] = React.useState([]);
  const [emojiClickedBy, setEmojiClickedBy] = React.useState([]);
  const [selectedEmoji, setSelectedEmoji] = React.useState({
    'msgId': -1,
    'emojiId': -1
  });

  const createNewRoom = () => {
    handleLogout();
    history.push('/newchannel');
  };

  React.useEffect(() => {
    const handleResize = () => {
      setWidthOfWindow(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleChannelsPanel = () => {
    setChannelsPanelVisibility(true);
    setMessageContainerVisibility(false);
    setRepliesContainerVisibility(false);
  };

  const toggleMessageContainer = () => {
    setChannelsPanelVisibility(false);
    setMessageContainerVisibility(true);
    setRepliesContainerVisibility(false);
  };

  const toggleRepliesContainer = () => {
    setChannelsPanelVisibility(false);
    setMessageContainerVisibility(false);
    setRepliesContainerVisibility(true);
  };

  const updateMainPage = () => {
    if (widthOfWindow < 800) {
      if(messageNo < 0 && channelNo > 0){
        toggleMessageContainer()
      }
      else if(messageNo > 0){
        toggleRepliesContainer()
      }
      else {
        toggleChannelsPanel()
      }
    } else {
      setChannelsPanelVisibility(true);
      setMessageContainerVisibility(true);
      setRepliesContainerVisibility(true);
    }
  }

  React.useEffect(() => {
    updateMainPage();
  }, [widthOfWindow, messages]);

  const handleHover = async (msg_id, emoji_id) => {
    noOfEmojis.message_id = msg_id;
    noOfEmojis.emoji_id = emoji_id;
    let retrievedEmojis = await createUrl(EMOJIS_URL, noOfEmojis, {}, 'GET');
    // console.log(retrievedEmojis.allChannels);
    setEmojiClickedBy(retrievedEmojis.allE)
    setSelectedEmoji({
      'msgId': msg_id,
      'emojiId': emoji_id
    })
  };

  const handleHoverCancel = (msg_id, emoji_id) => {
    setSelectedEmoji({
      'msgId': -1,
      'emojiId': -1
    });
  };

  const emojis = [
    { id: 1, symbol: '😊' },
    { id: 2, symbol: '❤️' },
    { id: 3, symbol: '😂' },
    { id: 4, symbol: '👍' },
    { id: 5, symbol: '😍' }
  ];

  const emojiClicked = async (messageId, emojiId) => {
    sendEmoji.emoji_id = emojiId;
    sendEmoji.message_id = messageId;
    await createUrl(SEND_EMOJI_URL, sendEmoji, {}, 'POST')
  };

  const channelClicked = async (channel) => {
    history.push('/channel/' + channel);
  };
  

  function imageURLExtraction(message) {
    const regex = /(https?:\/\/.*\.(?:png|jpg|gif))/gi;
    return message.match(regex) || [];
}

function imageDisplay(message) {
    const imageUrls = imageURLExtraction(message);
    return imageUrls.map((imageUrl, index) => (
        <img key={index} src={imageUrl} alt={`Image ${index + 1}`} />
    ));
}

  const sendMessage = async () => {
      if (message.trim() === '') return;
  
      postRequest.room_id = channelNo;
      postRequest.body = message;
      await createUrl(SEND_MESSAGE_URL, postRequest, {}, 'POST')
      setMessage('');
  };

  const sendReply = async () => {
    if (reply.trim() === '') return;

    sendReplyRequest.room_id = channelNo;
    sendReplyRequest.body = reply;
    sendReplyRequest.message_id = messageNo;
    sendReplyRequest.replies_to = messageNo;
    await createUrl(REPLY_URL, sendReplyRequest, {}, 'POST')
    setReply('');
  };

  const changeInput = (e) => {
      setMessage(e.target.value);
  };

  const handleInputReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleLogout = () => {
    clearInterval(intervalId);
  };

  React.useEffect(() => {
    const intervalId = setInterval(async () => {
        if (channelNo === 0) return;

        messagesRequest.room_id = channelNo;
        repliesRequest.room_id = channelNo;
        repliesRequest.message_id = messageNo;

        let retrievedMessages = await createUrl(MESSAGES_URL, messagesRequest, {}, 'GET');
        let rooms = await createUrl(ROOMS_URL, {}, {}, 'GET')
        setMessages(retrievedMessages.allM);
        setAllChannels(rooms.allC);
        if(messageNo > 0){
          let replies = await createUrl(REPLIES_URL, repliesRequest, {}, 'GET')
          setReplies(replies.allR);
        }
        
        let unreadMsgs = await createUrl(UNREAD_MESSAGES_URL, {}, {}, 'GET');
        setUnreadMessages(unreadMsgs.allUr);
        updateUnread.channel_id = channelNo;
        if(messages != undefined && messages[messages.length - 1] != undefined)
        {
          updateUnread.message_id = messages[messages.length - 1].id
          await createUrl(UPDATE_UNREAD_MESSAGES_URL, updateUnread, {}, 'POST');
        }

        replyParentDict.message_id = messageNo;
        if(messageNo > 0){
          let repliedParentName = await createUrl(REPLY_PARENT_URL, replyParentDict, {}, 'GET');
          setReplyParentName(repliedParentName.allM[0].name);
        }
    }, 300);

    setIntervalId(intervalId);

    return () => {
        clearInterval(intervalId);
    };
  }, [messages, channelNo]);

  const handleEditClick = (channel) => {
    setEditingChannel(channel);
  };

  const handleSaveClick = async (channel) => {
    if (roomName.trim() === '') return;
    updateRoomNameRequest.room_id = channel;
    updateRoomNameRequest.name = roomName;
    await createUrl(UPDATE_ROOM_URL, updateRoomNameRequest, {}, 'POST');
    setEditingChannel(-1);
  };

  const handleRoomNameChange = (e) => {
    const {name, value} = e.target
    setNewRoomName(value);
  };

  const handleReply = (messageId, messageName) => {
    history.push( '/channel/' + channelNo + '/message/' + messageId );
  };

  const closeReplies = () => {
    history.push('/channel/' + channelNo);
  }

  const closeMessages = () => {
    history.push('/belay');
  }

  return (
    <>
      <Header handleLogout={handleLogout}/>
      <div className="home-screen">
        {channelsPanelVisibility && (
        <div className="channels-panel">
          <div className='channels-header'>
            <h2>Channels</h2>
            <button onClick={createNewRoom}>Create New Channel</button>
          </div>
          <ul>
            {allChannels.map(channel => (
              <>
                {
                  editingChannel == channel.id ? (
                    <div className={channel.id == channelNo ? 'channel-item-container active' : 'channel-item-container'}>
                        <input name="newRoomName" onChange={handleRoomNameChange}></input>
                        <span className="material-symbols-outlined md-18" onClick={() => handleSaveClick(channel.id)}>save</span>
                    </div>
                  ) : (
                    <div key={channel.id} className={channel.id == channelNo ? 'channel-item-container active' : 'channel-item-container'} onClick={() => channelClicked(channel.id)}>
                        # {channel.name}
                        {unreadMessages[channel.id] != undefined && unreadMessages[channel.id] > 0 && (
                          <div className="unreadmsgs">
                              {unreadMessages[channel.id]} {'New Messages'}
                          </div>
                        )}
                        <span key={channel.id + allChannels.length} className="material-symbols-outlined md-18" onClick={() => handleEditClick(channel.id)}>edit</span>
                    </div>
                  )
                }
              </>
            ))}
          </ul>
        </div>)}

        {messageContainerVisibility && channelNo > 0 ? (<div className="message-container">
          <div className="close-button" onClick={() => closeMessages()}>
                  <span className="material-symbols-outlined md-18">close</span>
          </div>
          <div className="conversation">
              {messages.map(msg => (
                  <>
                    <div key={msg.id} className="message">
                        <div className="author">{msg.name}</div>
                        <div className="body-emojis-container">
                          <div className="body">{msg.body}</div>
                          {imageDisplay(msg.body)}
                          <div className="emojis">
                          {emojis.map(emoji => (
                            <span
                              key={emoji.id}
                              className="emoji"
                              onClick={() => {
                                emojiClicked(msg.id, emoji.id);
                              }}
                              onMouseEnter={() => handleHover(msg.id, emoji.id)} onMouseLeave={() => handleHoverCancel(msg.id, emoji.id)}
                              style={{ cursor: 'pointer', marginRight: '5px', fontSize: '20px' }}
                            >
                              <div className="tooltip">{emoji.symbol}{(emoji.id == selectedEmoji['emojiId'] && msg.id == selectedEmoji['msgId']) ? emojiClickedBy.length : <></>}
                                  {(emoji.id == selectedEmoji['emojiId'] && msg.id == selectedEmoji['msgId'] && emojiClickedBy.length > 0) ? (<span className="tooltiptext">{emojiClickedBy.map((name, index) => name + (index < (emojiClickedBy.length - 1) ? ", ": ""))}</span>) : <></>}
                              </div>
                            </span>
                            ))}
                          </div>
                        </div>
                        <div className="reply-button" onClick={() => handleReply(msg.id, msg.body)}>
                          <span className="material-symbols-outlined md-18">reply</span>
                        </div>
                        {msg.replies > 0 && (
                          <div className="replies" onClick={() => handleReply(msg.id)}>
                              {msg.replies} {msg.replies == 1 ? 'reply' : 'replies'}
                          </div>
                        )}
                    </div>
                  </>
              ))}
          </div>

          <div className="message-input">
            <input
                type="text"
                value={message}
                onChange={changeInput}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>): <></>}

        {messageContainerVisibility && channelNo < 0 ? (
        <div className="message-container">
          <div className="welcome-container">
            <div className="welcome-box">
              <img src='static/images/belay.png'></img>
              <p>Belay - Stay connected with your friends</p>
            </div>
          </div>
        </div>) : <></>}

        {
          (repliesContainerVisibility && messageNo > 0) ? (
            <div className="replies-container">
              <div className="close-button" onClick={() => closeReplies()}>
                  <span className="material-symbols-outlined md-18">close</span>
              </div>
              <div className="conversation">
                <div className="parent-message">
                  <p className="parent-message-text">{'Replying to ' + replyParentName}</p>
                </div>
                {replies.map(msg => (
                    <>
                      <div key={msg.id} className="message">
                          <div className="author">{msg.name}</div>
                          <div className="body">{msg.body}</div>
                          {imageDisplay(msg.body)}
                          <div className="emojis">
                          {emojis.map(emoji => (
                              <span
                                key={emoji.id}
                                className="emoji"
                                onClick={() => {
                                  emojiClicked(msg.id, emoji.id);
                                }}
                                onMouseEnter={() => handleHover(msg.id, emoji.id)} onMouseLeave={() => handleHoverCancel(msg.id, emoji.id)}
                                style={{ cursor: 'pointer', marginRight: '5px', fontSize: '20px' }}
                              >
                                <div className="tooltip">{emoji.symbol}{(emoji.id == selectedEmoji['emojiId'] && msg.id == selectedEmoji['msgId']) ? emojiClickedBy.length : <></>}
                                    {(emoji.id == selectedEmoji['emojiId'] && msg.id == selectedEmoji['msgId'] && emojiClickedBy.length > 0) ? (<span className="tooltiptext">{emojiClickedBy.map((name) => name + ", ")}</span>) : <></>}
                                </div>
                              </span>
                            ))}
                          </div>
                      </div>
                    </>
                ))}
              </div>

              <div className="message-input">
                <input
                    type="text"
                    value={reply}
                    onChange={handleInputReplyChange}
                    placeholder="Type your message..."
                />
                <button onClick={sendReply}>Send</button>
              </div>

            </div>
          ) : (
            <></>
          )
        }
          
      </div>
    </>
  );
};


ReactDOM.render(
  <ReactRouterDOM.BrowserRouter>
    <ReactRouterDOM.Switch>
      <ReactRouterDOM.Route path="/signup" component={Signup} />
      <ReactRouterDOM.Route path="/belay" render={(props) => <MainPage channelNo={-1} />} />
      <ReactRouterDOM.Route path="/login" component={Login} />
      <ReactRouterDOM.Route path="/update" component={updateProfileClicked} />
      <ReactRouterDOM.Route path="/channel/:channelId/message/:messageId" render={(props) => <MainPage channelNo={props.match.params.channelId} messageNo={props.match.params.messageId} />} />
      <ReactRouterDOM.Route path="/channel/:channelId" render={(props) => <MainPage channelNo={props.match.params.channelId} messageNo={-1} /> } />
      <ReactRouterDOM.Route path="/newchannel" render= {(props) => <NewChannelCreate/>} />
      <ReactRouterDOM.Route path="/" render={(props) => <MainPage channelNo={-1} messageNo={-1}/> } />
    </ReactRouterDOM.Switch>
  </ReactRouterDOM.BrowserRouter>,
  document.getElementById('root')
);

