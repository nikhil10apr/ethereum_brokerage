import React, { Component, Fragment } from 'react';
import { Route, Link } from 'react-router-dom';
import axios from 'axios';

import Web3Service from '../../ethereum/ethereum-app-utility';

import '../../styles/userForm.scss';

export default class RegisterUserComponent extends Component {
	constructor() {
		super();

		this.web3Service = Web3Service;
	}

	onSubmit(e, history) {
		e.preventDefault();
		const inputTag = e.currentTarget.getElementsByTagName('input');
		const selectTag = e.currentTarget.getElementsByTagName('select');
		const queryParam = '?id=' + inputTag.walletId.value + '&name=' + inputTag.name.value;

		if(selectTag.userType.value === 'client') {
			this.web3Service.contract.methods.registerClient(inputTag.walletId.value, inputTag.name.value).send({ from: inputTag.walletId.value, gasPrice: '10000000000000', gas: 1000000 }, (err, resp) => {
				history.push('/client' + queryParam);
			});
		} else if(selectTag.userType.value === 'broker') {
			this.web3Service.contract.methods.registerBroker(inputTag.walletId.value, inputTag.name.value).send({ from: inputTag.walletId.value, gasPrice: '10000000000000', gas: 1000000 }, (err, resp) => {
				history.push('/broker' + queryParam);
			});
		}
	}

	render() {
		return <div className='form-section'>
			<h1>SIGN UP</h1>
			<Route render={({ history}) => (
				<form onSubmit={(e) => { this.onSubmit(e, history) }}>
					<p><label>Wallet ID:</label><input type='text' name='walletId' /></p>
					<p><label>Name:</label><input type='text' name='name' /></p>
					<p>
						<label>User Type:</label>
						<select name='userType'>
							<option>SELECT TYPE</option>
							<option value='client'>CLIENT</option>
							<option value='broker'>BROKER</option>
						</select>
					</p>
					<p><button className='btn btn-primary'>SUBMIT</button></p>
				</form>
			)} />
		</div>;
	}
}