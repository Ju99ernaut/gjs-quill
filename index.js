window.quillRte = function (editor, opts = {}) {
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
            // If RTE already exists destroy it
            if (rte && !rte.destroyed) {
                rte.destroy(el);
            }

            const rteToolbar = editor.RichTextEditor.getToolbarEl();
            [].forEach.call(rteToolbar.children, (child) => {
                child.style.display = 'none';
            });

            const w = editor.Canvas.getWindow();

            rte = new w.Quill(el, {
                theme: 'bubble',
                scrollContainer: 'div[data-gjs-type=wrapper]',
                ...options.quillOpts
            });

            // Get quill editor contents
            rte.getContent = function () {
                return `<div class="ql-editor">${rte.root.innerHTML}</div>`;
            }

            // Create deconstructor
            rte.destroy = function (el) {
                for (const [key] of Object.entries(this)) {
                    delete this[key];
                }
                rte.destroyed = true;
            }

            this.focus(el, rte);

            return rte;
        },

        disable(el, rte) {
            rte && rte.blur();
        },

        focus(el, rte) {
            if (rte && rte.hasFocus()) {
                return;
            }
            rte && rte.focus();
        }
    });
};