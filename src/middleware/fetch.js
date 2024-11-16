export const fetch =  async (url, method, data = {}) => {
    try {
        const options = {
            method: method,
        }
        if(method === 'POST' || method === 'PUT') {
            options.body = JSON.stringify(data)
            options.headers = {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(url, {...options});
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}
