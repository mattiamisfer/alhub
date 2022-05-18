//import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import { DbGet, deleteFile } from '../functions/firebase';
import { getElementsOfType, collectObjectValues } from '../functions/objectStringSchema'
export const deleteFromDb = async (path) => {
    // const ref = typeof path === 'string' ? firebase.database().ref(path) : path
    // return new Promise(async (resolve, reject) => {
    //     try {
    //         let response = await ref.remove();
    //         resolve(response);
    //     }
    //     catch (error) {
    //         reject(error);
    //     }
    // })


}
export async function deleteData(ref, struct) {
    return new Promise((res, rej) => {

        DbGet(ref).then((data) => {
            let resources = [];
            if (data)
                for (const e of Object.keys(getElementsOfType(struct, 'image'))) {
                    let values = collectObjectValues(data, e)
                    console.log(e, values)
                    if (values)
                        Array.isArray(values) ? resources.push(...values) : resources.push(values)
                }
            console.log(resources)
            deleteFromDb(ref).then(() => {
                for (const e of resources) {
                    e && deleteFile(e).catch((e) => console.log(e));
                }
                res(true)
            }).catch((e) => {
                rej(e);
            })
        }).catch((e) => {
            console.log(e)
            res(true)
        })


    });

}

// const deleteFromStorage = (storeId) => {
//     const storage = firebase.storage();
//     try{
//         let response = storage.ref(`${url}`).delete();
//         return response;
//     }
//     catch(error){
//         throw new Error(`Error: ${error}`);
//     }
// }