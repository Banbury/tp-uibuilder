const tp = require('@tabletop-playground/api');

/** 
 * @callback WidgetCallback
 * @param {WidgetFactory} wf
 * @returns {tp.Widget}
*/

/** 
 * @callback WidgetsCallback
 * @param {WidgetFactory} wf
 * @returns {tp.Widget[]}
*/

/**
 * @typedef {Object} CanvasWidget
 * @property {tp.Widget} w
 * @property {[number, number, number, number]} p
 */

/**
 * @callback CanvasWidgetsCallback
 * @param {WidgetFactory} wf
 * @returns {CanvasWidget[]}
 */

/**
 * Builder for UIs in Tabletop Playground.
 * 
 * Calling the build() function, adds an {@link tp.ScreenUIElement} to the screen or {@link tp.UIElement} a {@link tp.GameObject}.
 */
class UIBuilder {
    /**
     * 
     * @param {tp.GameObject} o If null a {@link tp.ScreenUIElement} is created.
     * @param {tp.Vector} position If no object is given, the only the x and y coordinates are used.
     * @param {WidgetCallback} widgetFn Use the callback to add a widget to the UI.
     */
    constructor(o, position, widgetFn) {
        if (o) {
            this.object = o
            this.ui = new tp.UIElement();
            this.ui.position = position;
        } else {
            this.object = null;
            this.ui = new tp.ScreenUIElement();
            this.ui.positionX = position.x;
            this.ui.positionY = position.y;
        }
        if (widgetFn) {
            this.ui.widget = widgetFn(new WidgetFactory());
        }
    }

    /**
     * Adds the UIElement to the object or the screen.
     * @returns {tp.UIElement | tp.ScreenUIElement}
     */
    build() {
        if (this.object) {
            this.object.addUI(this.ui);
        } else {
            tp.world.addScreenUI(this.ui)
        }

        return this.ui;
    }

    /**
     * Changes the presentation style of the UI.
     * @param {tp.UIPresentationStyle} style 
     * @returns {UIBuilder}
     */
    presentationStyle(style) {
        this.ui.presentationStyle = style;
        return this;
    }

    /**
     * If true, use the natural size of the UI instead of the specified width and height.
     * @param {boolean} value 
     * @returns {UIBuilder}
     */
    useWidgetSize(value) {
        this.ui.useWidgetSize = value;
        return this;
    }

    /**
     * Width in pixels to use for rendering the UI. Only used when useWidgetSize is false.
     * @param {number} value 
     * @returns {UIBuilder}
     */
    width(value) {
        this.ui.width = value;
        return this;
    }

    /**
     * Height in pixels to use for rendering the UI. Only used when useWidgetSize is false.
     * @param {number} value 
     * @returns {UIBuilder}
     */
    height(value) {
        this.ui.height = value;
        return this;
    }

    /**
     * Determine which players see the UI. By default, it will be shown for all players.
     * @param {tp.PlayerPermission} value 
     * @returns {UIBuilder}
     */
    playerPermission(value) {
        this.ui.players = value;
        return this;
    }

    anchor(x, y) {
        this.ui.anchorX = x;
        this.ui.anchorY = y;
        return this;
    }
}

class WidgetFactory {
    /**
     * Creates a {@link tp.Text}
     * @param {string} text 
     * @returns 
     */
    text(text) {
        let w = new tp.Text()
            .setText(text);
        return w;
    }

    /**
     * Creates a {@link tp.TextBox}
     * @param {string} text 
     * @param {(textBox: tp.TextBox, player: tp.Player, text: string) => void} onTextChanged 
     * @returns 
     */
    textbox(text, onTextChanged = null) {
        let w = new tp.TextBox()
            .setText(text);
        if (onTextChanged) {
            w.onTextChanged.add(onTextChanged);
        }
        return w;
    }

    /**
     * Creates a {@link tp.Button}
     * @param {string} text 
     * @param {(button: tp.Button, player: tp.Player) => void} onClicked 
     * @returns 
     */
    button(text, onClicked) {
        let w = new tp.Button()
            .setText(text);
        if (onClicked) {
            w.onClicked.add(onClicked);
        }
        return w;
    }

    /**
     * Creates a {@link tp.ProgressBar}
     * @param {string} text 
     * @returns 
     */
    progressbar(text) {
        let w = new tp.ProgressBar()
            .setText(text);
        return w;
    }

    /**
     * Creates a {@link tp.CheckBox}
     * @param {string} text 
     * @param {boolean} isChecked 
     * @param {(checkBox: tp.CheckBox, player: tp.Player, isChecked: boolean) => void} onCheckStateChanged 
     * @returns 
     */
    checkbox(text, isChecked=false, onCheckStateChanged = null) {
        let w = new tp.CheckBox()
            .setText(text)
            .setIsChecked(isChecked);
        if (onCheckStateChanged) {
            w.onCheckStateChanged.add(onCheckStateChanged);
        }
        return w;
    }

    /**
     * Creates a {@link tp.CheckBox}
     * @param {string[]} options 
     * @param {(selectionBox: tp.SelectionBox, player: tp.Player, index: number, option: string) => void} onSelectionChanged 
     * @returns 
     */
    selectionbox(options, onSelectionChanged = null) {
        let w = new tp.SelectionBox();
        for (let i = 0; i < options.length; i++) {
            w.addOption(options[i]);
        }
        if (onSelectionChanged) {
            w.onSelectionChanged.add(onSelectionChanged);
        }
        return w;
    }

