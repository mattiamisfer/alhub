export const stringToObject = (stringCollection) => {
    console.log(stringCollection);
    let finalObj = new Object();
    for (var pair of Object.entries(stringCollection)) {
        let formattedKey = pair[0].replaceAll(/^\/|\/$/g, '');
        formattedKey.split('/').reduce((acc, current, i, arr) => {
            if (acc[current] === undefined) {
                if (i === arr.length - 1) {
                    acc[current] = pair[1];
                    return acc;
                }
            }
            if (typeof acc[current] == 'object') {
                return acc[current];
            }
            else {
                if (i === arr.length - 1) {
                    acc[current] = pair[1];
                    return acc;
                }
                acc[current] = {};
                return acc[current];

            }
        }, finalObj);
    }
    return finalObj;

}
export const getElementsOfType = (s, type, level = '') => {
    let ret = {};
    if (!Array.isArray(s))
        return ret;
    console.log(s)
    s.map((e) => {
        if (e.type === type) {
            ret[`${level}/${e.key}`] = e;
        }
        if (e.type === 'collection') {
            ret = { ...ret, ...getElementsOfType(e.schema, type, `${level}/${e.key}/$`) };
        }
        else if (e.type === 'json') {
            ret = { ...ret, ...getElementsOfType(e.data, type, `${level}/${e.key}`) };
        }
    });
    return ret;
}

export const collectObjectValues = (obj, str) => {
    if (!obj || typeof obj !== 'object') {
        return null;
    }
    let ret = [];
    let formattedKeyArray = str.replaceAll(/^\/|\/$/g, '').split('/');
    let pos = formattedKeyArray.findIndex(e => e.search(/\$/) === -1 ? false : true);
    if (pos !== -1) {
        let parent = getObjectValueUsingString(obj, formattedKeyArray.slice(0, pos).join('')),
            after = formattedKeyArray.slice(pos + 1).join('/');
        if (typeof parent === 'object' && !Array.isArray(parent) && parent !== null) {
            if (after === '')
                Object.keys(parent).forEach((e, i) => {

                    ret.push(parent[e])
                });
            else
                Object.keys(parent).forEach((e, i) => {

                    ret.push(collectObjectValues(parent[e], after));
                });
        }
    }
    else
        return getObjectValueUsingString(obj, str);
    return ret;
}
export const getObjectValueUsingString = (obj, str) => {
    if (!obj || typeof obj !== 'object' || typeof str !== 'string') {
        return null;
    }
    if (str === '' || str === '/')
        return obj;
    let formattedKeyArray = str.replaceAll(/^\/|\/$/g, '').split('/');
    let acc = obj;
    for (var current of formattedKeyArray) {
        if (acc[current] === undefined) {
            acc = acc[current];
            break;
        }
        acc = acc[current];

    }
    return acc;
}
export const collectionToJsonSchema = (c, keys) => {
    if (!Array.isArray(keys))
        return [];
    if (keys.length === 0) {
        return [];
    }
    let data = new Array();
    keys.forEach((key) => {
        data.push({ key: key, type: 'json', data: c.schema, notSub: true, parent: c });
    });
    return data;
}
export const schemaToStringKeys = (map, level = '') => {
    let ret = [];
    if (!map || !Array.isArray(map))
        return;
    const fieldElements = map.map((e, i) => {
        if (e.type == 'text' || e.type == 'textarea' || e.type == 'select' || e.type == 'image')
            ret.push(`${level}/${e.key}`)


        else if (e.type == 'json' || e.type == 'collection')
            if (e.data)
                ret.push(...schemaToStringKeys(e.data, `${level}/${e.key}`))

    });
    return ret;

}
export const getValidationSchema = (map, level = '') => {
    let ret = {};
    if (!map || !Array.isArray(map))
        return;
    const fieldElements = map.map((e, i) => {
        if (e.type == 'text' || e.type == 'textarea' || e.type == 'select' || e.type == 'image') {
            if (e.validation)
                ret[`${level}/${e.key}`] = e.validation

        }
        else if (e.type == 'json' || e.type == 'collection')
            if (e.data)
                getValidationSchema(e.data, `${level}/${e.key}`)

    });
    return ret;

}