import Login from './Login';
import HomePage from './HomePage.js';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';
import Signup from './Signup';
import {isLoggedin} from '../helpers/utils.js';
import UpdateProfile from './UpdateProfile.js';

export default function App() {
    console.log("App");
    console.log(isLoggedin());

    const [path, setPath] = React.useState('/')

    return (
        <ReactRouterDOM.BrowserRouter>
            <div className="App">
                <ReactRouterDOM.Switch>
                    <ReactRouterDOM.Route path="/signup" component={Signup}/>
                    <ReactRouterDOM.Route
                        path="/belay"
                        render={props => (
                            <HomePage channelNo={'1'} />
                        )}
                    />
                    <ReactRouterDOM.Route path="/login" component={Login} />
                    <ReactRouterDOM.Route path="/update" component={UpdateProfile} />
                    <ReactRouterDOM.Route
                        path="/channel/:searchInput"
                        render={props => (
                            <HomePage channelNo={props.match.params.searchInput} />
                        )}
                    />
                    <ReactRouterDOM.Route path="/" component={HomePage} />
                </ReactRouterDOM.Switch>
            </div>
        </ReactRouterDOM.BrowserRouter>
    );
}
