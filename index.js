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
            // If RTE already exists destroy it
            if (rte && !rte.destroyed) {
                rte.destroy(el);
            }

            el.contentEditable = true;

            const rteToolbar = editor.RichTextEditor.getToolbarEl();
            [].forEach.call(rteToolbar.children, (child) => {
                child.style.display = 'none';
            });

            const w = editor.Canvas.getWindow();

            rte = new w.Quill(el, {
                theme: 'bubble',
                ...options.quillOpts
            });

            // Get quill editor contents
            rte.getContent = () => rte.root.innerHTML;

            // Create deconstructor
            rte.destroy = function (el) {
                el.classList.remove('ql-container', 'ql-bubble');
                for (const [key] of Object.entries(this)) {
                    delete this[key];
                }
                rte.destroyed = true;
            }

            // Fix selection
            rte.on('selection-change', (range, oldRange, source) => {
                const tip = rte.container.querySelector('.ql-tooltip');
                if (range && range.length === 0) {
                    tip && tip.classList.add('ql-hidden');
                }
            });

            // For debugging only
            console.log('For debugging: ', rte);

            this.focus(el, rte);

            return rte;
        },

        disable(el, rte) {
            el.contentEditable = false;
            rte && rte.blur();
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