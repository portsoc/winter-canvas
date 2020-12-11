# A Winter Canvas
## Bob Ross Winter Canvas with a Happy Little Cabin

This repo contains several interesting pieces of code.

1. The first is our Christmas content for 2020, a tribute
to Bob Ross.  We've drawn a picture of a happy little cabin
in the woods, surrounded by a few trees.
This is an example of basic use of HTML's `canvas` element.

2. We've made it snow.  Snow falls freely through any transparent
pixels in the image, and sticks to pixels that are non-transparent.

   Try it here: https://portsoc.github.io/winter-canvas/

3. We've bundled up our snow code into a _Web Component_, so anywhere
that a `canvas` _could_ be used, a `winter-canvas` can be used in
its place.  The output from these two versions looks the same, but their
implementations are significantly different. We use it here:
https://portsoc.github.io/winter-canvas/example/



## Using the `<winter-canvas>` web component

`<winter-canvas>` is a reusable custom HTML element, which acts as a `<canvas>` that automatically
adds animated falling snow to the image.

To use the component, import the `winter-canvas` library:

```html
<script src="//portsoc.github.io/winter-canvas/component/winter-canvas.js" type="module"></script>
```

Then include the `<winter-canvas>` element it in your page:

```html
<winter-canvas width="800" height="800"></winter-canvas>
```

Then in Javascript, draw anything you want on the canvas; finally, set the `snowing` attribute on the canvas to `true` and it will start snowing.

```javascript
const canvas = document.querySelector('winter-canvas');
const c = canvas.getContext('2d');
c.fillStyle='#';
c.fillRect(100,600,600,200);
canvas.snowing = true;
```

This minimal example can be seen running here.

**Warning:** anything drawn after snowing has started will be ignored.


### Attributes

- `width` and `height`: same as `<canvas>`
- `flake-count`: how many flakes should be generated
- `max-flake-size`: makes snow flakes up to this many pixels
- `max-sx`: maximum horizontal speed in pixels per animation frame (60fps normally)
- `min-sy` and `max-sy`: minimum and maximum vertical snowflake speed
- `snowing`: set this in Javascript to `true` for the canvas to start snowing over the content