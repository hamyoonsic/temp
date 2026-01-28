import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';

const MIN_PT = 8;
const MAX_PT = 72;
const STEP_PT = 1;
const SELECTION_MARKER = 'fontSizeInputSelection';

export default class FontSizeInput extends Plugin {
  static get pluginName() {
    return 'FontSizeInput';
  }

  init() {
    const editor = this.editor;
    const command = editor.commands.get('fontSize');
    let lastSelection = null;

    editor.conversion.for('editingDowncast').markerToHighlight({
      model: SELECTION_MARKER,
      view: {
        classes: 'ck-font-size-selection'
      }
    });

    editor.editing.view.document.on('focus', () => {
      clearSelectionMarker();
    });

    const storeSelection = () => {
      const selection = editor.model.document.selection;
      const range = selection.getFirstRange();
      lastSelection = range ? range.clone() : null;
    };

    const clearSelectionMarker = () => {
      if (editor.model.markers.has(SELECTION_MARKER)) {
        editor.model.change(writer => {
          writer.removeMarker(SELECTION_MARKER);
        });
      }
    };

    const applySelectionMarker = () => {
      clearSelectionMarker();
      if (!lastSelection || lastSelection.isCollapsed) {
        return;
      }
      editor.model.change(writer => {
        writer.addMarker(SELECTION_MARKER, {
          range: lastSelection,
          usingOperation: false,
          affectsData: false
        });
      });
    };

    editor.ui.componentFactory.add('fontSizeInput', locale => {
      const inputView = new InputTextView(locale);
      const syncFromSelection = () => {
        const element = inputView.element;
        if (!element) return;
        const value = command ? command.value : null;
        if (value) {
          const match = String(value).match(/(\d+)\s*pt/i);
          if (match) {
            element.value = match[1];
            return;
          }
        }
        try {
          const viewSelection = editor.editing.view.document.selection;
          const viewPosition = viewSelection.getFirstPosition();
          if (!viewPosition) {
            element.value = '';
            return;
          }
          const viewParent = viewPosition.parent;
          const domParent = editor.editing.view.domConverter.mapViewToDom(viewParent);
          if (!domParent || domParent.nodeType !== Node.ELEMENT_NODE) {
            element.value = '';
            return;
          }
          const fontSizePx = window.getComputedStyle(domParent).fontSize;
          const pxValue = parseFloat(fontSizePx);
          if (!Number.isNaN(pxValue)) {
            const ptValue = Math.round((pxValue * 72) / 96);
            element.value = String(Math.max(MIN_PT, Math.min(MAX_PT, ptValue)));
          }
        } catch (error) {
          element.value = '';
        }
      };
      inputView.set({
        placeholder: 'pt'
      });
      inputView.extendTemplate({
        attributes: {
          class: [ 'ck-font-size-input' ]
        }
      });

      inputView.bind('isEnabled').to(command);

      inputView.on('render', () => {
        const element = inputView.element;
        if (!element) return;
        element.type = 'number';
        element.min = String(MIN_PT);
        element.max = String(MAX_PT);
        element.step = String(STEP_PT);
        element.inputMode = 'numeric';
        element.addEventListener('mousedown', storeSelection);
        element.addEventListener('focus', applySelectionMarker);
        element.addEventListener('blur', clearSelectionMarker);
        const applyValue = () => {
          const nextValue = parseInt(element.value, 10);
          if (Number.isNaN(nextValue)) {
            return;
          }
          const clamped = Math.max(MIN_PT, Math.min(MAX_PT, nextValue));
          if (clamped !== nextValue) {
            element.value = String(clamped);
          }
          if (lastSelection) {
            editor.model.change(writer => {
              writer.setSelection(lastSelection);
            });
          }
          clearSelectionMarker();
          editor.execute('fontSize', { value: `${clamped}pt` });
          editor.editing.view.focus();
        };
        element.addEventListener('change', applyValue);
        element.addEventListener('blur', applyValue);
        element.addEventListener('keydown', event => {
          if (event.key === 'Enter') {
            event.preventDefault();
            applyValue();
          }
        });
        syncFromSelection();
      });

      if (command) {
        command.on('change:value', () => {
          syncFromSelection();
        });
      }

      editor.editing.view.document.selection.on('change:range', () => {
        syncFromSelection();
      });

      return inputView;
    });

    const toolbar = editor.ui.view.toolbar;
    toolbar.on('render', () => {
      const toolbarElement = toolbar.element;
      if (!toolbarElement) return;
      toolbarElement.addEventListener('mousedown', () => {
        storeSelection();
        applySelectionMarker();
      });
    });
  }
}
