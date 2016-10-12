# Propmods

Propmods is a low-boilerplate way to BEM-annotate your React components. Propmods keeps your JSX clean by turning component props and state into BEM modifiers automatically.

```js
import React from 'react';
import block from 'propmods';

const b = block('button');

class Button extends React.Component {
    render() {
        return <button {...b(this)}>
            <i {...b('icon', ['fa', 'fa-hand-pointer-o'])} />
            {this.props.children}
        </button>;
    }
}


// This React component:
<Button size="L" theme="action" blinking>Push me!</Button>

// Turns into this DOM element:
<button class="button button_size_L button_theme_action button_blinking">
    <i class="button__icon fa fa-hand-pointer-o"></i>
    Push me!
</button>
```

## Usage

This documentation assumes that you are using a modern JavaScript bundler like Webpack or Browserify, NPM package manager, and an ES2015 compiler (e.g. Babel).

Install Propmods with NPM:

```
npm install --save propmods
```

Then, import Propmods and choose a block name:

```js
import block from 'propmods';
const b = block('button');
```

### Blocks

The intended way to use Propmods is to call function `b` with your component as the argument and to merge results into the rendered component's props:

```js
<button {...b(this)} />
```

Propmods will take your component's props and state, and will create appropriate classes. It is smart enough not to pick props which are not valid in CSS, so don't worry that a nested object or a page-long text gets into your class name.

You can also pass any other modifiers as arguments, or point directly to props, state or context if you don't wrap components into classes:

```js
let Button = (props) => {
    return <button {...b({foo: 'bar'}, props)}>{props.children}</button>;
};
```

You can also mix in arbitrary classnames:

```js
<button {...b(this, ['fancy-button', 'fancy-button-large'])} />
```

### Elements

To create BEM elements, pass the element's name as the first argument:

```js
<i {...b('icon', {visible: false})} />
```

### Customization

#### Q: What if I don't want all props to be used as modifiers?

A: You can pick whatever props and state you like.

```js
import _ from 'lodash';

// ...

<button {...b(_.pick(this.props, ['size', 'theme']))} />
```

#### Q: JavaScript uses camel case in prop names, and I don't want camel case in my CSS. What do I do?

A: Propmods will apply a case converting function if you supply one when creating your block.

```js
import _ from 'lodash';
const b = block('button', {
    caseConversion: _.kebabCase
});
```

#### Q: I don't like your BEM conventions. Can I use my own BEM delimiters?

A: Yes, you can configure Propmods to use any delimiters you prefer. These are the defaults:

```js
const b = block('button', {
    elementDelimiter: '__',
    modDelimiter: '_',
    modValueDelimiter: '_'
});
```

## License

MIT.
