import { Swiper, SwiperSlide } from 'swiper/react';
import './Plugin.scss';
// Import Swiper styles
import 'swiper/css';

import mapService from './mapService';
import Group from './Group/Group';
import FilterDropdown from './FilterDropdown/FilterDropdown';
import { Country, MeetingMode, GroupType, Text } from './enums';

const { Component, createRef } = wp.element;

let isMobile = window.matchMedia('(max-width: 666px)').matches;
let didMount = false;

class Plugin extends Component {

	constructor() {
		super();
		this.countryFilterDropdownReference = createRef();
		this.meetingModeFilterDropdownReference = createRef();
		this.groupTypeFilterDropdownReference = createRef();
	}

	async componentDidMount() {
		// Prevent multiple mounts
		if (didMount) {
			return;
		}
		didMount = true;

		window.addEventListener('resize', () => {
			isMobile = window.matchMedia('(max-width: 700px)').matches;
			this.forceUpdate();
		});

		mapService.initMap(this);
	}

	clearFilters() {
		this.countryFilterDropdownReference.current.clearFilters();
		this.meetingModeFilterDropdownReference.current.clearFilters();
		this.groupTypeFilterDropdownReference.current.clearFilters();

		mapService.unselectLastClickedGroup();
	}

	render() {
		return (
			<div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
				<div className="filters">
					<div>{Text.FilterBy}</div>
					<div className="spacer"></div>
					<button
						type="button"
						className='link-button'
						onClick={this.clearFilters.bind(this)}
					>{Text.ClearFilters}</button>
					<div className="filter-dropdowns">
						<FilterDropdown
							filterName={Text.Country}
							optionsObject={Country}
							onOptionChange={mapService.handleCountryChange.bind(mapService)}
							ref={this.countryFilterDropdownReference}
						/>
						<FilterDropdown
							filterName={Text.GroupType}
							optionsObject={GroupType}
							onOptionChange={mapService.handleGroupTypeChange.bind(mapService)}
							ref={this.groupTypeFilterDropdownReference}
						/>
						<FilterDropdown
							filterName={Text.MeetingMode}
							optionsObject={MeetingMode}
							onOptionChange={mapService.handleMeetingModeChange.bind(mapService)}
							ref={this.meetingModeFilterDropdownReference}
						/>
					</div>
				</div>
				<p className="note"><i className="info-icon">i</i> {isMobile ? Text.InfoNoteBottom : Text.InfoNoteLeft}</p>
				<div className="groups-and-map-container">
					<div className="groups">
						<Swiper
        					direction={isMobile ? 'horizontal' : 'vertical'}
							slidesPerView={"auto"}
							centeredSlides={isMobile ? true : false}
							spaceBetween={12}
							slideToClickedSlide={true}
							onSwiper={(swiper) => {mapService.initSwiper(swiper)}}
						>
							{mapService.filteredGroups === null && 
								<div>{Text.Loading}</div>
							}
							{mapService.filteredGroups && mapService.filteredGroups.length === 0 && 
								<div>{Text.NoResultsToShow}</div>
							}
							{mapService.filteredGroups && mapService.filteredGroups.map((group, index) => (
								<SwiperSlide
									key={group.id}
									className={`group-wrapper ${group.id === mapService.lastClickedGroupId ? 'highlighted' : ''}`}
									onClick={() => mapService.handleGroupAndMapChange(group, index)}
								>
									<Group {...group} />
								</SwiperSlide>
							))}
						</Swiper>
					</div>
					<div id="map"></div>
				</div>
			</div>
		);
	}
};

export default Plugin;
