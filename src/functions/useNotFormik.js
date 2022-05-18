import React from 'react';
import useStateWithCallback from '../functions/useStateWithCB';

export function useNotFormik(conf) {
    const resetForm = () => {
        updateNotFormik({
            ...notFormik,
            values: {
            }
        });
    }
    const reinitialize = (initial, cb) => {
        console.log('reinitialized');
        let callback = typeof cb === 'function' ? cb : () => { };
        updateNotFormik({
            ...notFormik,
            values: {
                ...conf.initial
            }
        }, callback);
    }
    const handleChange = (e) => {
        updateNotFormik(prev => {
            return {
                ...prev,
                values: {
                    ...prev.values,
                    [e.target.name]: e.target.value
                }
            }
        });
    }
    const [notFormik, updateNotFormik] = useStateWithCallback({
        ...conf,
        values: {},
        handleChange: handleChange,
        reinitialize: reinitialize,
        resetForm: resetForm,
    });
    console.log(notFormik.values)

    /*React.useEffect(() => {
        console.log('set initials');
        updateNotFormik({
            ...notFormik,
            values: {
                ...conf.initialValues
            }
        });
    }, [conf.initialValues])*/
    return notFormik;

}
