import React from "react";
import PropTypes from "prop-types";

class Link extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const injector = angular.element(document).injector();
    const state = injector.get("$state");
    return {
      stateProvider: state
    };
    // not sure if this is working here
    if (nextProps.to !== prevState.to) {
      return {
        to: this.constructedTo(nextProps.to)
      };
    }
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      stateProvider: undefined,
      to: this.constructedTo(this.props.to)
    };
  }

  constructedTo(toFromProps) {
    // Strings need be defined before concatenating
    const to =
      typeof toFromProps === "string"
        ? toFromProps
        : toFromProps.pathname + toFromProps.search + toFromProps.hash;
    return to;
  }

  handleClick(event) {
    event.preventDefault();
    this.props.replace
      ? this.state.stateProvider.go(
          this.state.to,
          {},
          { location: this.props.replace }
        )
      : this.state.stateProvider.go(this.state.to);
  }

  render() {
    return (
      <div>
        <a
          href="#"
          onClick={this.handleClick}
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

Link.defaultProps = {
  replace: false,
  title: '',
  id: '',
  className: ''
};

Link.propTypes = {
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.objectOf(PropTypes.string)
  ]).isRequired,
  replace: PropTypes.bool,
  title: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Link;
