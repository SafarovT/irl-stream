import type {BBox, Coord, MapObjects} from "../model/types/map"

abstract class AbstractMap {
	public abstract SetTarget(target: string | HTMLElement | undefined): void
	public abstract SetView(center: Coord, zoom: number): void
	public abstract GetBouds(): BBox
	public abstract Clear(): void
	public abstract DisplayMapObjects(objects: MapObjects): void
	public abstract AddOnClick(callback: (id: string) => void): void
	public abstract AddPoints(coords: Coord[], color: string[]): void
	public abstract AddWays(ways: Array<Array<Coord>>, color: string[]): void 
}

export {
	AbstractMap,
}