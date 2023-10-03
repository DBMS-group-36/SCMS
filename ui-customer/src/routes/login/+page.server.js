export const actions = {
    // @ts-ignore
    default: async ({ cookies, request }) => {
        const data = await request.formData();
        // @ts-ignore
        cookies.set('visited', 'true', { path: '/' });
        console.log(data);
    }
};