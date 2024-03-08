const Header = ({handleLogout}) => {
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

export default Header;
