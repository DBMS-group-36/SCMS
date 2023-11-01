// @ts-nocheck
export async function load({ cookies }) {

    var token = cookies.get('token');
    var userName = cookies.get('userName');
    console.log(token);

    return {
        token, userName
    };
}