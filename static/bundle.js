
// Constants
const PROFILE = document.querySelector(".profile");
const ROOM = document.querySelector(".room");
const SPLASH = document.querySelector(".splash");
const LOGIN = document.querySelector(".login");

const ALL_MESSAGES_URL = '/api/room/messages';
const ALL_ROOMS = '/api/rooms';
const ERROR = '/api/error';
const LOGIN_POINT = '/api/login';
const NEW_ROOM_POINT = '/api/rooms/new';
const POST_MESSAGE = '/api/room/post';
const SIGNUP_POINT = '/api/signup';
const SIGNUP_DETAILS_POINT = '/api/signup/details';
const UPDATE_PASSWORD = '/api/update/password';
const UPDATE_ROOM = '/api/update/room';
const UPDATE_USERNAME = '/api/update/username';

let old_path = '';
let rooms = {};
let CURRENT_ROOM = 0;


let loginDict = {
  userName: '',
  password: ''
};

let getAllMsgsRequest = {
  room_id: 0
};

let postRequest = {
  room_id: 0,
  body: ''
};

let postUpdateNameRequest = {
  user_name: ''
};

let postUpdatePassRequest = {
  Password: ''
};

let postUpdateRoomRequest = {
  name: '',
  room_id: 0
};

let signUpDetails = {
  userName: '',
  Password: ''
};

