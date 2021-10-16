import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';

function Main(props) {
    // 참가자 수
    const [users,setUsers] = useState(0);
    // 터치타임
    const [touchMsg, setTouchMsg] = useState(false);
    // 참가자 정보
    const [info, setInfo] = useState([]);
    // 터치멈춤
    const [freeze, setFreeze] = useState(false);
    // 탈락
    const [die, setDie] = useState(false);
    // 종료
    const [ending, setEnding] = useState(false);

    const [socket, setSocket] = useState(props.socket);

    // 시간
    const [remainTime, setRemainTime] = useState('00:00');

    let test = 600;

    useEffect(()=> {
        setSocket(props.socket);
    });

    useEffect(()=>{
        if ( socket === undefined ) return;

        socket.on('message',data=>{
            // console.log(2 , data);

            //sendMessage(Math.random());
            /*
            setTimeout(() => {
                sendMessage(Math.random());
            }, 2000);
            */
        });
        // 참가자 수
        socket.on('users', data => setUsers(data));
        // 참가자 정보
        socket.on('info',data=>{
            //console.log( 'info' ,  data )
            setInfo(data);
            /*
            setInfo((() => {
                let temp = [];

                for(let i = 0; i < 50; i++) {
                    temp.push(...data);
                }

                console.log( temp );
                return temp;
            })())*/
        });
        // 멈춤
        socket.on('freeze', data => {
            console.log( 'freeze' ,  data )
            setFreeze( data );
            setTouchMsg( !data );
        });
        // 멈춤
        socket.on('ending', data => {
            console.log( 'ending' ,  data )
            setEnding(data);
        });
        // 런타임
        socket.on('runtime', data => {
            console.log( 'runtime' ,  data )

            //data = test--;

            const min = parseInt((data%3600)/60);
            const sec = data % 60;

            setRemainTime([min < 10 ? '0' + min : min, sec < 10 ? '0' + sec : sec].join(':'));

            // game over
            if (data <= 0) {
                touchFreeze(true);
                setTimeout(() => {
                    setEnding(true)
                }, 1000);
            }

        });
    },[socket]);

    useEffect(() => {

    }, [remainTime]);

    // 터치 이벤트
    const touch = data => socket.emit('touch', 1);
    // 멈춤 이벤트
    const touchFreeze = data => {

        console.log('die...', remainTime);

        if (remainTime === '01:15') {
            return;
        }
        setDie(true);
        socket.emit('die', true);

        props.handleBoom(true);

    };
    // 게임시간 관리
    const handleTimer = data => {
        console.log( data )
        socket.emit('start', localStorage.getItem('uid'));
    };


    return (
        <>
            <div className="entry">
                <div className="timer" onClick={handleTimer}>{remainTime}</div>
                <div className="count none">{users}명</div>
            </div>
            <div className="top">
                <h1 className={`txt${touchMsg}`}><div>무궁화 꽃이 피었습니다</div></h1>
            </div>
            <div className="finish"></div>
            <div className="cc64"></div>
            <div className="ss64"></div>
            <div className="mm32"></div>
            <div className="aa32"></div>
            <div>
                {
                    info.length > 0 && info.map((data, i) => {
                        if(data.info.connect) {
                            // 개선 대상, 접속중인 소켓으로 정렬
                            // const pos = Math.ceil(window.innerHeight / (users + 14));

                            const pos = Math.ceil((window.innerHeight - 150) / (users + 1));
                            const idx = (() => {
                                let tmpIdx = 0;

                                for (let j = 0; j < i; j++) {
                                    if (info[j].info.connect) tmpIdx++;
                                }

                                return tmpIdx;
                            })();

                            const cV = 100;

                            if(data.info.die) {
                                return (
                                    <div key={i} className="unit unit-die" style={{'left': `${data.info.count}%`, top: (idx+1)*pos + cV}}></div>
                                )
                            } else {
                                return (
                                    <div key={i}>
                                        <div className="unit" style={{'left': `${data.info.count}%`, top: (idx+1)*pos + cV}}></div>
                                        <div style={{position: 'absolute', right: '10px', top: (idx+1)*pos + cV, zIndex: 1}}>{data.uid}</div>
                                    </div>
                                )
                            }
                        } else {
                            return (<div key={i}></div>);
                        }
                    })
                }
            </div>
            <div className="bike" style={{display: 'block'}} onTouchStart={touch}>
                <div className="bike__cloud-11"></div>
                <div className="bike__cloud-22"></div>
            </div>
            <div className={`die${die}`}></div>
            <div className={`freeze${freeze}`} onTouchStart={touchFreeze}></div>

            <div className={`ending${ending}`}></div>

        </>
    )
}

export default Main;