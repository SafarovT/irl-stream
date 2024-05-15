import {fetchPostRequest} from "./fetchRequest"

function queryOverpass(query: string) {
    const overpassUrl = 'http://overpass-api.de/api/interpreter' // 'https://lz4.overpass-api.de/api/interpreter'
    const timeout = 25000
    const format = 'json'
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
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        dataObject: {
            data: query,
        },
    })
        .then(
            (response: Response) => response.text().then(data => {
                outStream.write(data)
                return data
            }),
            err => {
                throw new Error(err)
            }
        )
}

export {
    queryOverpass,
}
