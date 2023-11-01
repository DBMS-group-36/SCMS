// @ts-nocheck
export async function load({ cookies }) {

    var token = cookies.get('token');
    var userName = cookies.get('userName');

    let orders;
    await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
            "userName": userName,
        }),
    }).then(res => res.json()).then(json => { console.log(json.orders); orders = json.orders; });
    console.log("fuck")
    console.log(orders);
    return {
        token, userName, orders
    };
}