type Coord = {
    lat: number,
    lon: number,
}

type BBox = {
    p1: Coord,
    p2: Coord,
}

type Node = {
    coord: Coord,
    id: string,
}

type Way = {
    p1: string,
    p2: string,
    id: string,
    capacity: number,
}

type MapObjects = {
    nodes: Array<Node>,
    ways: Array<Way>,
}

export type {
    Coord,
    BBox,
    Node,
    Way,
    MapObjects,
}