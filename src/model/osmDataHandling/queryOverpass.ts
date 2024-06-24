import {fetchPostRequest} from "../../utils/fetchRequest"

// const ENDPOINT_URL = 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
const ENDPOINT_URL = 'https://overpass-api.de/api/interpreter'

function queryOverpass(query: string) {
    const overpassUrl = ENDPOINT_URL
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
