import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideAlert } from '../actions';

class Alert extends Component {
	render () {
		var className = "rogue-alert text-center alert alert-dismissible";
		var boldText  = "";
		var message   = "";

		if (this.props.showAlert) {
			className += " active";
			if (this.props.isDed) {
				className += " alert-danger";
				boldText   = "You Died.";
				message    = " Better luck next time!";
			} else {
				className += " alert-success";
				boldText   = "Congratulations.";
				message    = " You won!";
			}
			setTimeout(() => {
				this.props.hideAlert();
			}, 3000);
		} 

		return (
			<div className="container">
				<div className={className}>
				  <strong>{boldText}</strong>{message}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		showAlert: state.showAlert,
		isDed: state.isDed
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		hideAlert: () => {
			dispatch(hideAlert());
		}
	}
};

const AlertContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Alert);

export default AlertContainer;