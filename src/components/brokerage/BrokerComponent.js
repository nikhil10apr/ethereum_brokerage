import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Banner from '../common/Banner';
import EnterTrade from './EnterTrade';
import ViewAllTrade from './ViewAllTrades';

import { setPanelType } from '../../redux/reducers/player';
import Web3Service from '../../ethereum/ethereum-app-utility';

import '../../styles/player.scss';

const lhsMenuItems = {
	all: 'All Trades'
};

export class BrokerComponent extends Component {
	constructor() {
		super();

		this.web3Service = Web3Service;
		this.getUserDetails();
	}

	getUserDetails() {
		this.userDetails = {
			name: '',
			id: ''
		};
		location.href.split('?')[1].split('&').forEach((param) => {
			this.userDetails[param.split('=')[0]] = decodeURIComponent(param.split('=')[1]);
		});
	}

	getPanelComponent(banner) {
		switch (banner) {
			case 'all':
				return <ViewAllTrade walletId={this.userDetails.id} type='broker'/>;
			default:
				return null;
		}
	}

	render() {
		return <div className='container player-section'>
			<div className='col-lg player-sidebar'>
				<h2 className='sidebar-header d-flex justify-content-center'>
					Welcome, {decodeURIComponent(this.userDetails.name)}
				</h2>
				{
					Object.keys(lhsMenuItems).map(key => {
						return (<Banner
							label={lhsMenuItems[key]}
							isSelected={this.props.selectedPanel === key}
							onClick={() => this.props.setPanel(key)}
						/>);
					})
				}
			</div>
			<div className='col-lg pt-5 mt-5 pl-5 player-panel'>
				{this.getPanelComponent(this.props.selectedPanel)}
			</div>
		</div>;
	}
}

const mapStateToProps = (state) => ({
	selectedPanel: state.player.panelType
})

const mapDispatchToProps = (dispatch) => ({
	setPanel: (panel) => dispatch(setPanelType(panel))
})

export default connect(mapStateToProps, mapDispatchToProps)(BrokerComponent)