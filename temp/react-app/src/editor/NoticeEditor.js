import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';
import List from '@ckeditor/ckeditor5-list/src/list';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import BalloonToolbar from '@ckeditor/ckeditor5-ui/src/toolbar/balloon/balloontoolbar';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import FontSizeInput from './plugins/FontSizeInput';
import TableCellAlign from './plugins/TableCellAlign';
import NoticeEditorActions from './plugins/NoticeEditorActions';

import '@ckeditor/ckeditor5-theme-lark/dist/index.css';

class NoticeEditor extends ClassicEditor {}

NoticeEditor.builtinPlugins = [
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Alignment,
  Image,
  ImageToolbar,
  ImageStyle,
  ImageCaption,
  FontFamily,
  FontSize,
  FontColor,
  FontBackgroundColor,
  FontSizeInput,
  List,
  Indent,
  Link,
  BlockQuote,
  BalloonToolbar,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  TableCellAlign,
  NoticeEditorActions,
  PasteFromOffice
];

NoticeEditor.defaultConfig = {
  toolbar: [
    'noticeTemplate', 'noticeSignature', '|',
    'heading', '|',
    'fontSizeInput', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
    'bold', 'italic', 'underline', 'strikethrough', '|',
    'alignment', '|',
    'numberedList', 'bulletedList', '|',
    'outdent', 'indent', '|',
    'link', 'blockQuote', 'insertTable', 'tableCellAlign', '|',
    'undo', 'redo'
  ],
  fontSize: {
    options: [
      '8pt', '9pt', '10pt', '11pt', '12pt', '14pt', '16pt',
      '18pt', '20pt', '22pt', '24pt', '26pt', '28pt', '30pt',
      '32pt', '36pt', '40pt', '48pt', '56pt', '64pt', '72pt'
    ],
    supportAllValues: true
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellAlign',
      'tableProperties',
      'tableCellProperties'
    ]
  },
  balloonToolbar: [
    'bold',
    'italic',
    'underline',
    'fontSizeInput',
    'fontColor',
    'fontBackgroundColor',
    'link',
    'tableCellAlign'
  ],
  language: 'ko',
  licenseKey: 'GPL'
};

export default NoticeEditor;
