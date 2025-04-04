import * as consoleFormatter from "jsondiffpatch/formatters/console";
import * as jsondiffpatch from "jsondiffpatch/with-text-diffs";

const instance = jsondiffpatch.create({
	objectHash: (obj) => {
		const objRecord = obj as Record<string, string>;
		return (
			objRecord._id ||
			objRecord.id ||
			objRecord.name ||
			JSON.stringify(objRecord)
		);
	},
});

interface Continent {
	name: string;
	summary: string;
	surface?: number;
	timezone: [number, number];
	demographics: { population: number; largestCities: string[] };
	languages: string[];
	countries: Country[];
	spanishName?: string;
}

interface Country {
	name: string;
	capital?: string;
	independence?: Date;
	population?: number;
}

const data: Continent = {
	name: "South America",
	summary:
		"South America (Spanish: América del Sur, Sudamérica or Suramérica;" +
		" Portuguese: América do Sul; Quechua and Aymara: Urin Awya Yala;" +
		" Guarani: Ñembyamérika; Dutch: Zuid-Amerika; French: Amérique du Sud)" +
		" is a continent situated in the Western Hemisphere, mostly in the" +
		" Southern Hemisphere, with a relatively small portion in the Northern" +
		" Hemisphere. The continent is also considered a subcontinent of the" +
		" Americas.[2][3] It is bordered on the west by the Pacific Ocean and" +
		" on the north and east by the Atlantic Ocean; North America and the" +
		" Caribbean Sea lie to the northwest. It includes twelve countries: " +
		"Argentina, Bolivia, Brazil, Chile, Colombia, Ecuador, Guyana, Paraguay" +
		", Peru, Suriname, Uruguay, and Venezuela. The South American nations" +
		" that border the Caribbean Sea—including Colombia, Venezuela, Guyana," +
		" Suriname, as well as French Guiana, which is an overseas region of" +
		" France—are also known as Caribbean South America. South America has" +
		" an area of 17,840,000 square kilometers (6,890,000 sq mi)." +
		" Its population as of 2005 has been estimated at more than 371,090,000." +
		" South America ranks fourth in area (after Asia, Africa, and" +
		" North America) and fifth in population (after Asia, Africa," +
		" Europe, and North America). The word America was coined in 1507 by" +
		" cartographers Martin Waldseemüller and Matthias Ringmann, after" +
		" Amerigo Vespucci, who was the first European to suggest that the" +
		" lands newly discovered by Europeans were not India, but a New World" +
		" unknown to Europeans.",

	surface: 17840000,
	timezone: [-4, -2],
	demographics: {
		population: 385742554,
		largestCities: [
			"São Paulo",
			"Buenos Aires",
			"Rio de Janeiro",
			"Lima",
			"Bogotá",
		],
	},
	languages: [
		"spanish",
		"portuguese",
		"english",
		"dutch",
		"french",
		"quechua",
		"guaraní",
		"aimara",
		"mapudungun",
	],
	countries: [
		{
			name: "Argentina",
			capital: "Buenos Aires",
			independence: new Date(1816, 6, 9),
		},
		{
			name: "Bolivia",
			capital: "La Paz",
			independence: new Date(1825, 7, 6),
		},
		{
			name: "Brazil",
			capital: "Brasilia",
			independence: new Date(1822, 8, 7),
		},
		{
			name: "Chile",
			capital: "Santiago",
			independence: new Date(1818, 1, 12),
		},
		{
			name: "Colombia",
			capital: "Bogotá",
			independence: new Date(1810, 6, 20),
		},
		{
			name: "Ecuador",
			capital: "Quito",
			independence: new Date(1809, 7, 10),
		},
		{
			name: "Guyana",
			capital: "Georgetown",
			independence: new Date(1966, 4, 26),
		},
		{
			name: "Paraguay",
			capital: "Asunción",
			independence: new Date(1811, 4, 14),
		},
		{
			name: "Peru",
			capital: "Lima",
			independence: new Date(1821, 6, 28),
		},
		{
			name: "Suriname",
			capital: "Paramaribo",
			independence: new Date(1975, 10, 25),
		},
		{
			name: "Uruguay",
			capital: "Montevideo",
			independence: new Date(1825, 7, 25),
		},
		{
			name: "Venezuela",
			capital: "Caracas",
			independence: new Date(1811, 6, 5),
		},
	],
};

const left = JSON.parse(JSON.stringify(data), jsondiffpatch.dateReviver);

data.summary = data.summary
	.replace("Brazil", "Brasil")
	.replace("also known as", "a.k.a.");
data.languages[2] = "inglés";
data.countries.pop();
data.countries.pop();
const firstCountry = data.countries[0];
if (firstCountry) {
	firstCountry.capital = "Rawson";
}
data.countries.push({
	name: "Antártida",
});

// modify and move
if (data.countries[4]) {
	data.countries[4].population = 42888594;
}
data.countries.splice(11, 0, data.countries.splice(4, 1)[0] as Country);
data.countries.splice(2, 0, data.countries.splice(7, 1)[0] as Country);

// biome-ignore lint/performance/noDelete: allowed for demo purposes
delete data.surface;
data.spanishName = "Sudamérica";
data.demographics.population += 2342;

const right = data;
const delta = instance.diff(left, right);
consoleFormatter.log(delta);
