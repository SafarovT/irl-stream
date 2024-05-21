const fetchPostRequest = async ({
    requestUrl,
    headers,
    body,
}) => {
    return fetch(requestUrl, {
        method: 'POST',
        headers,
        body,
    }).then(response => {
        if (!response.ok) {
            throw new Error()
        }
        return response
    })
}

const fetchGetRequest = async ({
    requestUrl,
    headers,
}) => {
    return fetch(requestUrl, {
        method: 'GET',
        headers,
    }).then(response => {
        if (!response.ok) {
            throw new Error()
        }
        return response.json()
    })
}

export {
    fetchPostRequest,
    fetchGetRequest,
}