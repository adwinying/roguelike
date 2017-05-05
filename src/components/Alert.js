import React, { Component } from 'react';
import { connect } from 'react-redux';

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
		showAlert: state.controls.showAlert,
		isDed: state.controls.isDed
	}
};

const mapDispatchToProps = (dispatch) => {

};

const AlertContainer = connect(
	mapStateToProps
)(Alert);

export default AlertContainer;