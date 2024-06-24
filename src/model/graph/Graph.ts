class Graph {
    private adjMatrix: Array<Array<number>>
    private size: number
    private vertexesData: Array<string>

    constructor(size: number) {
        this.adjMatrix = []
        this.size = size
        this.vertexesData = []
        for (let i = 0; i < size; i++) {
            this.adjMatrix.push([])
            this.vertexesData.push('')
            for (let j = 0; j < size; j++) {
                this.adjMatrix[i].push(0)
            }
        }
    }

    public AddEdge(from: number, to: number, capacity: number): void {
        this.adjMatrix[from][to] = capacity
    }

    public AddVertexData(vertex: number, data: string) {
        if (vertex >= 0 && vertex < this.size) {
            this.vertexesData[vertex] = data
        }
    }

    // to find augmented path
    private BFS(s: number, t: number, parent: Array<number>) {
        const visited: Array<boolean> = []
        for (let i = 0; i < this.size; i++) {
            visited.push(false)
        }
        const queue: Array<number> = []
        queue.push(s)
        visited[s] = true
        while (queue.length) {
            const u = queue.shift()
            if (u !== undefined) {
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
        const parent = []
        for (let i = 0; i < this.size; i++) {
            parent.push(-1)
        }
        let maxFlow = 0
        const pathesData = []

        while (this.BFS(source, sink, parent)) {
            let pathFlow = Infinity
            let s = sink
            while (s !== source) {
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
            pathesData.push({
                path: path.map(pathNode => this.vertexesData[pathNode]),
                capacity: pathFlow,
            })
        }

        return {
            maxFlow,
            flows: pathesData,
        }
    }
}

export {
    Graph,
}