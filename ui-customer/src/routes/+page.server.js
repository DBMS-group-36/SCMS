// @ts-nocheck

export async function load({ cookies }) {
    var visited = cookies.get('visited');
    var token = cookies.get('token');
    console.log(visited);
    console.log("set");

    let products;
    await fetch('http://localhost:5000/api/products', {
        method: 'GET'
    }).then(res => res.json()).then(json => { console.log(json); products = json.products; });

    return {
        visited, token, products
    };
}