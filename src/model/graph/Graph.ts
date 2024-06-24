class Graph<DataType> {
    private adjMatrix: Array<Array<number>>
    private size: number
    private vertexesData: Array<DataType>

    constructor(size: number) {
        const matrixRow = new Array(size).fill(0)
        this.adjMatrix = new Array(size).fill(matrixRow)
        this.size = size
        this.vertexesData = new Array(size).fill('')
    }

    public AddEdge(from: number, to: number, capacity: number): void {
        this.adjMatrix[from][to] = capacity
    }

    public AddVertexData(vertex: number, data: DataType) {
        if (vertex >= 0 && vertex < this.size) {
            this.vertexesData[vertex] = data
        }
    }

    // to find augmented path
    private BFS(s: number, t: number, parent: Array<number>) {
        const visited = new Array(this.size).fill(false)
        const queue: Array<number> = []
        queue.push(s)
        visited[s] = true
        while (queue.length) {
            const u = queue.pop()
            if (u) {
                this.adjMatrix[u].forEach((capacity, i) => {
                    if (!visited[i] && capacity > 0) {
                        queue.push(i)
                        visited[i] = true
                        parent[i] = u
                    }
                })
            }
        }

        return visited[t]
    }

    public EdmondKarp(source: number, sink: number) {
        const parent = new Array(this.size).fill(-1)
        let maxFlow = 0
        const pathesData = []

        while (this.BFS(source, sink, parent)) {
            let pathFlow = Infinity
            let s = sink
            while (s != source) {
                pathFlow = Math.min(pathFlow, this.adjMatrix[parent[s]][s])
                s = parent[s]
            }

            maxFlow += pathFlow
            let v = sink
            while (v !== source) {
                let u = parent[v]
                this.adjMatrix[u][v] -= pathFlow
                this.adjMatrix[v][u] += pathFlow
                v = parent[v]
            }

            const path = []
            v = sink
            while (v !== source) {
                path.push(v)
                v = parent[v]
            }
            path.push(source)
            path.reverse()
            pathesData.push(path.map(pathNode => this.vertexesData[pathNode]))
        }

        return {
            maxFlow,
            pathes: pathesData,
        }
    }
}

export {
    Graph,
}