    /**
     * Creates a {@link tp.Slider}
     * @param {number} minValue 
     * @param {number} maxValue 
     * @param {number} stepSize 
     * @param {*} onValueChanged 
     * @returns 
     */
    slider(minValue = 0, maxValue = 1, stepSize = 0.01, onValueChanged = null) {
        let w = new tp.Slider();
        w.setMinValue(minValue);
        w.setMaxValue(maxValue);
        w.setStepSize(stepSize);
        if (onValueChanged) {
            w.onValueChanged.add(onValueChanged);
        }
        return w;
    }

    /**
     * Creates a {@link tp.Border}
     * @param {tp.Color} color 
     * @param {WidgetCallback} widgetFn 
     * @returns 
     */
    border(color, widgetFn) {
        let w = new tp.Border();
        w.setColor(color);
        if (widgetFn) {
            w.setChild(widgetFn(this));
        }
        return w;
    }

    /**
     * Creates a {@link tp.WidgetSwitcher}
     * @param {WidgetsCallback} widgetsFn 
     * @returns 
     */
    widgetswitcher(widgetsFn) {
        let w = new tp.WidgetSwitcher();
        if (widgetsFn) {
            widgetsFn(this).forEach(it => w.addChild(it));
        }
        return w;
    }

    /**
     * Creates a {@link tp.VerticalBox}
     * @param {WidgetsCallback} widgetsFn 
     * @returns 
     */
    verticalbox(widgetsFn) {
        let w = new tp.VerticalBox();
        if (widgetsFn) {
            widgetsFn(this).forEach(it => w.addChild(it));
        }
        return w;
    }

    /**
     * Creates a {@link tp.HorizontalBox}
     * @param {WidgetsCallback} widgetsFn 
     * @returns 
     */
    horizontalbox(widgetsFn) {
        let w = new tp.HorizontalBox();
        if (widgetsFn) {
            widgetsFn(this).forEach(it => w.addChild(it));
        }
        return w;
    }

    /**
     * Creates a {@link tp.Canvas}
     * @param {CanvasWidgetsCallback} widgetsFn 
     * @returns 
     */
    canvas(widgetsFn) {
        let w = new tp.Canvas();
        if (widgetsFn) {
            widgetsFn(this).forEach(it => w.addChild(it.w, it.p[0], it.p[1], it.p[2], it.p[3]));
        }
        return w;
    }

    /**
     * Creates a {@link tp.MultilineTextBox}
     * @param {(textBox: tp.MultilineTextBox, player: tp.Player, text: string) => void} onTextChanged 
     * @returns 
     */
    multilinetextbox(onTextChanged = null) {
        let w = new tp.MultilineTextBox();
        if (onTextChanged) {
            w.onTextChanged.add(onTextChanged);
        }
        return w;
    }

    /**
     * Creates a {@link tp.RichText}
     * @param {string} text 
     * @returns 
     */
    richtext(text) {
        return new tp.RichText()
            .setText(text);
    }

    /**
     * Creates a {@link tp.ContentButton}
     * @param {(button: tp.ContentButton, player: tp.Player) => void} onClicked 
     * @param {WidgetCallback} widgetFn 
     * @returns 
     */
    contenbutton(onClicked, widgetFn) {
        let w = new tp.ContentButton();
        if (onClicked) {
            w.onClicked.add(onClicked);
        }
        if (widgetFn) {
            w.setChild(widgetFn(this));
        }
        return w;
    }

    /**
     * Creates a {@link tp.ImageWidget}
     * @param {string} texture 
     * @param {number} width 
     * @param {number} height 
     * @param {(UImage: tp.ImageWidget, filename: string, packageId: string) => void} onImageLoaded 
     * @returns 
     */
    imagewidget(texture, width, height, onImageLoaded=null) {
        let w = new tp.ImageWidget()
            .setImage(texture)
            .setImageSize(width, height);
        if (onImageLoaded) {
            w.onImageLoaded.add(onImageLoaded);
        }
        return w;
    }

    /**
     * Creates a {@link tp.ImageButton}
     * @param {string} texture 
     * @param {number} width 
     * @param {number} height 
     * @param {(button: tp.ImageButton, player: tp.Player) => void} onClicked 
     * @param {(UImage: tp.ImageButton, filename: string, packageId: string) => void} onImageLoaded 
     * @returns 
     */
    imagebutton(texture, width, height, onClicked, onImageLoaded=null) {
        let w = new tp.ImageButton()
            .setImage(texture)
            .setImageSize(width, height);
        if (onClicked) {
            w.onClicked.add(onClicked);
        }
        if (onImageLoaded) {
            w.onImageLoaded.add(onImageLoaded);
        }
        return w;
    }

    /**
     * Creates a {@link tp.LayoutBox}
     * @param {WidgetCallback} widgetFn 
     * @returns 
     */
    layoutbox(widgetFn) {
        let w = new tp.LayoutBox();
        if (widgetFn) {
            w.setChild(widgetFn(this));
        }
        return w;
    }

    /**
     * Creates a frame with a colored border
     * @param {tp.Color} frameColor 
     * @param {tp.Color} backgroundColor 
     * @param {WidgetCallback} widgetFn 
     * @returns 
     */
    frame(frameColor, backgroundColor, widgetFn) {
        let w = new Border();
        w.setColor(backgroundColor);
        let layout1 = new tp.LayoutBox().setPadding(8, 8, 8, 8);
        let frameBorder = new tp.Border().setColor(frameColor);
        layout1.setChild(frameBorder);
        let layout2 = new tp.LayoutBox().setPadding(1, 1, 1, 1);
        frameBorder.setChild(layout2);
        let innerBorder = new tp.Border().setColor(backgroundColor);
        layout2.setChild(innerBorder);
        w.setChild(layout1);

        if (widgetFn) {
            innerBorder.setChild(widgetFn(this));
        }
        return w;
    }
}

module.exports = { UIBuilder, WidgetFactory };