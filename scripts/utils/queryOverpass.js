import {fetchPostRequest} from "./fetchRequest.js"

function queryOverpass(query) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter' // к VK обращаться
    const timeout = 25000
    const format = 'xml'
    const outStream = process.stdout

    const prefix = `[out:${format}][timeout:${timeout}];\n`
    query = prefix + query

    console.warn('Executing: ')
    console.warn('')
    console.warn(query)
    console.warn('')
    console.warn('Note: This may take a while. Please be patient')

    return fetchPostRequest({
        requestUrl: overpassUrl,
        body: 'data=' + encodeURIComponent(query),
    })
        .then(
            response => {
                response.text().then(data => {
                    outStream.write(data)
                    return data
                })
            },
            err => {
                throw new Error(err)
            }
        )
}

export {
    queryOverpass,
}
