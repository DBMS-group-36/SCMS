// @ts-nocheck

export function load({ cookies }) {
    var visited = cookies.get('visited');
    var token = cookies.get('token');
    console.log(visited);
    console.log("set");

    return {
        visited, token
    };
}