export function arrayIntersect(x, y) {
    var ret = [];
    for (var i = 0; i < x.length; i++) {
        for (var z = 0; z < y.length; z++) {
            if (x[i] == y[z]) {
                ret.push(x[i]);
                break;
            }
        }
    }
    return ret;

}
export function arrayDifference(x, y) {
    let ret = x.filter(e=>!y.some(k=>k===e));
    return ret;
}
export function objectDifference(a, b) {
    let ret = { ...a },
        x = Object.keys(a),
        y = Object.keys(b);
    for (var i = 0; i < x.length; i++) {
        for (var z = 0; z < y.length; z++) {
            if (x[i] == y[z]) {
                delete ret[x[i]];
                break;
            }
        }
    }
    return ret;

}
export function removeEmptyProperties(obj) {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, v]) => v != null)
            .map(([k, v]) => [k, v === Object(v) ? removeEmptyProperties(v) : v])
    );
}
export function getFilteredValues(obj, regexp) {
    if (typeof obj !== 'object' || obj === null)
        return [];
    let ret = [];
    Object.values(obj).forEach(e => {

    })
}