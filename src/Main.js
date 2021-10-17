import React, {useState, useEffect, useRef} from 'react';

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
    // 통과
    const [pass, setPass] = useState(false);
    // 랭커
    const [ranker, setRanker] = useState([]);

    const [socket, setSocket] = useState(props.socket);

    const elWait = useRef();

    // 시간
    const [remainTime, setRemainTime] = useState('00:00');

    // let test = 600;

    useEffect(()=> {
        setSocket(props.socket);
    });

    useEffect(()=>{
        if ( socket === undefined ) return;
        // 참가자 수
        socket.on('users', data => setUsers(data));
        // 참가자 정보
        socket.on('info',data=>{
            //console.log( 'info' ,  data )
            setInfo(data);
        });
        // 멈춤
        socket.on('freeze', data => {
            // console.log( 'freeze' ,  data )
            setFreeze( data );
            setTouchMsg( !data );
        });
        // 종료
        socket.on('ending', data => {
            // console.log('ending', data, ending, ranker)
            setRanker(data);
            setEnding(true);

            // const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@$%&';
/*
            document.querySelectorAll('.neon').forEach((el,i) => {
                document.getElementById('anim' + i).innerText = '';

                let str = 'TESFFFFKSFKSKDBFKA';
                let inc = 0;
                let out = 0;

                const anim = (data) => {
                    console.log('ani...', data)
                    // inc++;
//                    document.getElementById('shuffle' + i).innerText = chars[Math.floor(Math.random() * chars.length)];
                    document.getElementById('shuffle' + i).innerText = chars[Math.floor(Math.random() * chars.length)];

                    if (inc % 7 === 0 && out < str.length) {
                        document.getElementById('anim' + i).appendChild(document.createTextNode(str[out]));
                        out++;
                    } else if (out >= str.length) {
                        document.getElementById('shuffle' + i).innerText = '';
                    }


                    if (data < 30) {
                        setTimeout(anim, 400, ++data);
                    }


                };

                setTimeout(anim, 400, 1);

                /*
                let str = 'DAN';
                let inc = 0;
                let out = 0;
                let time;
                document.getElementById('shuffle0').innerText = chars[Math.floor(Math.random() * chars.length)];
                var anim = function () {
                    inc++;


                    if (inc % 7 === 0 && out < str.length) {
                        document.getElementById('anim0').appendChild(document.createTextNode(str[out]));
                        out++;
                    } else if (out >= str.length) {
                        document.getElementById('shuffle0').innerText = '';
                        clearInterval(time);
                    }
                };

                time = setTimeout(anim, 40);

 */
            // });
        });
        // 통과
        socket.on('pass', data => {
            // console.log( 'pass' ,  data )
            setPass(true);
        });
        // 런타임
        socket.on('runtime', data => {
            // console.log( 'runtime' ,  data )
            if (data < 75) {//75
                elWait.current.className = 'waitfalse';
            }

            const min = parseInt((data%3600)/60);
            const sec = data % 60;

            setRemainTime([min < 10 ? '0' + min : min, sec < 10 ? '0' + sec : sec].join(':'));

            // game over
            if (data <= 0) {
                touchFreeze(true);
                setTimeout(() => {
                    setEnding(true)
                }, 500);
            }

        });
    },[socket]);

    useEffect(() => {

    }, [remainTime]);
/*
    useEffect(() => {
        console.log('ranker...' , ranker, ending);
    }, [ranker]);
*/
    // 터치 이벤트
    const touch = data => socket.emit('touch', 1);
    // 멈춤 이벤트
    const touchFreeze = data => {

        // console.log('die...', remainTime);

        if (remainTime === '01:15') {
            return;
        }
        setDie(true);
        socket.emit('die', true);

        props.handleBoom(true);

    };
    // 게임시간 관리
    const handleTimer = data => {
        // console.log( data )
        socket.emit('start', localStorage.getItem('uid'));
    };

    const handleClickRefresh = () => {
        // window.location.reload();
        // window.open(window.location.href);
    };


    return (
        <>
            <div className={'txt-guide'}>"무궁화 꽃이 피었습니다" 글씨가 보일 때만 터치하세요.</div>
            <div className="entry">
                <div className="timer" onClick={handleTimer}>{remainTime}</div>
                <div className="count none">{users}명</div>
            </div>
            <div className="top">
                <h1 className={`txt${touchMsg}`}><div>무궁화 꽃이 피었습니다</div></h1>
            </div>
            <div className="finish"></div>
            <div className="cc64"></div>
            <div className="ss64" onClick={handleClickRefresh}></div>
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
                            return (<div key={i}></div>)
                        }
                    })
                }
            </div>
            <div className="bike" style={{display: 'block'}} onTouchStart={touch}>
                <div className="bike__cloud-11"></div>
                <div className="bike__cloud-22"></div>
            </div>
            <div className={`pass${pass}`}>
                <h1><span>"축하</span><span>합니다"</span></h1>
            </div>
            <div className={`die${die}`}></div>
            <div className={`waittrue`} ref={elWait}></div>
            <div className={`freeze${freeze}`} onTouchStart={touchFreeze}></div>

            <div className={`ending${ending} result`} style={{display:'none1'}}>
                <div className='result-txt'>* 통 과 인 원 *<br/>WINNER OF PLAYERS</div>
                <div className="neon_effect">
                    {
                        ranker.length > 0 && ranker.map((data,i) => {
                            return (
                                <div key={i}>
                                    {/*{data.uid}*/}
                                    {/*<p>{data.uid}</p>*/}
                                    <p className='neon' data-uid={data.uid}>{data.uid}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Main;