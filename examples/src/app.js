/* eslint-disable react/jsx-no-bind */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AutosizeInput from 'react-input-autosize';

import './example.less';

class App extends Component {
	constructor (props) {
		super(props);
		this.state = {
			value1: '',
			value2: 'example',
			value3: 3,
			value4: '',
			value5: '',
		};
	}
	updateInputValue = (input, event) => {
		const newState = {};
		newState[input] = event.target.value;
		this.setState(newState);
	};
	render () {
		return (
			<div style={{ width: 300, border: '1px dashed red' }} className="hihi">
				<AutosizeInput
					minWidth={100}
					parentSelector=".hihi"
					value={this.state.value2}
					onChange={this.updateInputValue.bind(this, 'value2')}
				/>
			</div>
		);
	}
};

ReactDOM.render(<App />, document.getElementById('app'));
