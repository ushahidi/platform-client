import { configure, addDecorator } from '@storybook/react';
import * as React from "react";
import { withInfo, setDefaults } from '@storybook/addon-info';
import { checkA11y } from '@storybook/addon-a11y';
import './style.css';

const req = require.context('../components/', true, /stories\.js$/)
const LayoutG = (storyFn) => (
  <div className="layout-g">
    { storyFn() }
  </div>
);
function loadStories() {
  req.keys().forEach(req)
}
addDecorator(checkA11y)
addDecorator(LayoutG);
configure(loadStories, module)
