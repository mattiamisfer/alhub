export class Utils {

    static async nullCheck(stringWord) {
        let returnValue = false;
        if (stringWord != undefined && stringWord != null && stringWord.length != 0 && stringWord.length != '') {
            returnValue = true;
        }else{
            returnValue = false;
        }
        console.log('-----' + stringWord )
        console.log('-----returnValue-----', returnValue)
        return returnValue;
    };
}