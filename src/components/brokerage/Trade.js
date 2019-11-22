import React, { Component, Fragment } from 'react';
import Modal from 'react-modal';

import Web3Service from '../../ethereum/ethereum-app-utility';

import '../viewTickets.scss';
import '../../styles/userForm.scss';

const tradeStatus = ['UnSettled', 'Disputed', 'Settled'];

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default class ViewAllTradesComponent extends Component {
	constructor(props) {
		super();

		this.state = {
	    	modalIsOpen: false
	    };
		this.web3Service = Web3Service;
		this.onAction = this.onAction.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.brokerAction = this.brokerAction.bind(this);
	}

	brokerAction(e) {
		this.web3Service.contract.methods.confirmBrokerageAmount(this.props.trade.trade.markitWireId).send({ from: this.props.walletId, gasPrice: '10000000000000', gas: 3000000 }, (err, resp) => {
			!err && this.closeModal();
		});

		e.preventDefault();
		e.stopPropagation();
	}

	clientAction() {
		
	}

	onAction() {
		this.setState({
			modalIsOpen: true
		});
	}

	closeModal() {
		this.setState({
			modalIsOpen: false
		});
	}

	onSubmit(e, history) {
		e.preventDefault();

		const inputTag = e.currentTarget.getElementsByTagName('input');
		const textAreaTag = e.currentTarget.getElementsByTagName('textarea');
		this.web3Service.contract.methods.disputeBrokerage(this.props.trade.trade.markitWireId, inputTag.updateAmount.value, textAreaTag.comments.value).send({ from: this.props.walletId, gasPrice: '10000000000000', gas: 3000000 }, (err, resp) => {
			!err && this.closeModal();
		});
		
	}

	render() {
		const { trade } = this.props;
		return (<Fragment>
			<tr>
				<td>{trade.trade.markitWireId}</td>
				<td>{trade.trade.tradeDate}</td>
				<td>{trade.trade.brokerageAmount}</td>
				<td>{trade.trade.currency}</td>
				<td>{trade.trade.brokerageAmount}</td>
				<td>{trade.trade.brokerageAmount}</td>
				<td>{trade.trade.settlementDate}</td>
				<td>{tradeStatus[trade.status]}</td>
				{this.props.type === 'broker' && trade.status === '0' ? 
					<td><button className='btn btn-primary' onClick={this.onAction}>Accept/Reject</button></td> : null
				} 
				{this.props.type === 'client' && trade.status === '1' ? 
					<td><button className='btn btn-primary' onClick={this.onAction}>Accept/Reject</button></td> : null
				}
			</tr>
			<Modal
	          isOpen={this.state.modalIsOpen}
	          onAfterOpen={this.afterOpenModal}
	          onRequestClose={this.closeModal}
	          style={customStyles}
	          contentLabel="Example Modal"
	        >
	        	<button onClick={this.closeModal}>X</button>
	        	<div className='form-section' style={{border: '0px'}}>
	        		<form onSubmit={(e) => { this.onSubmit(e, history) }}>
						<p><label>MarkitWire ID:</label><input type='text' value={trade.trade.markitWireId} disabled/></p>
						<p><label>Current Amount:</label><input type='text' value={trade.trade.brokerageAmount} disabled/></p>
						<p><label>Updated Amount:</label><input type='text' name='updateAmount' /></p>
						<p><label>Comments:</label><textarea type='text' name='comments' /></p>
						{this.props.type === 'broker' ? 
							<Fragment><button>Reject</button>
							<button onClick={this.brokerAction}>Accept</button></Fragment> : null
						}
						{this.props.type === 'client' ? 
							<button>Submit</button> : null
						}
					</form>
	        	</div>
	        </Modal>
		</Fragment>);
	}
}