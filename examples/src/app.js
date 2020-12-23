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
				<h3>Simple example:</h3>
				<h3>Styled example with default value:</h3>
				<AutosizeInput
					minWidth={100}
					parentQuery=".hihi"
					value={this.state.value2}
					onChange={this.updateInputValue.bind(this, 'value2')}
					style={{ background: '#eee', borderRadius: 5, padding: 5 }}
					inputStyle={{ border: '1px solid #999', borderRadius: 3, padding: 3, fontSize: 14 }}
				/>
			</div>
		);
	}
};

ReactDOM.render(<App />, document.getElementById('app'));
