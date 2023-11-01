export async function load({ cookies }) {

    var token = cookies.get('token');



    return {
        token
    };
}