import React, { Component } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { store } from './store';

import RegisterUser from './components/brokerage/RegisterUser';
import Client from './components/brokerage/ClientComponent';
import Broker from './components/brokerage/BrokerComponent';

import './resources/favicon.ico';

const render = () => ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Switch>
				// Brokerage Routes
				<Route path='/' component={RegisterUser} exact />
				<Route path='/client' component={Client} exact />
				<Route path='/broker' component={Broker} exact />
		    </Switch>
		</BrowserRouter>
	</Provider>, 
	document.getElementById("mainContainer")
);

render();

console.log('INITIALLISING APPLICATION');