// Helper Functions
const createUrl = async (endPoint, requestBody, requestHeader, endType) => {
  let url = endPoint + (Object.keys(requestBody).length > 0 ? ("?" + Object.keys(requestBody).map((key) => key + "=" + encodeURIComponent(requestBody[key])).join("&")) : "");



  
  const urlHeaders = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Api-Key": localStorage.getItem('API-KEY'),
    "User-Id": localStorage.getItem('User-Id')
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

const isLoggedin = () => {
  return !(localStorage.getItem('API-KEY') == null || localStorage.getItem('API-KEY') == '');
};

// Components
const Header = ({ handleLogout }) => {
  const history = ReactRouterDOM.useHistory();

  const handleChannelsClick = () => {
    console.log("Channels clicked");
  };

  const handleCompanyIconClick = () => {
    console.log("Company icon clicked");
  };

  const handleUpdateProfileClick = () => {
    history.push('update');
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    handleLogout();
    history.push('belay');
  };

  return (
    <div className="header">
      <div className="left-section" onClick={handleChannelsClick}>
        Channels
      </div>
      <div className="center-section" onClick={handleCompanyIconClick}>
        <img src="/static/images/belay.png" alt="Company Icon" />
      </div>
      <div className="right-section">
        <button onClick={handleUpdateProfileClick}>Update Profile</button>
        <button onClick={handleLogoutClick}>Logout</button>
      </div>
    </div>
  );
};

const Image = ({ url, title }) => (
  <img src={url} alt={title} />
);

const Login = () => {
  console.log("Login");
  const history = ReactRouterDOM.useHistory();
  if (isLoggedin()) {
    history.push('/belay')
    return <></>
  }
  const [formData, setFormData] = React.useState({
    username: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    // Your login logic here
    // For example, you can fetch the login credentials from the form data
    const { username, password } = formData;

    // Perform any necessary validation

    // Assuming createUrl function sends a POST request to the login endpoint
    try {
        const response = await createUrl(LOGIN_POINT, {}, { username, password }, 'POST');

        // Check if login was successful
        if (response.api_key && response.api_key.length > 0) {
            // If successful, store API key and user information in local storage
            localStorage.setItem('API-KEY', response.api_key);
            localStorage.setItem('User-Id', response.user_id);
            localStorage.setItem('User-Name', response.user_name);

            // Clear form data
            setFormData({
                username: '',
                password: ''
            });

            // Redirect user to 'belay' page
            history.push('/belay');
        } else {
            // Handle unsuccessful login (e.g., show error message)
            console.error('Login failed: Invalid credentials');
        }
    } catch (error) {
        // Handle any errors that occur during the login process
        console.error('Error during login:', error.message);
    }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openSignUp = (e) => {
    history.push('signup');
  };

  return (<>
    <div className="container">
      <div className="form-container">
        <Image url={"static/images/belay.png"} title={"Belay Logo"} />
        <h2>Login</h2>
        <form onSubmit={handleLogin} >
          <input type='text' name='username' placeholder='Username' value={formData.username} onChange={handleInputChange} required />
          <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleInputChange} required />
          <input type='submit' value='Login'></input>
        </form>
        <div className="signup-prompt-container">
          <p>Don't have an account?</p>
          <button className="signup-button" onClick={openSignUp}>Signup</button>
        </div>
      </div>
    </div>
  </>)
};

const LoginButton = () => {
  const handleLogin = () => {
    console.log('Login clicked');
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
    history.push('belay');
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

const Signup = () => {
    console.log("Signup");
    const history = ReactRouterDOM.useHistory();
    if (isLoggedin()) {
      history.push('/belay')
      return <></>
    }
  
    const [formData, setFormData] = React.useState({
      username: '',
      password: '',
      repeatedPassword: ''
    });
    const [passwordsMatch, setPasswordsMatch] = React.useState(true);
  
    const handleSignup = async (e) => {
      if (!passwordsMatch) {
        return;
      }
      e.preventDefault();
      // Your signup logic here
      loginDict.userName = formData.username;
      loginDict.password = formData.password;
      let loginUsr = await createUrl(SIGNUP_DETAILS_POINT, {}, loginDict, 'POST');
      if (loginUsr.api_key.length > 0) {
        localStorage.setItem('API-KEY', loginUsr.api_key);
        localStorage.setItem('User-Id', loginUsr.user_id);
        localStorage.setItem('User-Name', loginUsr.user_name);
        setFormData({
          username: '',
          password: '',
          repeatedPassword: ''
        });
        history.push('belay');
      }
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
      if (name === 'repeatedPassword') {
        setPasswordsMatch(formData.password === value);
      }
    };
  
    const openLogin = (e) => {
      history.push('login');
    };
  
    return (<>
      <div className="container">
        <div className="form-container">
          <Image url={"static/images/belay.png"} title={"Belay Logo"} />
          <h2>Signup</h2>
          <form onSubmit={handleSignup} >
            <input type='text' name='username' placeholder='Username' value={formData.username} onChange={handleInputChange} required />
            <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleInputChange} required />
            <input type='password' name='repeatedPassword' placeholder='Repeat Password' className={passwordsMatch ? '' : 'password-mismatch'} value={formData.repeatedPassword} onChange={handleInputChange} required />
            <input type='submit' value='Signup'></input>
          </form>
          <div className="signup-prompt-container">
            <p>Already have an account?</p>
            <button className="signup-button" onClick={openLogin}>Login</button>
          </div>
        </div>
      </div>
    </>);
  };
  
  const UpdateProfile = () => {
    console.log("Update");
    const history = ReactRouterDOM.useHistory();
    if (!isLoggedin()) {
      history.push('/login')
      return <></>
    }
  
    const [formData, setFormData] = React.useState({
      username: '',
      password: '',
      repeatedPassword: ''
    });
    const [passwordsMatch, setPasswordsMatch] = React.useState(true);
  
    const updateUserName = async (e) => {
      if (!passwordsMatch) {
        return;
      }
      e.preventDefault();
      // Your update username logic here
      postUpdateNameRequest.user_name = formData.username;
      await createUrl(UPDATE_USERNAME, postUpdateNameRequest, {}, 'POST');
      localStorage.setItem('User-Name', formData.username);
      setFormData({
        username: '',
      });
    };
  
    const updatePassword = async (e) => {
      if (!passwordsMatch) {
        return;
      }
      e.preventDefault();
      // Your update password logic here
      postUpdatePassRequest.Password = formData.password;
      postMsg = await createUrl(UPDATE_PASSWORD, {}, postUpdatePassRequest, 'POST');
      if (loginUsr.api_key.length > 0) {
        setFormData({
          password: '',
          repeatedPassword: ''
        });
      }
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
      if (name === 'repeatedPassword') {
        setPasswordsMatch(formData.password === value);
      }
    };
  
    const openLogin = (e) => {
      history.push('belay');
    };
  
    return (<>
      <div className="container">
        <div className="form-container">
          <Image url={"static/images/belay.png"} title={"Belay Logo"} />
          <h2>Update Profile</h2>
          <form onSubmit={updateUserName} >
            <input type='text' name='username' placeholder='Username' value={formData.username} onChange={handleInputChange} required />
            <input type='submit' value='Update username'></input>
          </form>
  
          <form onSubmit={updatePassword} >
            <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleInputChange} required />
            <input type='password' name='repeatedPassword' placeholder='Repeat Password' className={passwordsMatch ? '' : 'password-mismatch'} value={formData.repeatedPassword} onChange={handleInputChange} required />
            <input type='submit' value='Update password'></input>
          </form>
        </div>
  
        <div className="signup-prompt-container">
          <p>Done with your changes?</p>
          <button className="signup-button" onClick={openLogin}>Let's go back...</button>
        </div>
      </div>
    </>);
  };
  

  const HomePage = ({ channelNo }) => {
    console.log("Home");
    const history = ReactRouterDOM.useHistory();
    if (!isLoggedin()) {
      history.push('/login')
      return <></>
    }
    const [allChannels, setAllChannels] = React.useState([]);
    const [showThread, setShowThread] = React.useState(false);
    const [intervalId, setIntervalId] = React.useState(null);
    const [message, setMessage] = React.useState('');
    const [messages, setMessages] = React.useState([]);
  
    const handleChannelClick = async (channel) => {
      history.push('/channel/' + channel);
    };
  
    const handleThreadClick = () => {
      setShowThread(true);
    };
  
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
        setMessages(retrievedMessages.allM);
        setAllChannels(rooms.allC);
      }, 500);
  
      setIntervalId(intervalId);
  
      return () => {
        clearInterval(intervalId);
      };
    }, [channelNo]);
  
    return (
      <>
        <Header handleLogout={handleLogout}/>
        <div className="home-screen">
          <div className="channels-panel">
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
  

// ReactDOM render call (assuming this is your entry point)
ReactDOM.render(
  <ReactRouterDOM.BrowserRouter>
    <ReactRouterDOM.Switch>
      <ReactRouterDOM.Route path="/signup" component={Signup} />
      <ReactRouterDOM.Route path="/belay" render={(props) => <HomePage channelNo={'1'} />} />
      <ReactRouterDOM.Route path="/login" component={Login} />
      <ReactRouterDOM.Route path="/update" component={UpdateProfile} />
      <ReactRouterDOM.Route path="/channel/:searchInput" render={(props) => <HomePage channelNo={props.match.params.searchInput} />} />
      <ReactRouterDOM.Route path="/" component={HomePage} />
    </ReactRouterDOM.Switch>
  </ReactRouterDOM.BrowserRouter>,
  document.getElementById('root')
);

