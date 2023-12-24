/**
 * @typedef {import('./uibuilder').UIBuilder} UIBuilder
 * @typedef {import('./uibuilder').WidgetCallback} WidgetCallback
 * 
 */

const tp = require('@tabletop-playground/api');
const UIBuilder = require('./uibuilder');

const ui = new UIBuilder(tp.refObject, new tp.Vector(0, 0, 4), ui =>
    ui.border(new tp.Color(0.3, 0.3, 0.3, 0), ui =>
        ui.verticalbox(ui => [
            ui.text("Hello World!").setItalic(true),
            ui.button("Click me!", () => tp.JSConsole.log("Hello World!")).setTextColor(new tp.Color(1, 0, 0)),
            ui.horizontalbox(() => [
                ui.checkbox("one", true),
                ui.checkbox("two", false)
            ])
        ])
    )    
)
.presentationStyle(tp.UIPresentationStyle.ViewAligned)
.build();
