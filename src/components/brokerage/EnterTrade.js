import React, { Component, Fragment } from 'react';
import { Route, Link } from 'react-router-dom';
import axios from 'axios';

import Web3Service from '../../ethereum/ethereum-app-utility';

import '../../styles/userForm.scss';

export default class RegisterUserComponent extends Component {
	constructor() {
		super();

		this.web3Service = Web3Service;
		this.state = {
			status: 'enter',
			convRate: null,
			etherVal: null
		};

		this.onBlur = this.onBlur.bind(this);
		this.onCurrencyBlur = this.onCurrencyBlur.bind(this);
	}

	onSubmit(e, history) {
		e.preventDefault();
		const inputTag = e.currentTarget.getElementsByTagName('input');

		this.web3Service.contract.methods.submitTrade(inputTag.tradeId.value, inputTag.tradeDate.value, inputTag.currency.value, inputTag.settlementDate.value, true, this.props.clientCode, inputTag.brokerCode.value, inputTag.brokerageFee.value, parseInt(inputTag.conversionRate.value), parseInt(inputTag.brokerage.value)).send({ from: this.props.walletId, gasPrice: '10000000000000', gas: 3000000 }, (err, resp) => {
			!err && this.setState({
				status: 'submitted'
			});
		});
	}

	onCurrencyBlur(e) {
		const currency = e.currentTarget.value;
		axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms='+currency)
		.then(resp => {
			this.setState({
				convRate: resp.data[currency]
			});
		});
	}

	onBlur(e) {
		this.setState({
			etherVal: e.currentTarget.value/this.state.convRate
		});
	}

	render() {
		return this.state.status === 'enter' ? <div className='form-section'>
			<h1>SIGN UP</h1>
			<Route render={({ history}) => (
				<form onSubmit={(e) => { this.onSubmit(e, history) }}>
					<p><label>Trade ID:</label><input type='text' name='tradeId' /></p>
					<p><label>Trade Date:</label><input type='text' name='tradeDate' /></p>
					<p><label>Notional:</label><input type='text' name='notional' /></p>
					<p><label>Currency:</label><input type='text' onBlur={this.onCurrencyBlur} name='currency' /></p>
					<p><label>Counterparty:</label><input type='text' name='counterparty' /></p>
					<p><label>Settlement Date:</label><input type='text' name='settlementDate' /></p>
					<p><label>Broker code:</label><input type='text' name='brokerCode' /></p>
					<p><label>Bokerage Fee:</label><input type='text' onBlur={this.onBlur} name='brokerageFee' /></p>
					<p><label>Conversion Rate:</label><input type='text' name='conversionRate' value={this.state.convRate} readOnly /></p>
					<p><label>Brokerage(in Ethers):</label><input type='text' name='brokerage' value={this.state.etherVal} readOnly /></p>
					<p><button className='btn btn-primary'>SUBMIT</button></p>
				</form>
			)} />
		</div> :
		<div className='form-section'>
			<h1>Trade Submitted Successfully!</h1>
		</div>;
	}
}