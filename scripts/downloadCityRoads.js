import {fetchGetRequest} from "./utils/fetchRequest.js"
import {queryOverpass} from "./utils/queryOverpass.js"

const highwayTags = [
    'motorway',
	'motorway_link',
	'trunk',
	'trunk_link',
	'primary',
	'primary_link',
	'secondary',
	'secondary_link',
	'tertiary',
	'tertiary_link',
	'unclassified',
	'unclassified_link',
	'residential',
	'residential_link',
	'service',
	'service_link',
	'living_street',
	// 'pedestrian',
	'road'
].join('|') // deprecated

const powerLineTags = [
	'line',
].join('|')

function runOSM(area) {
	let filter = `[power=${powerLineTags}]`
	let query  = `
area(${area});
(._; )->.area;
(
way${filter}(area.area);
node(w);
);
out body;`

	return queryOverpass(query).then(print)
}

function print() {
	console.warn('')
	console.warn('All done.')
}

function fetchAreaIdForQuery(searchQuery) {
	const requestUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
    return fetchGetRequest({
		requestUrl,
	})
		.then(
			data => {
				if (data.length === 0) {
					throw new Error('No matches for ' + searchQuery)
				}

				const mainMatch = data[0]
				console.warn('Found: ' + mainMatch.display_name)
				let osmID = 1 * mainMatch.osm_id
				if ('relation' === mainMatch.osm_type) {
					osmID += 36e8
				}
				else if ('way' == mainMatch.osm_type) {
					osmID += 24e8
				}
				else {
					throw new Error('unknown osm type: ' + mainMatch.osm_type)
				}

				return osmID
			}, 
			err => {
				throw new Error(err)
			},
		)
}

let searchQuery = process.argv[2]

if (!searchQuery) {
    console.error('Please pass the search query for script')
    process.exit(1)
}

if (searchQuery[0] !== '"') searchQuery = `"${searchQuery}"`

// Find area id
console.warn('Searching for area ', searchQuery)
fetchAreaIdForQuery(searchQuery).then(runOSM).catch(err => console.error(err))
