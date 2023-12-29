/**
 * @typedef {import('./uibuilder').UIBuilder} UIBuilder
 * @typedef {import('./uibuilder').WidgetCallback} WidgetCallback
 * 
 */

const tp = require('@tabletop-playground/api');
const { UIBuilder, WidgetFactory } = require('./uibuilder');

class MessageBox {
    constructor() {
        this.wf = new WidgetFactory();
    }

    create(title, message, buttons) {
        this.ui = new UIBuilder(null, new tp.Vector(0.5, 0.5, 0), wf => 
            wf.frame(new tp.Color(1, 1, 1), new tp.Color(0.01, 0.01, 0.01), wf =>
                wf.layoutbox(wf =>
                    wf.verticalbox(wf => [
                        wf.layoutbox(wf => 
                            wf.verticalbox(wf => [
                                wf.text(title).setBold(true),
                                wf.text(message).setAutoWrap(true),
                            ]).setChildDistance(4)
                        ).setMinimumHeight(150),
                        buttons
                    ])
                ).setPadding(10, 10, 10, 10)
            )   
        )
        .useWidgetSize(false)
        .width(320).height(240)
        .anchor(0.5, 0.5)
        .build();
    }

    showMessagBox(title, message) {
        let buttons = this.wf.horizontalbox(wf => [
            wf.button("Okay", (button, player) => tp.world.removeScreenUIElement(this.ui))
        ]).setVerticalAlignment(tp.VerticalAlignment.Center);
        this.create(title, message, buttons);
    }
}

module.exports = MessageBox;