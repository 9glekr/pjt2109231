import React, {useState} from 'react';

import Enter from './Enter';
import Main from './Main';
import './App.css';
import './style.css';
import io from 'socket.io-client';
import Boom from './Boom';
import './boom2.js';

function App() {
    const url = process.env.REACT_APP_SOCKET_URL;
    //const url = 'http://132.226.171.26:3000';
    const [socket, setSocket] = useState();
    const [refresh, setRefresh] = useState(false);
    const socketConnection = data => {
        setSocket(io.connect(url + '?uid='+ data.uid + '&number=' + data.number));
    };
    const handleBoom = data => {
        setRefresh(data);
    };

    // localStorage.removeItem('uid');

    return (
        <>
            <Enter conn={socketConnection} />
            <Main conn={socketConnection} socket={socket} handleBoom={handleBoom} />
            <Boom conn={socketConnection} refresh={refresh} handleBoom={handleBoom} />
        </>
    )
}

export default App;