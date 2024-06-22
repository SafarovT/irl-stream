import fs from 'fs'
import {Parser, Builder} from 'xml2js'

const ENCODING = 'utf16le'
const OUTPUT_FILE_MODIFICATOR = '_RTI'

function simplifyData(data) {
    let nodesToDelete = []
    
    // Упрощение путей
    data.osm.way.forEach(way => {
        if (way.nd) {
            const lastPointIndex = way.nd.length - 1

            // Упрощение пути
            const deletingNodes = way.nd.slice(1, lastPointIndex)
            if (deletingNodes.length > 0) {
                nodesToDelete.push(deletingNodes.map(wm => wm.$.ref))
            }
            way.nd = [way.nd[0], way.nd[lastPointIndex]]

            // Оценивание пути (TODO: сделать)
            way.tag = [{'$': {capacity: 1}}]
        }
    })
    nodesToDelete = nodesToDelete.flat()

    // Устранение лишних вершин
    const newNodes = []
    data.osm.node.forEach(node => {
        if (!nodesToDelete.includes(node.$.id)) {
            newNodes.push({$: node.$})
        }
    })
    
    return {
        node: newNodes,
        way: data.osm.way,
    }
}

function spliceSlice(str, index, count, add) {
    if (index < 0) {
      index = str.length + index;
      if (index < 0) {
        index = 0;
      }
    }
  
    return str.slice(0, index) + (add || "") + str.slice(index + count);
  }

function getNewFileName(fileName) {
    const newFileName = fileName
    const fileNameEndPos = newFileName.lastIndexOf('.')
    return spliceSlice(newFileName, fileNameEndPos, 0, OUTPUT_FILE_MODIFICATOR)
}

if (process.argv.length < 3) {
    console.error('В качестве аргумента напишите путь к файлу')
    process.exit(1)
}

const xmlFile = process.argv[2]
const parser = new Parser()
const builder = new Builder()

fs.readFile(xmlFile, ENCODING, (err, fileContent) => {
    const strFileContent = fileContent.toString()
    parser.parseString(strFileContent, (err, data) => {
        const newData = simplifyData(data)
        data = builder.buildObject(newData)

        fs.writeFile(getNewFileName(xmlFile), data, () => {
            console.warn('Done')
            console.warn('Nodes: ', newData.node.length)
            console.warn('Ways: ', newData.way.length)
        })
    })  
})
