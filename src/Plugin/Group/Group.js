import './Group.scss';
import { Country, MeetingMode, GroupType } from '../enums';

const Group = (props) => {

	const { countryCode, groupTypeCode, location, meetingModeCode } = props;

	const groupType = GroupType[groupTypeCode];

	let reducedGroupType
	if (groupType.indexOf(" (") > 0) {
		reducedGroupType = groupType.substring(0, groupType.indexOf(" ("));		
	} else {
		reducedGroupType = groupType;		
	}

	return (
		<div className="group">
			<div className="top-row">
				<div>{Country[countryCode]}</div>
				<div className="meeting-mode"><span>{reducedGroupType},</span> <span>{MeetingMode[meetingModeCode]}</span></div>
			</div>
			<h2>{location}</h2>
		</div>
	);
};

export default Group;