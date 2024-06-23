import {queryOverpass} from "./queryOverpass"
import {Parser} from 'xml2js'
import type {BBox, MapObjects, Way, Node} from "../types/map"

const powerLineTag = 'line'

function simplifyData(data: any): MapObjects {
    const newNodes: Array<Node> = []
    const newWays: Array<Way> = []
    let nodesToDelete: Array<string> = []
    
    // Преобразовывание путей
    data.osm.way.forEach((way: any) => {
        if (way.nd) {
            const lastPointIndex = way.nd.length - 1

            // Упрощение пути
            const deletingNodes = way.nd.slice(1, lastPointIndex)
            if (deletingNodes.length > 0) {
                nodesToDelete.push(deletingNodes.map((wm: any) => wm.$.ref))
            }
            newWays.push({
                id: way.$.id,
                p1: way.nd[0].$.ref,
                p2: way.nd[lastPointIndex].$.ref,
                capacity: 1, // TODO: оценить
            })
            
            way.nd = [way.nd[0], way.nd[lastPointIndex]]

            way.tag = [{'$': {capacity: 1}}]
        }
    })
    nodesToDelete = nodesToDelete.flat()

    // Устранение лишних вершин
    data.osm.node.forEach((node: any) => {
        if (!nodesToDelete.includes(node.$.id)) {
            newNodes.push({
                coord: {
                    lat: node.$.lat,
                    lon: node.$.lon,
                },
                id: node.$.id,
            })
        }
    })
    
    return {
        nodes: newNodes,
        ways: newWays,
    }
}

async function getRawData(bbox: BBox): Promise<string> {
    const filter = `[power=${powerLineTag}]`
    const bboxStr = `${bbox.p1.lat}, ${bbox.p1.lon}, ${bbox.p2.lat}, ${bbox.p2.lon}`
    let query  = `
(
way${filter}(${bboxStr});
node(w);
);
out body;`

    return queryOverpass(query).then(
        response => response,
        err => {
            throw new Error(err)
        },
    )
}

async function handleData(rawData: any): Promise<MapObjects>  {
    const parser = new Parser()
    const data = await parser.parseStringPromise(rawData).then(
        (data: any) => {
            const newData = simplifyData(data)
            return newData
        },
    )

    return data
}

async function getOSMData(bbox: BBox): Promise<MapObjects> {
    return getRawData(bbox).then(
        rawData => handleData(rawData)
    )
}

export {
    getOSMData,
}
