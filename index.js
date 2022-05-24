window.quillRte = (editor, opts = {}) => {
    const options = {
        ...{
            // default options
            // Quill's options
            quillOpts: {},
        },
        ...opts
    };

    editor.setCustomRte({
        enable(el, rte) {
            el.contentEditable = true;

            let rteToolbar = editor.RichTextEditor.getToolbarEl();
            [].forEach.call(rteToolbar.children, (child) => {
                child.style.display = 'none';
            });

            const w = editor.Canvas.getWindow();

            rte = new w.Quill(el, {
                theme: 'bubble',
                ...options.quillOpts
            });

            rte.getContent = () => {
                const quillC = el.querySelector('.ql-editor p');
                return quillC ? quillC.innerHTML : el.innerHTML;
            }

            this.focus(el, rte);

            return rte;
        },

        disable(el, rte) {
            el.contentEditable = false;
            el.classList.remove('ql-container', 'ql-bubble');
            rte && rte.blur();
            rte = null;
        },

        focus(el, rte) {
            if (rte && rte.hasFocus()) {
                return;
            }
            el.contentEditable = true;
            rte && rte.focus();
        }
    });
};