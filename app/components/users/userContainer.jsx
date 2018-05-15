import React from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import connectWithStore from "../../react-transition/connectWithStore";
// import * as UshLogoActions from "./ush-logo.actions";
// import { getFormsFromState } from "./ush-logo.reducer";

const UserContainer = props => (
  <div>
    Hello
  </div>
);

// const mapStateToProps = state => ({
//   forms: getFormsFromState(state)
// });

// function mapDispatchToProps(dispatch) {
//   return {
//     UshLogoActions: bindActionCreators(UshLogoActions, dispatch)
//   };
// }

// UserContainer.propTypes = {
//   foo: PropTypes.number.isRequired,
//   baz: PropTypes.number.isRequired,
//   forms: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired
//     })
//   ).isRequired
// };

export { UserContainer as PlainUserContainer };

// export default connectWithStore(
//   UserContainer,
//   mapStateToProps,
//   mapDispatchToProps
// );
