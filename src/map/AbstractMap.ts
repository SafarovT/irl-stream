import type {BBox, Coord} from "../model/types/map"

abstract class AbstractMap {
	public abstract SetTarget(target: string | HTMLElement | undefined): void
	public abstract SetView(center: Coord, zoom: number): void;
	public abstract GetBouds(): BBox
}

export {
	AbstractMap,
}