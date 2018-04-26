import React from 'react';
import { connect } from 'react-redux';
import { hideAlert } from '../actions';

const Alert = (props) => {
  let className = 'rogue-alert text-center alert alert-dismissible';
  let boldText  = '';
  let message   = '';

  if (props.showAlert) {
    className += ' active';
    if (props.isPlayerDed) {
      className += ' alert-danger';
      boldText = 'You Died.';
      message = ' Better luck next time!';
    } else {
      className += ' alert-success';
      boldText = 'Congratulations.';
      message = ' You won!';
    }
    setTimeout(() => {
      props.hideAlert();
    }, 3000);
  }

  return (
    <div className="container">
      <div className={className}>
        <strong>{boldText}</strong>{message}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  showAlert  : state.showAlert,
  isPlayerDed: state.isPlayerDed,
});

const mapDispatchToProps = dispatch => ({
  hideAlert: () => {
    dispatch(hideAlert());
  },
});

const AlertContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Alert);

export default AlertContainer;
