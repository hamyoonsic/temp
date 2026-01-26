import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
import { createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

const ALIGNMENTS = [
  { label: 'TL', horizontal: 'left', vertical: 'top' },
  { label: 'TC', horizontal: 'center', vertical: 'top' },
  { label: 'TR', horizontal: 'right', vertical: 'top' },
  { label: 'ML', horizontal: 'left', vertical: 'middle' },
  { label: 'MC', horizontal: 'center', vertical: 'middle' },
  { label: 'MR', horizontal: 'right', vertical: 'middle' },
  { label: 'BL', horizontal: 'left', vertical: 'bottom' },
  { label: 'BC', horizontal: 'center', vertical: 'bottom' },
  { label: 'BR', horizontal: 'right', vertical: 'bottom' }
];

const GRID_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
  <rect x="2" y="2" width="4" height="4" rx="0.6"/>
  <rect x="8" y="2" width="4" height="4" rx="0.6"/>
  <rect x="14" y="2" width="4" height="4" rx="0.6"/>
  <rect x="2" y="8" width="4" height="4" rx="0.6"/>
  <rect x="8" y="8" width="4" height="4" rx="0.6"/>
  <rect x="14" y="8" width="4" height="4" rx="0.6"/>
  <rect x="2" y="14" width="4" height="4" rx="0.6"/>
  <rect x="8" y="14" width="4" height="4" rx="0.6"/>
  <rect x="14" y="14" width="4" height="4" rx="0.6"/>
</svg>`;

export default class TableCellAlign extends Plugin {
  static get pluginName() {
    return 'TableCellAlign';
  }

  init() {
    const editor = this.editor;
    const getCommand = () => editor.commands.get('tableCellProperties');

    editor.ui.componentFactory.add('tableCellAlign', locale => {
      const dropdownView = createDropdown(locale);
      dropdownView.buttonView.set({
        label: 'Cell align',
        icon: GRID_ICON,
        withText: false,
        tooltip: true
      });

      const command = getCommand();
      if (command) {
        dropdownView.bind('isEnabled').to(command, 'isEnabled');
      } else {
        dropdownView.isEnabled = true;
      }

      const gridView = new View(locale);
      const gridChildren = new ViewCollection();

      ALIGNMENTS.forEach(({ label, horizontal, vertical }) => {
        const button = new ButtonView(locale);
        button.set({
          label,
          withText: true,
          tooltip: true
        });
        button.on('execute', () => {
          const cellCommand = getCommand();
          if (!cellCommand) {
            return;
          }
          if (!cellCommand.isEnabled) {
            return;
          }
          editor.execute('tableCellProperties', {
            horizontalAlignment: horizontal,
            verticalAlignment: vertical
          });
          editor.editing.view.focus();
          dropdownView.isOpen = false;
        });
        gridChildren.add(button);
      });

      gridView.setTemplate({
        tag: 'div',
        attributes: {
          class: [ 'ck-table-cell-align-grid' ]
        },
        children: gridChildren
      });

      dropdownView.panelView.children.add(gridView);

      return dropdownView;
    });
  }
}
