// @ts-nocheck

export function load({ cookies }) {
    const visited = cookies.get('visited');
    console.log(visited);
    console.log("set");

    return {
        visited
    };
}