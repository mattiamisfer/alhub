import React from 'react';
export default (d) => {
    const [state, updateState] = React.useState(d);
    const callback = React.useRef(() => { });
    const update = (val, cb) => {
        let v = (typeof val === 'function') ? val(state) : val;
        callback.current = cb;
        updateState(val)
    }
    React.useEffect(() => {
        if (typeof callback.current === 'function')
            callback.current(state);
    }, [state]);
    return [state, update]
}