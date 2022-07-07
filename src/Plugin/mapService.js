import ReactDOMServer from 'react-dom/server'

import InfoWindow from './InfoWindow/InfoWindow';
import { Country, MeetingMode, GroupType } from './enums';

const smallLocationIcon = {
	url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png',
	scaledSize: {width: 20, height: 32}
};

const bigLocationIcon = {
	url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png',
	scaledSize: {width: 34, height: 54}
};

class MapService {

	/**
	 * '#' prefixes are used to create private class members
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
	 */
	#context;
	#mapElement;
	#mapInfoWindow;
	#map;
	#checkedCountriesObject = {};
	#checkedMeetingModesObject = {};
	#checkedGroupTypesObject = {};
	#swiper;

	#groups = [
		{
			id: 1,
			countryCode: "CR",
			groupTypeCode: "Mixed",
			leader: "Mateo",
			location: "Cede Central",
			address: "De la heladería Pops en el Centro Comercial Plaza América, 50 m norte y 300 m este, Avenida 48.",
			openingDate: "",
			meetingDay: "Miércoles",
			meetingHour: "5 PM",
			meetingModeCode: "FaceToFace",
			members: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 ],
			mapPosition: { lat: 9.9120102, lng: -84.0970564 },
			whatsAppNumber: "1234-5678",
		},
		{
			id: 2,
			countryCode: "CR",
			groupTypeCode: "Mixed",
			leader: "Marcos",
			location: "San José",
			address: "",
			openingDate: "",
			meetingDay: "Jueves",
			meetingHour: "7 PM",
			meetingModeCode: "Virtual",
			members: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
			mapPosition: { lat: 9.9355875, lng: -84.1308546 },
			whatsAppNumber: "1234-5678",
		},
		{
			id: 3,
			countryCode: "CR",
			groupTypeCode: "Mixed",
			leader: "Lucas",
			location: "San Francisco",
			address: "En algún lugar de San Francisco",
			openingDate: "",
			meetingDay: "Viernes",
			meetingHour: "7 PM",
			meetingModeCode: "FaceToFace",
			members: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
			mapPosition: { lat: 9.9083267, lng: -84.0626916 },
			whatsAppNumber: "1234-5678",
		},
		{
			id: 4,
			countryCode: "CR",
			groupTypeCode: "Mixed",
			leader: "Juan",
			location: "San Rafael Arriba",
			address: "",
			openingDate: "",
			meetingDay: "Sábados",
			meetingHour: "7 PM",
			meetingModeCode: "Virtual",
			members: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
			mapPosition: { lat: 9.8747724, lng: -84.0775282 },
			whatsAppNumber: "1234-5678",
		},
		{
			id: 5,
			countryCode: "MX",
			groupTypeCode: "Mixed",
			leader: "Pedro",
			location: "Motul",
			address: "N.º 301 x 29 y 31, 18, Motul, 97430 Motul de Carrillo Puerto, YUC",
			openingDate: "",
			meetingDay: "Miércoles",
			meetingHour: "6 PM",
			meetingModeCode: "Virtual",
			members: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
			mapPosition: { lat: 21.0979273, lng: -89.2920575 },
			whatsAppNumber: "1234-5678",
		},
		{
			id: 6,
			countryCode: "MX",
			groupTypeCode: "Mixed",
			leader: "Felipe",
			location: "Puerto Progreso",
			address: "Calle 33 N.º 274 x 16 y 18, Progreso, 97320 Progreso, YUC",
			openingDate: "",
			meetingDay: "Martes",
			meetingHour: "7 PM",
			meetingModeCode: "Virtual",
			members: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
			mapPosition: { lat: 21.30651, lng: -89.6870694 },
			whatsAppNumber: "1234-5678",
		},
		{
			id: 7,
			countryCode: "US",
			groupTypeCode: "Mixed",
			leader: "James",
			location: "Texas",
			address: "South Central region of the United States",
			openingDate: "",
			meetingDay: "Jueves",
			meetingHour: "7 PM",
			meetingModeCode: "Virtual",
			members: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
			mapPosition: { lat: 31.1541964, lng: -102.3196773 },
			whatsAppNumber: "1234-5678",
		},
	];

	filteredGroups = null;
	lastClickedGroupId;

	#getMinMaxAndAverage(arrayOfNumbers) {
		const min = Math.min(...arrayOfNumbers);
		const max = Math.max(...arrayOfNumbers);
		const average = (min + max) / 2;
		return {min, max, average};
	}

	#latitudeRad(lat) {
		const sin = Math.sin(lat * Math.PI / 180);
		const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
		return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
	}

	#getZoomLevel(latitudes, longitudes) {
		const latitudeFraction = (this.#latitudeRad(latitudes.max) - this.#latitudeRad(latitudes.min)) / Math.PI;
		const longitudeDiff = longitudes.max - longitudes.min;
		const longitudeFraction = ((longitudeDiff < 0) ? (longitudeDiff + 360) : longitudeDiff) / 360;
		
		const dimensionReductionFactor = 0.4;
		const reducedWidth = this.#mapElement.clientWidth * dimensionReductionFactor;
		const reducedHeight = this.#mapElement.clientHeight * dimensionReductionFactor;

		const latitudeZoom = Math.log(reducedHeight / 256 / latitudeFraction) / Math.LN2;
		const longitudeZoom = Math.log(reducedWidth / 256 / longitudeFraction) / Math.LN2;

		const zoom = Math.min(latitudeZoom, longitudeZoom);

		return zoom;
	}
	
	#enlargeMarkerIcon(marker) {
		this.#groups.forEach(group => {
			group.marker.setIcon(group.marker === marker ? bigLocationIcon : smallLocationIcon);
		});
	}

	#getKeyTrueObject(object) {
		// Create object with properties of {key => true}
		return Object.keys(object).reduce((obj, key) => {
			obj[key] = true;
			return obj;
		}, {});
	}

	#filterOptionsToSearchOptions(checkedOptionsObject, originalObject) {
		const checkedOptionsCount = Object.values(checkedOptionsObject).reduce(
			(count, value) => count + value,
			0
		);
		// If no options checked, include them all.
		if (checkedOptionsCount === 0) {
			return this.#getKeyTrueObject(originalObject);
		}
		return checkedOptionsObject;
	}

	#filterGroups() {
		// Generate options to include instead of filtered options
		const countriesToIncludeObject = this.#filterOptionsToSearchOptions(this.#checkedCountriesObject, Country);
		const meetingModesToIncludeObject = this.#filterOptionsToSearchOptions(this.#checkedMeetingModesObject, MeetingMode);
		const groupTypesToIncludeObject = this.#filterOptionsToSearchOptions(this.#checkedGroupTypesObject, GroupType);

		this.filteredGroups = this.#groups.filter(group => {
			const visible = !!countriesToIncludeObject[group.countryCode]
				&& !!meetingModesToIncludeObject[group.meetingModeCode]
				&& !!groupTypesToIncludeObject[group.groupTypeCode];

			// Take advantage of this loop and refresh the marker visibility
			group.marker.setVisible(visible);

			return visible;
		});

		// If no groups to show, use full groups array to calculate the zoom and center.
		let groupsForMapZoomAndCenter;
		if (this.filteredGroups.length === 0) {
			groupsForMapZoomAndCenter = this.#groups;
		} else {
			groupsForMapZoomAndCenter = this.filteredGroups;
		}
		
		const latitudes = this.#getMinMaxAndAverage(groupsForMapZoomAndCenter.map(group => group.mapPosition.lat));
		const longitudes = this.#getMinMaxAndAverage(groupsForMapZoomAndCenter.map(group => group.mapPosition.lng));

		const zoom = this.#getZoomLevel(latitudes, longitudes);
		this.#map.setZoom(Math.floor(zoom)); // setZoom only works with integers, we make sure to round downward.
		this.#map.setCenter({ lat: latitudes.average, lng: longitudes.average });

		this.unselectLastClickedGroup();

		this.#context.forceUpdate();
	}

	unselectLastClickedGroup() {
		if (this.lastClickedGroupId) {
			this.#groups.find(group => group.id === this.lastClickedGroupId).marker.setIcon(smallLocationIcon);
			this.#mapInfoWindow.close();
			this.lastClickedGroupId = null;
		}
	}

	handleGroupAndMapChange(group, index) {
		this.#map.panTo(group.mapPosition);
		this.#mapInfoWindow.close();
		this.#enlargeMarkerIcon(group.marker);

		this.lastClickedGroupId = group.id;

		// Using setTimeout to prevent a visual hop of the infoWindow
		setTimeout(() => {
			this.#mapInfoWindow.setContent(group.infoWindowContent);
			this.#mapInfoWindow.open(this.#map, group.marker);
		}, 100);

		this.#swiper.slideTo(index);
		
		this.#context.forceUpdate();
	}

	initMap(context) {
		if (this.#context) {
			// Avoid initializing twice
			return;
		}

		this.#context = context;
		this.#mapElement = document.getElementById("map");
		this.#mapInfoWindow = new google.maps.InfoWindow();

		const latitudes = this.#getMinMaxAndAverage(this.#groups.map(group => group.mapPosition.lat));
		const longitudes = this.#getMinMaxAndAverage(this.#groups.map(group => group.mapPosition.lng));

		this.#map = new google.maps.Map(this.#mapElement, {
			zoom: this.#getZoomLevel(latitudes, longitudes, this.#mapElement),
			center: { lat: latitudes.average, lng: longitudes.average },
		});
	
		// Create markers with their click listeners
		this.#groups.forEach((group, index) => {
			group.marker = new google.maps.Marker({
				map: this.#map,
				icon: smallLocationIcon,
				// label: {
				// 	text: "\f1a7",
				// 	fontFamily: "Elusive-Icons",
				// 	color: "#81d742",
				// 	fontSize: "18px",
				// },
				position: group.mapPosition,
				title: group.location,
			});

			group.infoWindowContent = ReactDOMServer.renderToString(<InfoWindow {...group} />);
	
			// On marker click listener
			google.maps.event.addListener(group.marker, 'click', () => {
				this.handleGroupAndMapChange(group, index);
			});
		});

		this.filteredGroups = this.#groups;

		// Force the component to update with the new changes
		this.#context.forceUpdate();
	}

	handleCountryChange(checkedOptionsObject) {
		this.#checkedCountriesObject = checkedOptionsObject;
		this.#filterGroups();
	}

	handleMeetingModeChange(checkedOptionsObject) {
		this.#checkedMeetingModesObject = checkedOptionsObject;
		this.#filterGroups();
	}

	handleGroupTypeChange(checkedOptionsObject) {
		this.#checkedGroupTypesObject = checkedOptionsObject;
		this.#filterGroups();
	}

	initSwiper(swiper) {
		this.#swiper = swiper;
	}

}

export default new MapService();
