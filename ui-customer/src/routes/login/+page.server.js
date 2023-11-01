/** @type {import('./$types').Actions} */
export const actions = {
    // @ts-ignore
    default: async ({ cookies, request }) => {
        const data = await request.formData();
        // @ts-ignore
        console.log(data);
        console.log("un")
        console.log(data.get('username'));
        let data2 = {
            "userName": data.get('username'),
            "password": data.get('password')
        }
        let un = (data.get('username') ?? '').toString();
        const body = JSON.stringify(data2);
        await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
        }).then(res => res.json()).then(json => {
            console.log(json);
            if (json.response.isSuccess) {
                console.log("success");
                cookies.set('token', json.accessToken, {
                    expires: new Date(json.expire),
                    path: '/'
                });
                cookies.set('userName', un, {
                    expires: new Date(json.expire),
                    path: '/'
                });
                cookies.set('visited', 'true', {
                    expires: new Date(json.expire),
                    path: '/'
                });
            } else {
                console.log("error");
            }

        });



    }
};