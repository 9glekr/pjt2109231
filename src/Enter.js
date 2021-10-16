import React, {useState, useEffect} from 'react';

function Enter(props) {
    // 정보 입력 체크
    const localStorageHasItem = key => {
        return key in localStorage;
    };
    const isCheckedEnter = () => {
        let isChecked = localStorageHasItem('uid');
        if (isChecked && localStorageHasItem('number')) {
            isChecked = true;
        } else {
            isChecked = false;
        }

        return isChecked;
    };
    // 정보 입력 상태
    const [isEnter, setIsEnter] = useState(isCheckedEnter());
    // 정보 입력 상태
    const [isInput, setIsInput] = useState(false);
    // 이름
    const [nameValue, setNameValue] = useState('');
    // 번호
    const [numberValue, setNumberValue] = useState('');
    /**
     * 입력(이름, 번호)값이 변경되면 로컬스토리지 값도 함께 변경
     * @param value
     * @param storageKey
     * @param variable
     */
    const handleChange = (value, storageKey, variable) => {
        localStorage.setItem(storageKey, value);
        variable(value)
    };

    /**
     * 초대장 클릭
     */
    const handleWelcomeClick = () => {
        if (!localStorageHasItem('uid') && nameValue) {
            localStorage.setItem('uid', nameValue);
        }
        if (!localStorageHasItem('uid') && nameValue) {
            localStorage.setItem('number', nameValue);
        }

        setIsInput(true);
    };


    /**
     * 접속 정보가 있을 경우에만 소켓 연결
     */
    useEffect(() => {
        console.log('isInput...' , isEnter , isInput)
        if (!isEnter) return;

        props.conn({
            uid: localStorage.getItem('uid'),
            number: localStorage.getItem('number')
        });
    }, [isInput]);

    return (
        <>
            <div style={{display: 'none', position: 'absolute', top: '10px', zIndex: '99999999999999'}} onClick={() => {
                localStorage.removeItem('uid');
                localStorage.removeItem('number');
            }}>clear</div>
            <div className={`enter-card enter-card-${isEnter}`}>
                <div className="cover">
                    <div className={`welcome-img-${isInput}`}>
                        <input type="url"
                               className="input-name"
                               placeholder="your name"
                               value={nameValue}
                               onChange={data => handleChange(data.target.value, 'uid', setNameValue)}
                        ></input>
                        <input type="number" pattern="\d*"
                               className="input-number"
                               placeholder="phone numer"
                               value={numberValue}
                               onChange={data => handleChange(data.target.value, 'number', setNumberValue)}
                        ></input>
                    </div>
                    {<div className={`welcome-img-${!isInput} welcome-img`} onClick={handleWelcomeClick}>ㅇㅅㅁ</div>}
                </div>
            </div>
        </>
    )
}

export default Enter;