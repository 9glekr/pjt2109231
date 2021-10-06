import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField';
import './App.css';
import './style.css';

// const socket =  io.connect('http://61.80.148.48')
const socket =  io.connect('http://192.168.0.6')


function App() {
    // 참가자 수
    const [users,setUsers] = useState(0);
    // 총 터치 수
    const [count,setCount] = useState(0);
    // 참가자 정보
    const [info, setInfo] = useState([]);
    // 멈춤
    const [freeze, setFreeze] = useState(false);
    // 탈락
    const [die, setDie] = useState(false);
    // 터치타임
    const [touchMsg, setTouchMsg] = useState(false);


    useEffect(()=>{
        console.log(1);

        //new Notification('ok', {body: 'good job!'});

        sendMessage('test');

        socket.on('message',data=>{
            console.log(2 , data);

            //sendMessage(Math.random());
            /*
            setTimeout(() => {
                sendMessage(Math.random());
            }, 2000);
            */
        });
        // 총터치수
        socket.on('touchMax',data=>{
            console.log('touch : ' , data);
            setCount(data);
        });
        // 참가자 수
        socket.on('users',data=>{
            setUsers(data);
        });
        // 입장
        socket.on('enter',data=>{
            console.log( 'enter' ,  data )
        });
        // 참가자 정보
        socket.on('info',data=>{
            console.log( 'info' ,  data )
            setInfo(data);
        });
        // 탈락
        socket.on('die',data=>{
            console.log( 'die' ,  data )
/*
            for(let uInfo of info) {
                if (uInfo.info.name === data.name) {
                    console.log('equal')

                    uInfo.info = data;
                }
            }
*/
            console.log( ' die info ' , info)
            // setInfo([...info]);
        });
        // 퇴장
        socket.on('leave',data=>{
            console.log( 'leave' ,  data )

            for(let uInfo of info) {
                if (uInfo.info.name === data.name) {
                    console.log('equal')

                    uInfo.info = data;
                }
            }

            setInfo(info);
        });
        // 멈춤
        socket.on('freeze',data=>{
            console.log( 'freeze' ,  data )
            setFreeze( data );
            setTouchMsg( !data );
        });

    },[]);

    useEffect(()=>{
        console.log( info )
    },[info]);


    // 메시지 이벤트
    const sendMessage = data => {
        socket.emit('message', data);
    };
    // 터치 이벤트
    const touch = data => {
        socket.emit('touch', 1);
    };
    // 멈춤 이벤트
    const touchFreeze = data => {
        setDie(true);
        socket.emit('die', true);
    };

    return (
        <>
            <div className="top">
                <div className="entry">참가자 {users}명</div>
                <h1 className={`txt${touchMsg}`}>무궁화 꽃이 피었습니다</h1>
            </div>
            <div className="finish"></div>
            <div className={'textArea'} style={{width: '500px', height: '500px', background: 'black', display: 'none'}}>
                <h1>anrndghk Rhcdl vldjTtmqslek</h1>
                {/*<span>an</span>*/}
                {/*<span>rnd</span>*/}
                {/*<span>ghk</span>*/}
                {/*<span>&nbsp;</span>*/}
                {/*<span>Rhc</span>*/}
                {/*<span>dl</span>*/}
                {/*<span>&nbsp;</span>*/}
                {/*<span>vl</span>*/}
                {/*<span>djT</span>*/}
                {/*<span>tmq</span>*/}
                {/*<span>sl</span>*/}
                {/*<span>ek</span>*/}
            </div>
            <div className={`die${die}`}></div>
            <div className={`freeze${freeze}`} onTouchStart={touchFreeze}></div>
            <div style={{position: 'absolute', zIndex: 1, overflow: 'hidden', width: '100%'}}>
                <div>a1234567890b1234567890c1234567890d1234567890e1234567890</div>
                <div>{count}</div>
                <div className={`touch${touchMsg}`} style={{display: 'none'}}>
                    <h1 className={`txt${touchMsg}`} style={{top: '25px', left: '330px'}}>asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfs</h1>
                </div>
            </div>
            <div>
                {
                    info.length > 0 && info.map((data, i) => {
                        if(data.info.connect) {
                            if(data.info.die) {
                                return (<div key={i} className="unit unit-die" style={{'left': `${data.info.count}%`, top: (i+1)*50 + 50}}>{data.info.index}</div>)
                            } else {
                                return (<div key={i} className="unit" style={{'left': `${data.info.count}%`, top: (i+1)*50 + 50}}>{data.info.index}</div>)
                            }
                        }
                    })
                }
            </div>
            <div className="bike" style={{display: 'block'}} onTouchStart={touch}>
                <div className="bike__cloud-1"></div>
                <div className="bike__cloud-2_"></div>
                <div className="bike__cloud-3_"></div>
            </div>

        </>
    )
}

export default App;