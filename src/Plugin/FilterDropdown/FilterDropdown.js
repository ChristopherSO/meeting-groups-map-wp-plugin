import './FilterDropdown.scss';

const { Component } = wp.element;

class FilterDropdown extends Component {

	constructor() {
		super();
		this.state = {
			checkedOptionsObject: {},
			isOpen: false,
		};
	}

	clearFilters() {
		this.setState({checkedOptionsObject: {}});
		this.props.onOptionChange({});
	}

	handleOptionChange = (code, checked) => {
		const updatedCheckedOptionsObject = {...this.state.checkedOptionsObject};
		updatedCheckedOptionsObject[code] = checked;
		this.props.onOptionChange(updatedCheckedOptionsObject);
		this.setState({
			checkedOptionsObject: updatedCheckedOptionsObject,
			isOpen: false
		});
	}

	render() {
		const checkedOptionsCount = Object.values(this.state.checkedOptionsObject).reduce(
			(count, value) => count + value,
			0
		);
		const options = Object.entries(this.props.optionsObject);
		return (
			<div className="filter-dropdown">
				<button
					type="button"
					className={`button ${this.state.isOpen ? 'open' : ''}`}
					onClick={() => {this.setState({isOpen: true})}}
				>
					{this.props.filterName} {checkedOptionsCount ? `(${checkedOptionsCount})` : ''}
				</button>
				{this.state.isOpen &&
					<div className="relative">
						<div
							className="backdrop"
							onClick={() => {this.setState({isOpen: false})}}
						></div>
						<div className="dropdown">
							{options.map(([code, name]) => (
								<label key={code}>
									<input
										type="checkbox"
										name={code}
										defaultChecked={this.state.checkedOptionsObject[code]}
										onClick={(event) => this.handleOptionChange(code, event.target.checked)}
									/>
									{name}
								</label>
							))}
						</div>
					</div>
				}
			</div>
		);
	}
};

export default FilterDropdown;