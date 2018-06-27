import { configure, addDecorator, setAddon } from '@storybook/react';
import * as React from "react";
import { checkA11y } from '@storybook/addon-a11y';
import { setDefaults, withInfo } from '@storybook/addon-info';

import './style.css';

const req = require.context('../components/', true, /stories\.js$/)
const layoutG = (storyFn) => (
  <div className="layout-g">
    { storyFn() }
  </div>
);

const loadStories = () => {
  req.keys().forEach(req)
}

// info addon
setDefaults({
  header: false, // Toggles display of header with component name and description
});

addDecorator((story, context) => withInfo(context.kind)(story)(context));
// accessibility addon
addDecorator(checkA11y);
// setting Layout-g to the story
addDecorator(layoutG);
// loading stories
configure(loadStories, module)
