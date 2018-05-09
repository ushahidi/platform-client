import React from 'react';
import PropTypes from 'prop-types';

const TestRouteContainer = props => {
    console.log(props);
    return (
        <div><main role="main">
            <h1>Hello from react</h1>
            { props.id }
            <a onClick={ () =>  { props.state.go('posts.data') } }>Click me</a>
            <a href="/views/map">Click me</a>
        </main></div>
    );
}

// TestRouteContainer.propTypes = {
//     state: PropTypes.any.required,
//     id: PropTypes.string
// };

export default TestRouteContainer;
