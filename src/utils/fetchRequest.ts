type CommonRequestArgs = {
    requestUrl: string,
    headers?: Headers,
}

type PostRequestArgs = CommonRequestArgs & {
    body: BodyInit | string,
}

type GetRequestArgs = CommonRequestArgs

const fetchPostRequest = async ({
    requestUrl,
    headers,
    body,
}: PostRequestArgs) => {
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
}: GetRequestArgs) => {
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