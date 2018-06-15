import React from "react";
import PropTypes from "prop-types";
import angular from "angular";

// Note: Link objects and innerRef are not implemented.
// If you need them, you'll have to implement them yourself
// Talk to Carolyn about starter code

class Link extends React.Component {
    static getDerivedStateFromProps() {
        const injector = angular.element(document).injector();
        const state = injector.get("$state");
        return {
            stateProvider: state
        };
    }

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            stateProvider: undefined
        };
    }

    handleClick() {
        console.log(this.props);
        return this.props.replace
            ? this.state.stateProvider.go(
                  this.props.to,
                  {},
                  { location: this.props.replace }
              )
            : this.state.stateProvider.go(this.props.to);
    }
/* eslint-disable */
  render() {
    return (
      <div>
        <a
          onClick={this.handleClick}
          href="#"
          title={this.props.title}
          id={this.props.id}
          className={this.props.className}
        >
          {this.props.children}
        </a>
      </div>
    );
  }
}
/* eslint-enable */

Link.defaultProps = {
    replace: false,
    title: "",
    id: "",
    className: ""
};

Link.propTypes = {
    to: PropTypes.string.isRequired,
    replace: PropTypes.bool,
    title: PropTypes.string,
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

export default Link;
