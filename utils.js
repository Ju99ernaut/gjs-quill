window.registerClipboard = (editor) => {
    editor.on('load', () => {
        const w = editor.Canvas.getWindow();

        const Clipboard = w.Quill.import('modules/clipboard');
        const TextBlot = w.Quill.import('blots/text');
        const Delta = w.Quill.import('delta');

        function escapeText(text) {
            return text.replace(/[&<>"']/g, s => {
                // https://lodash.com/docs#escape
                const entityMap = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                };
                return entityMap[s];
            });
        }

        const deleteRange = ({ quill, range }) => {
            const lines = quill.getLines(range);
            let formats = {};
            if (lines.length > 1) {
                const firstFormats = lines[0].formats();
                const lastFormats = lines[lines.length - 1].formats();
                formats = Delta.AttributeMap.diff(lastFormats, firstFormats) | {};
            }
            quill.deleteText(range, w.Quill.sources.USER);
            if (Object.keys(formats).length > 0) {
                quill.formatLine(range.index, 1, formats, w.Quill.sources.USER);
            }
            quill.setSelection(range.index, w.Quill.sources.SILENT);
        }

        function convertHTML(blot, index, length, isRoot = false) {
            if (typeof blot.html === 'function') {
                return blot.html(index, length);
            }
            if (blot instanceof TextBlot) {
                return escapeText(blot.value().slice(index, index + length));
            }
            if (blot.children) {
                // TODO fix API
                if (blot.statics.blotName === 'list-container') {
                    const items = [];
                    blot.children.forEachAt(index, length, (child, offset, childLength) => {
                        const formats = child.formats();
                        items.push({
                            child,
                            offset,
                            length: childLength,
                            indent: formats.indent || 0,
                            type: formats.list,
                        });
                    });
                    return convertListHTML(items, -1, []);
                }
                const parts = [];
                blot.children.forEachAt(index, length, (child, offset, childLength) => {
                    parts.push(convertHTML(child, offset, childLength));
                });
                if (isRoot || blot.statics.blotName === 'list') {
                    return parts.join('');
                }
                const { outerHTML, innerHTML } = blot.domNode;
                const [start, end] = outerHTML.split(`>${innerHTML}<`);
                // TODO cleanup
                if (start === '<table') {
                    return `<table style="border: 1px solid #000;">${parts.join('')}<${end}`;
                }
                return `${start}>${parts.join('')}<${end}`;
            }
            return blot.domNode.outerHTML;
        }

        class GrapesClipboard extends Clipboard {
            constructor(quill, options) {
                super(quill, options);
                this.quill.root.addEventListener('copy', e => this.onCaptureCopy(e, false));
                this.quill.root.addEventListener('cut', e => this.onCaptureCopy(e, true));
                this.quill.root.removeEventListener('paste', this.onPaste.bind(this));
                this.quill.root.addEventListener('paste', this.onCapturePaste.bind(this));
            }

            onCaptureCopy(e, isCut = false) {
                if (e.defaultPrevented) return;
                e.preventDefault();
                const [range] = this.quill.selection.getRange();
                if (range == null) return;
                const { html, text } = this.onCopy(range);
                e.clipboardData.setData('text/plain', text);
                e.clipboardData.setData('text/html', html);
                if (isCut) {
                    deleteRange({ range, quill: this.quill });
                }
            }

            onCapturePaste(e) {
                if (e.defaultPrevented || !this.quill.isEnabled()) return;
                e.preventDefault();
                const range = this.quill.getSelection(true);
                if (range == null) return;
                const html = e.clipboardData.getData('text/html');
                const text = e.clipboardData.getData('text/plain');
                const files = Array.from(e.clipboardData.files || []);
                if (!html && files.length > 0) {
                    this.quill.uploader.upload(range, files);
                    return;
                }
                if (html && files.length > 0) {
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    if (
                        doc.body.childElementCount === 1 &&
                        doc.body.firstElementChild.tagName === 'IMG'
                    ) {
                        this.quill.uploader.upload(range, files);
                        return;
                    }
                }
                this.onGjsPaste(range, { html, text });
            }

            onCopy(range) {
                const text = this.quill.getText(range);
                const html = this.getHTML(range.index, range.length);
                return { html, text };
            }

            getHTML(index, length) {
                const [line, lineOffset] = this.quill.editor.scroll.line(index);
                if (line.length() >= lineOffset + length) {
                    return convertHTML(line, lineOffset, length, true);
                }
                return convertHTML(this.quill.editor.scroll, lineOffset, length, true);
            }

            onGjsPaste(range, { text, html }) {
                // const formats = this.quill.getFormat(range.index);
                const pastedDelta = this.convert(html);// { text, html }, formats);
                //editor.log('onPaste', pastedDelta, { text, html });
                const delta = new Delta()
                    .retain(range.index)
                    .delete(range.length)
                    .concat(pastedDelta);
                this.quill.updateContents(delta, w.Quill.sources.USER);
                // range.length contributes to delta.length()
                this.quill.setSelection(
                    delta.length() - range.length,
                    w.Quill.sources.SILENT,
                );
                this.quill.scrollIntoView();
            }
        }

        w.Quill.register('modules/clipboard', GrapesClipboard, true);
    });
}