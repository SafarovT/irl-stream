import {queryOverpass} from "./queryOverpass"
import {Parser} from 'xml2js'
import type {BBox, MapObjects, Way, Node, Coord} from "../types/map"

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
            const geometry: Array<Coord> = []
            way.nd.forEach((nd: any) => {
                const node = data.osm.node.find((node: any) => node.$.id === nd.$.ref)
                geometry.push({
                    lat: node.$.lat,
                    lon: node.$.lon,
                })
            });
            newWays.push({
                id: way.$.id,
                p1: way.nd[0].$.ref,
                p2: way.nd[lastPointIndex].$.ref,
                geometry: geometry,
                capacity: 1, // TODO: оценить
            })
        }
    })
    nodesToDelete = nodesToDelete.flat()
    // Разбивание путей по пересечениям
    const crossings = nodesToDelete.filter((number, index, numbers) => numbers.indexOf(number) !== index)
    crossings.forEach(crossing => {
        const waysWithCrossing = data.osm.way.filter((way: any) => way.nd.find((nd: any) => nd.$.ref === crossing))
        const crossingNode = data.osm.node.find((node: any) => node.$.id === crossing)
        const crossingCoord = {
            lat: crossingNode.$.lat,
            lon: crossingNode.$.lon,
        }
        waysWithCrossing.forEach((wayWithCrossing: any) => {
            const lastNewWayIndex = newWays.findIndex(way => way.id === wayWithCrossing.$.id)
            if (lastNewWayIndex !== -1) {
                const wayToSplit = newWays[lastNewWayIndex]
                const geometrySplitIndex = wayToSplit.geometry.findIndex(g => g === crossingCoord)
                newWays.splice(lastNewWayIndex, 1)
                // делить геометрию
                newWays.push({
                    ...wayToSplit,
                    p2: crossing,
                    geometry: wayToSplit.geometry.slice(0, geometrySplitIndex)
                })
                newWays.push({
                    ...wayToSplit,
                    p1: crossing,
                    geometry: wayToSplit.geometry.slice(geometrySplitIndex)
                })
            }
        })
        newNodes.push({
            coord: crossingCoord,
            id: crossingNode.$.id,
        })
    })

    // Устранение лишних вершин
    data.osm.node.forEach((node: any) => {
        if (!nodesToDelete.includes(node.$.id) && !newNodes.find(newNode => newNode.id === node.$.id)) {
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
