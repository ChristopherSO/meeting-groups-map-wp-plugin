import './InfoWindow.scss';
import { GroupType, MeetingMode } from '../enums';

const { Component, render } = wp.element;

class InfoWindow extends Component {

	getElement = () => render()

	render() {
		const {groupTypeCode, location, address, meetingModeCode, whatsAppNumber} = this.props;

		const groupType = GroupType[groupTypeCode];
	
		let reducedGroupType
		if (groupType.indexOf(" (") > 0) {
			reducedGroupType = groupType.substring(0, groupType.indexOf(" ("));		
		} else {
			reducedGroupType = groupType;		
		}

		return (
			<div className="info-window">
				<div className="top-row">
					<h2>{location}</h2>
					<div className="meeting-mode">{reducedGroupType}</div>
				</div>
				{meetingModeCode === MeetingMode.Virtual && 
					<p>{MeetingMode.Virtual}</p>
				}
				{meetingModeCode !== MeetingMode.Virtual &&
					<p>{address || MeetingMode[meetingModeCode]}</p>
				}
				<div>WhatsApp {whatsAppNumber}</div>
			</div>
		);
	}
};

export default InfoWindow;