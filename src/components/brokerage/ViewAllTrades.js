import React, { Component, Fragment } from 'react';

import Trade from './Trade';
import Web3Service from '../../ethereum/ethereum-app-utility';

import '../viewTickets.scss'

const tradeStatus = ['UnSettled', 'Disputed', 'Settled'];

export default class ViewAllTradesComponent extends Component {
	constructor(props) {
		super();

		this.web3Service = Web3Service;
		this.state = {
			trades: []
		};
		this.fetchTrades(props.walletId, props.type);
		this.bindEvents();
	}

	bindEvents() {
		this.web3Service.contract.events.NewTradeSubmit()
		.on('data', (event) => {
		    console.log(event);
		    this.fetchTrades(this.props.walletId, this.props.type);
		});
	}

	fetchTrades(walletId, type) {
		if(type === 'broker') {
			this.web3Service.contract.methods.getBrokerTrades().call({ from: walletId, gasPrice: '10000000000000', gas: 1000000 }, (err, resp) => {
				!err && this.setState({trades: resp, error: false})
			});
		} else {
			this.web3Service.contract.methods.getClientTrades().call({ from: walletId, gasPrice: '10000000000000', gas: 1000000 }, (err, resp) => {
				!err && this.setState({trades: resp, error: false})
			});
		}
		
	}

	showTickets() {
		const { trades } = this.state;
		return (
			<div className='tickets'>
				<table className='mt-4'>
					<thead>
						<tr>
							<th>MarkitWire ID</th>
							<th>Trade Date</th>
							<th>Brokerage Amount</th>
							<th>Currency</th>
							<th>Conversion Rate</th>
							<th>Ethers</th>
							<th>Settlement Date</th>
							<th>Status</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{trades.map(trade => {
							return <Trade trade={trade} type={this.props.type} walletId={this.props.walletId}/>
						})}
					</tbody>
				</table>
			</div>
		)
	}

	render() {
		return (
			<div>
				{
					this.state.trades.length === 0
							? <h2>No trades</h2>
							: this.showTickets()
				}
			</div>
		);
	}
}