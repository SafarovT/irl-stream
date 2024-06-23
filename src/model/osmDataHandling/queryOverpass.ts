import {fetchPostRequest} from "../../utils/fetchRequest"

function queryOverpass(query: string) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter' // TODO: обращаться к VK
    const timeout = 25000
    const format = 'xml'

    const prefix = `[out:${format}][timeout:${timeout}];\n`
    query = prefix + query

    return fetchPostRequest({
        requestUrl: overpassUrl,
        body: 'data=' + encodeURIComponent(query),
    })
        .then(
            response => response.text(),
            err => {
                throw new Error(err)
            }
        )
}

export {
    queryOverpass,
}
