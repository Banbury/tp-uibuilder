# UI Builder for Tabletop Playground
This library is meant to simplify creating UIs in Tabletop Playground. It uses the Builder Pattern to allow writing UI code in a treelike fashion, that uses less code and is easier to read.

## Installation

### NPM
The library can be installed as a Node dependency from Github.
Execute the following command from the `Scripts` in the folder of your mod.

```bash
npm i https://github.com/Banbury/tp-uibuilder
```

### Manual
You can also just download and copy the file `uibuilder.js` directly into the `Scripts` folder.

## Usage
First the library needs to be imported with `require`.

```Javascript
const UIBuilder = require('uibuilder');
```

Now a new UIBuilder object can be created.
```Javascript
const ui = new UIBuilder(tp.refObject, new tp.Vector(0, 0, 4), ui => ...
).build();
```
The first parameter is the `GameObject` that the UI will be attached to. If the first parameter is `null` the UI is attached to the screen. The second parameter is the position of the UI relative to the `GameObject`. For Screen UIs only the x and y coordinates are used and the values have a range from 0 to 1.
The `build()` method creates the UI and attaches it. It will returen the UIElement ord ScreenUIElement. This alway has to be called last.

### Adding Widgets
Widgets are added to the UI and all widgets that can contain other widgets (like VerticalBox) with an arrow function, that returns either a single widget or an array of widgets, depending on the parent element.
Since UIElement and ScreenUIElement only can hold a single widget, UIBuilder expects an arrow function, that returns a single widget.

```Javascript
const ui = new UIBuilder(tp.refObject, new tp.Vector(0, 0, 4), ui =>
    ui.button("Click me!", () => tp.JSConsole.log("Hello World!"))
).build();
```
This will add a button to the UI with the text "Click me!" and an onClick event handler.
The `ui` parameter of the arrow function is a factory class, that allows constructing widgets with less code. But it is also possible to use the standard constructors from the Tabletop Playground API.

Widgets that can contain more than one widget receive an array of widgets.

```Javascript
    ...
    ui.horizontalbox(() => [
        ui.checkbox("one", true),
        ui.checkbox("two", false)
    ])
    ...
```
This creates a `HorizontalBox` with two `CheckBox`es.

Since the `ui` helper functions return the widget object, the properties of the widget can be changed using the fluent methods from the Tabletop Playground API.

```Javascript
    ...
    ui.text("Hello World!").setItalic(true)
    ...
```

### Changing Properties of the UI
UIBuilder has helper methods to change the properties of the UI. These functions have to be called before calling `build()`.

```Javascript
const ui = new UIBuilder(tp.refObject, new tp.Vector(0, 0, 4), ui => ...
)
.presentationStyle(tp.UIPresentationStyle.ViewAligned)
.build();
```

Changing properties after calling `build()` requires calling `GameObject.updateUI()` or `GameWorld.updateUI()` as usual.

> [!NOTE]
> The file `testui.js` contains a full example for using UI Builder.