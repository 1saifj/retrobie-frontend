// thx SO https://stackoverflow.com/questions/44625868/es6-babel-class-constructor-cannot-be-invoked-without-new
import BubbleTheme, {BubbleTooltip} from 'quilljs/themes/bubble'
import icons from 'quilljs/ui/icons'

class NewTheme extends BubbleTheme {
    extendToolbar(toolbar) {
        this.tooltip = new LoopTooltip(this.quill, this.options.bounds)
        this.tooltip.root.appendChild(toolbar.container)

        // you could override Quill's icons here with yours if you want
        this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), icons)
        this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), icons)
    }
}

class NewThemeTooltip extends BubbleTooltip {
}

NewThemeTooltip.TEMPLATE = [
    '<a class="ql-close"></a>',
    '<div class="ql-tooltip-editor">',
    '<input type="text" data-formula="e=mc^2" data-link="https://yoururl.com" data-video="Embed URL">',
    '</div>',
    '<span class="ql-tooltip-arrow"></span>'
].join('')

export {NewThemeTooltip, NewTheme as default}
