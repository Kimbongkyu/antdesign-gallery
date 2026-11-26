// antd 6.7.2 공식 컴포넌트 문서 slug (공식 그룹 순서). scripts/fetch-api.ts 와 앱이 함께 쓴다.
export const ANTD_TAG = '6.7.2';

export const SLUGS: string[] = [
  // General
  'button', 'float-button', 'icon', 'typography',
  // Layout
  'divider', 'flex', 'grid', 'layout', 'masonry', 'space', 'splitter',
  // Navigation
  'anchor', 'breadcrumb', 'dropdown', 'menu', 'pagination', 'steps', 'tabs',
  // Data Entry
  'auto-complete', 'cascader', 'checkbox', 'color-picker', 'date-picker', 'form', 'input',
  'input-number', 'mentions', 'radio', 'rate', 'select', 'slider', 'switch', 'time-picker',
  'transfer', 'tree-select', 'upload',
  // Data Display
  'avatar', 'badge', 'calendar', 'card', 'carousel', 'collapse', 'descriptions', 'empty',
  'image', 'list', 'listy', 'popover', 'qr-code', 'segmented', 'statistic', 'table', 'tag',
  'timeline', 'tooltip', 'tour', 'tree',
  // Feedback
  'alert', 'drawer', 'message', 'modal', 'notification', 'popconfirm', 'progress', 'result',
  'skeleton', 'spin', 'watermark',
  // Other
  'affix', 'app', 'border-beam', 'config-provider', 'util',
];

// 저장소 폴더 이름이 slug와 다른 것
export const SOURCE_DIR: Record<string, string> = {util: '_util'};
