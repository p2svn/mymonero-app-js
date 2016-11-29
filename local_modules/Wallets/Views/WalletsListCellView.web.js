// Copyright (c) 2014-2017, MyMonero.com
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//	of conditions and the following disclaimer in the documentation and/or other
//	materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//	used to endorse or promote products derived from this software without specific
//	prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
"use strict"
//
const View = require('../../Views/View.web')
//
class WalletsListCellView extends View
{
	constructor(options, context)
	{
		super(options, context)
		//
		const self = this
		self.setup()
	}
	setup()
	{
		const self = this
		self.setup_views()
		self.setup_layers()
	}
	setup_views()
	{
		const self = this
	}
	setup_layers()
	{
		const self = this
		//
		self.setup_layers_accountInfo()
		self.setup_layers_transactions()
	}
	setup_layers_accountInfo()
	{
		const self = this
		//
		const layer = document.createElement("div")
		layer.className = "accountInfo"
		layer.style.border = "1px solid red"
		//
		self.layer_accountInfo = layer
		self.layer.appendChild(layer)
	}
	setup_layers_transactions()
	{
		const self = this
		//
		const layer = document.createElement("div")
		layer.className = "transactions"
		layer.style.border = "1px solid blue"
		//
		self.layer_transactions = layer
		self.layer.appendChild(layer)
	}
	//
	//
	// Internal - Teardown/Recycling
	//
	prepareForReuse()
	{
		const self = this
		self.stopObserving_wallet()
		self.wallet = null
	}
	stopObserving_wallet()
	{
		const self = this
		if (typeof self.wallet === 'undefined' || !self.wallet) {
			return
		}
		function doesListenerFunctionExist(fn)
		{
			if (typeof fn !== 'undefined' && fn !== null) {
				return true
			}
			return false
		}
		if (doesListenerFunctionExist(self.wallet_EventName_accountInfoUpdated_listenerFunction) === true) {
			self.wallet.remoteListener(
				self.wallet.EventName_accountInfoUpdated(),
				self.wallet_EventName_accountInfoUpdated_listenerFunction
			)
		}
		if (doesListenerFunctionExist(self.wallet_EventName_transactionsUpdated_listenerFunction) === true) {
			self.wallet.remoteListener(
				self.wallet.EventName_transactionsUpdated(),
				self.wallet_EventName_transactionsUpdated_listenerFunction
			)
		}
	}
	//
	//
	// Internal - Runtime - Accessors
	//
	//
	//
	// Interface - Runtime - Imperatives - State/UI Configuration
	//
	ConfigureWith_wallet(wallet)
	{
		const self = this
		if (typeof self.wallet !== 'undefined') {
			self.prepareForReuse()
		}
		self.wallet = wallet
		self._configureUIWithWallet()
		self.startObserving_wallet()
	}
	//
	//
	// Internal - Runtime - Imperatives - State/UI Configuration
	//
	_configureUIWithWallet()
	{
		const self = this
		self._configureUIWithWallet__accountInfo()
		self._configureUIWithWallet__transactions()
	}
	_configureUIWithWallet__accountInfo()
	{
		const self = this
		const wallet = self.wallet
		self.layer_accountInfo.innerHTML =
			"<p>"
				+ wallet.walletLabel + ": " + wallet.Balance() + wallet.wallet_currency
			+ "</p>"
	}
	_configureUIWithWallet__transactions()
	{
		const self = this
		const wallet = self.wallet
		var lisHTMLString = ""
		const stateCachedTransactions = wallet.New_StateCachedTransactions()
		stateCachedTransactions.forEach(
			function(tx, i)
			{
				lisHTMLString += "<li>" + tx.formatted_amount + "" + wallet.wallet_currency + "</li>"
				// TODO:
				// <strong class="bold" ng-show="tx_is_confirmed(tx)">{{tx.amount | money}}  <span ng-show="!tx_is_unlocked(tx)"><i class="fa fa-lock"></i></span></strong>
				// <strong class="bold red" ng-show="!tx_is_confirmed(tx)">{{tx.amount | money}} (unconfirmed)  <span ng-show="!tx_is_unlocked(tx)"><i class="fa fa-lock"></i></span></strong>
				// {{tx.timestamp | time}}
				// {{tx.mixin}}
				// {{tx.hash}}
				// <div class="transaction-detail transaction-left" style="font-size: 11px;" ng-show="!tx_is_unlocked(tx)">
				// {{tx_locked_reason(tx)}}
				// </div>
				// {{tx.payment_id || "N/A"}}
			}
		)
		// TODO: optimize this by maybe not using innerHTML?
		self.layer_transactions.innerHTML = "<ul>" + lisHTMLString + "</ul>"
	}
	//
	//
	// Internal - Runtime - Imperatives - Observation
	//
	startObserving_wallet()
	{
		const self = this
		if (typeof self.wallet === 'undefined' || self.wallet === null) {
			throw "wallet undefined in start observing"
			return
		}
		// here, we're going to store a bunch of functions as instance properties
		// because if we need to stopObserving we need to have access to the listener fns
		//
		// account info updated
		self.wallet_EventName_accountInfoUpdated_listenerFunction = function()
		{
			self.wallet_EventName_accountInfoUpdated()
		}
		self.wallet.on(
			self.wallet.EventName_accountInfoUpdated(),
			self.wallet_EventName_accountInfoUpdated_listenerFunction
		)
		//
		// txs updated
		self.wallet_EventName_transactionsUpdated_listenerFunction = function()
		{
			self.wallet_EventName_transactionsUpdated()
		}
		self.wallet.on(
			self.wallet.EventName_transactionsUpdated(),
			self.wallet_EventName_transactionsUpdated_listenerFunction
		)
	}
	//
	//
	// Internal - Runtime - Delegation - Event handlers - Wallet
	//
	wallet_EventName_accountInfoUpdated()
	{
		const self = this
		self._configureUIWithWallet__accountInfo()
	}
	wallet_EventName_transactionsUpdated()
	{
		const self = this
		self._configureUIWithWallet__transactions()
	}
}
module.exports = WalletsListCellView
