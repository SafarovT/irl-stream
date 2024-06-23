import type {BBox, Coord, MapObjects} from "../model/types/map"

abstract class AbstractMap {
	public abstract SetTarget(target: string | HTMLElement | undefined): void
	public abstract SetView(center: Coord, zoom: number): void
	public abstract GetBouds(): BBox
	public abstract Clear(): void
	public abstract DisplayMapObjects(objects: MapObjects): void
}

export {
	AbstractMap,
}