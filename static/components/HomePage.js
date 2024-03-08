import { createRef } from 'react';
import { ALL_MESSAGES_URL, ALL_ROOMS, POST_MESSAGE, getAllMsgsRequest, postRequest } from '../helpers/endpoints.js';
import {createUrl, isLoggedin} from '../helpers/utils.js';
import Header from './Header.js';

export default function HomePage({channelNo}) {
  console.log("Home");
  const history = ReactRouterDOM.useHistory();
  if(!isLoggedin()){
    history.push('/login')
    return <></>
  }
  const [allChannels, setAllChannels] = React.useState([]);
  // const [currentChannel, setCurrentChannel] = React.useState(channelNo);
  const [showThread, setShowThread] = React.useState(false);
  const [intervalId, setIntervalId] = React.useState(null);


  const handleChannelClick = async (channel) => {
    // setCurrentChannel(channel);
    // setShowThread(false);
    history.push('/channel/' + channel);
  };

  const handleThreadClick = () => {
      setShowThread(true);
  };

  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([]);

  const sendMessage = async () => {
      if (message.trim() === '') return;
  
      postRequest.room_id = channelNo;
      postRequest.body = message;
      await createUrl(POST_MESSAGE, postRequest, {}, 'POST')
      setMessage('');
  };

  const handleInputChange = (e) => {
      setMessage(e.target.value);
  };

  const handleLogout = () => {
    clearInterval(intervalId);
  };

  React.useEffect(() => {
    const intervalId = setInterval(async () => {
        if (channelNo === 0) return;

        getAllMsgsRequest.room_id = channelNo;
        let retrievedMessages = await createUrl(ALL_MESSAGES_URL, getAllMsgsRequest, {}, 'GET');
        let rooms = await createUrl(ALL_ROOMS, {}, {}, 'GET')
        console.log(channelNo);
        setMessages(retrievedMessages.allM);
        setAllChannels(rooms.allC);
    }, 500);

    setIntervalId(intervalId);

    return () => {
        clearInterval(intervalId);
    };
  }, [messages, channelNo]);

  return (
    <>
      <Header handleLogout={handleLogout}/>
      <div className="home-screen">
        <div className="channels-panel">
          {/* <h2>Channels</h2> */}
          <ul>
            {allChannels.map(channel => (
              <li key={channel.id} className={channel.id == channelNo ? 'active' : ''} onClick={() => handleChannelClick(channel.id)}>
                {channel.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="message-container">
          <div className="conversation">
              {messages.map(msg => (
                  <div key={msg.id} className="message">
                      <div className="author">{msg.name}</div>
                      <div className="body">{msg.body}</div>
                  </div>
              ))}
          </div>

          <div className="message-input">
            <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
          
      </div>
    </>
  );
};
