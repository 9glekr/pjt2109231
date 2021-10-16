import React, {useState, useEffect} from 'react';

import Enter from './Enter';
import Main from './Main';
import './App.css';
import './style.css';
import io from 'socket.io-client';
import Boom from './Boom';
import './boom2.js';

// const socket =  io.connect('http://61.80.148.48')
// const socket =  io.connect('http://192.168.0.6')
// const socket =  io.connect('http://192.168.50.102')
// const socket =  io.connect('http://localhost')

function App() {

    // const url = 'http://192.168.50.102';
    // const url = 'http://localhost';
    const url = 'http://192.168.1.102';
    const [socket, setSocket] = useState();
    const [refresh, setRefresh] = useState(false);
    const socketConnection = data => {
        setSocket(io.connect(url + '?uid='+ data.uid + '&number=' + data.number));
    };
    const handleBoom = data => {
        console.log('data >>>' , data);
        setRefresh(data);
    };

    return (
        <>
            <Enter conn={socketConnection} />
            <Main conn={socketConnection} socket={socket} handleBoom={handleBoom} />
            <Boom conn={socketConnection} refresh={refresh} handleBoom={handleBoom} />
        </>
    )
}

export default App;