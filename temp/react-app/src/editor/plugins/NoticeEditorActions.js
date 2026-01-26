import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class NoticeEditorActions extends Plugin {
  static get pluginName() {
    return 'NoticeEditorActions';
  }

  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('noticeTemplate', locale => {
      const view = new ButtonView(locale);
      view.set({
        label: '템플릿',
        withText: true,
        tooltip: true
      });
      view.on('execute', () => {
        editor.fire('openTemplateManager');
      });
      return view;
    });

    editor.ui.componentFactory.add('noticeSignature', locale => {
      const view = new ButtonView(locale);
      view.set({
        label: '서명',
        withText: true,
        tooltip: true
      });
      view.on('execute', () => {
        editor.fire('openSignatureManager');
      });
      return view;
    });
  }
}
