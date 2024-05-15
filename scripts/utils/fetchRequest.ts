type FetchRequestCommonParams = {
    requestUrl: string,
    headers?: HeadersInit,
} 

type FetchPostRequestParams = FetchRequestCommonParams & {
    dataObject?: object,
}

type FetchGetRequestParams = FetchRequestCommonParams

const fetchPostRequest = async ({
    requestUrl,
    headers,
    dataObject,
}: FetchPostRequestParams) => {
    return fetch(requestUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(dataObject)
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
}: FetchGetRequestParams) => {
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