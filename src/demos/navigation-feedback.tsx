import {useState} from 'react';
import {
  Alert,
  Anchor,
  App,
  Breadcrumb,
  Button,
  Drawer,
  Dropdown,
  Menu,
  Modal,
  Pagination,
  Popconfirm,
  Progress,
  Result,
  Skeleton,
  Space,
  Spin,
  Steps,
  Tabs,
  Watermark,
  type MenuProps,
} from 'antd';
import {AppstoreOutlined, DownOutlined, HomeOutlined, MailOutlined, SettingOutlined} from '@ant-design/icons';
import type {Demo} from '../demoTypes';
import {b, s} from '../demoTypes';

const SIZES3 = ['small', 'medium', 'large'];
const STATUS4 = ['success', 'info', 'warning', 'error'];

const menuItems: MenuProps['items'] = [
  {key: 'mail', icon: <MailOutlined />, label: '메일'},
  {key: 'app', icon: <AppstoreOutlined />, label: '앱'},
  {
    key: 'setting',
    icon: <SettingOutlined />,
    label: '설정',
    children: [
      {key: 'profile', label: '내 정보'},
      {key: 'security', label: '보안'},
    ],
  },
];

const dropdownItems: MenuProps['items'] = [
  {key: 'edit', label: '수정'},
  {key: 'copy', label: '복사'},
  {type: 'divider'},
  {key: 'delete', label: '삭제', danger: true},
];

export const NAVIGATION_FEEDBACK: Record<string, Demo> = {
  /* ---------- 내비게이션 ---------- */
  Anchor: {
    tag: 'Anchor',
    controls: [{kind: 'select', key: 'direction', label: '방향(direction)', options: ['vertical', 'horizontal'], default: 'vertical'}],
    note: '이 갤러리는 주소(#)로 화면을 바꾸기 때문에 미리보기에서는 링크 이동을 막았어요.',
    code: (v) =>
      `import {Anchor} from 'antd';\n\n<Anchor${v.direction !== 'vertical' ? ` direction="${v.direction}"` : ''}\n  items={[\n    {key: 'intro', href: '#intro', title: '소개'},\n    {key: 'usage', href: '#usage', title: '사용법'},\n    {key: 'api', href: '#api', title: 'API'},\n  ]}\n/>`,
    Preview: ({v}) => (
      <Anchor
        affix={false}
        direction={s(v.direction) as 'vertical'}
        onClick={(e) => e.preventDefault()}
        items={[
          {key: 'intro', href: '#gx-intro', title: '소개'},
          {key: 'usage', href: '#gx-usage', title: '사용법'},
          {key: 'api', href: '#gx-api', title: 'API'},
        ]}
      />
    ),
  },
  Breadcrumb: {
    tag: 'Breadcrumb',
    controls: [{kind: 'text', key: 'separator', label: '구분자(separator)', default: '/'}],
    code: (v) =>
      `import {Breadcrumb} from 'antd';\n\n<Breadcrumb${v.separator !== '/' ? ` separator="${v.separator}"` : ''}\n  items={[\n    {href: '/', title: <HomeOutlined />},\n    {href: '/orders', title: '주문'},\n    {title: '주문 상세'},\n  ]}\n/>`,
    Preview: ({v}) => (
      <Breadcrumb
        separator={s(v.separator)}
        items={[{href: '#/', title: <HomeOutlined />}, {title: <a>주문</a>}, {title: '주문 상세'}]}
      />
    ),
  },
  Dropdown: {
    tag: 'Dropdown',
    controls: [
      {kind: 'select', key: 'trigger', label: '여는 방법(trigger)', options: ['hover', 'click', 'contextMenu'], default: 'hover'},
      {kind: 'select', key: 'placement', label: '위치(placement)', options: ['bottomLeft', 'bottom', 'bottomRight', 'topLeft', 'top', 'topRight'], default: 'bottomLeft'},
      {kind: 'bool', key: 'arrow', label: '화살표(arrow)', default: false},
      {kind: 'bool', key: 'disabled', label: '비활성(disabled)', default: false},
    ],
    code: (v) =>
      `import {Button, Dropdown} from 'antd';\n\nconst items = [\n  {key: 'edit', label: '수정'},\n  {key: 'copy', label: '복사'},\n  {type: 'divider'},\n  {key: 'delete', label: '삭제', danger: true},\n];\n\n<Dropdown menu={{items, onClick: ({key}) => console.log(key)}} trigger={['${v.trigger}']} placement="${v.placement}"${v.arrow ? ' arrow' : ''}${v.disabled ? ' disabled' : ''}>\n  <Button>더보기</Button>\n</Dropdown>`,
    Preview: ({v}) => (
      <Dropdown
        menu={{items: dropdownItems}}
        trigger={[s(v.trigger) as 'hover']}
        placement={s(v.placement) as 'bottomLeft'}
        arrow={b(v.arrow)}
        disabled={b(v.disabled)}
      >
        <Button>
          {v.trigger === 'contextMenu' ? '여기서 우클릭' : '더보기'} <DownOutlined />
        </Button>
      </Dropdown>
    ),
  },
  Menu: {
    tag: 'Menu',
    controls: [
      {kind: 'select', key: 'mode', label: '모양(mode)', options: ['inline', 'vertical', 'horizontal'], default: 'inline'},
      {kind: 'select', key: 'theme', label: '테마(theme)', options: ['light', 'dark'], default: 'light'},
    ],
    code: (v) =>
      `import {Menu} from 'antd';\n\nconst items = [\n  {key: 'mail', icon: <MailOutlined />, label: '메일'},\n  {key: 'app', icon: <AppstoreOutlined />, label: '앱'},\n  {key: 'setting', icon: <SettingOutlined />, label: '설정', children: [\n    {key: 'profile', label: '내 정보'},\n    {key: 'security', label: '보안'},\n  ]},\n];\n\n<Menu mode="${v.mode}" theme="${v.theme}" items={items} selectedKeys={[current]} onClick={(e) => setCurrent(e.key)} />`,
    Preview: function MenuPreview({v}) {
      const [current, setCurrent] = useState('mail');
      return (
        <Menu
          style={{width: v.mode === 'horizontal' ? '100%' : 240}}
          mode={s(v.mode) as 'inline'}
          theme={s(v.theme) as 'light'}
          items={menuItems}
          selectedKeys={[current]}
          onClick={(e) => setCurrent(e.key)}
        />
      );
    },
  },
  Pagination: {
    tag: 'Pagination',
    controls: [
      {kind: 'number', key: 'total', label: '전체 개수(total)', default: 500, min: 0, max: 2000, step: 50},
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
      {kind: 'bool', key: 'simple', label: '간단히(simple)', default: false},
      {kind: 'bool', key: 'showSizeChanger', label: '쪽당 개수 선택(showSizeChanger)', default: false},
      {kind: 'bool', key: 'showQuickJumper', label: '바로 가기(showQuickJumper)', default: false},
      {kind: 'bool', key: 'disabled', label: '비활성(disabled)', default: false},
    ],
    extra: 'current={page} onChange={setPage}',
    Preview: function PaginationPreview({v}) {
      const [page, setPage] = useState(1);
      return (
        <Pagination
          current={page}
          onChange={setPage}
          total={Number(v.total)}
          size={s(v.size) as 'small'}
          simple={b(v.simple)}
          showSizeChanger={b(v.showSizeChanger)}
          showQuickJumper={b(v.showQuickJumper)}
          disabled={b(v.disabled)}
        />
      );
    },
  },
  Steps: {
    tag: 'Steps',
    controls: [
      {kind: 'number', key: 'current', label: '현재 단계(current)', default: 1, min: 0, max: 2},
      {kind: 'select', key: 'orientation', label: '방향(orientation)', options: ['horizontal', 'vertical'], default: 'horizontal'},
      {kind: 'select', key: 'status', label: '현재 상태(status)', options: ['process', 'wait', 'finish', 'error'], default: 'process'},
      {kind: 'select', key: 'type', label: '종류(type)', options: ['default', 'dot', 'navigation', 'panel'], default: 'default'},
      {kind: 'select', key: 'size', label: '크기(size)', options: ['medium', 'small'], default: 'medium'},
    ],
    code: (v) =>
      `import {Steps} from 'antd';\n\n<Steps\n  current={${v.current}}${v.orientation !== 'horizontal' ? `\n  orientation="${v.orientation}"` : ''}${v.status !== 'process' ? `\n  status="${v.status}"` : ''}${v.type !== 'default' ? `\n  type="${v.type}"` : ''}${v.size !== 'medium' ? `\n  size="${v.size}"` : ''}\n  items={[\n    {title: '주문', content: '주문 접수'},\n    {title: '결제', content: '결제 확인'},\n    {title: '배송', content: '배송 시작'},\n  ]}\n/>`,
    Preview: ({v}) => (
      <Steps
        style={{width: '100%'}}
        current={Number(v.current)}
        orientation={s(v.orientation) as 'horizontal'}
        status={s(v.status) as 'process'}
        type={s(v.type) as 'default'}
        size={s(v.size) as 'medium'}
        items={[
          {title: '주문', content: '주문 접수'},
          {title: '결제', content: '결제 확인'},
          {title: '배송', content: '배송 시작'},
        ]}
      />
    ),
  },
  Tabs: {
    tag: 'Tabs',
    controls: [
      {kind: 'select', key: 'type', label: '종류(type)', options: ['line', 'card'], default: 'line'},
      {kind: 'select', key: 'tabPlacement', label: '탭 위치(tabPlacement)', options: ['top', 'bottom', 'start', 'end'], default: 'top'},
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
      {kind: 'bool', key: 'centered', label: '가운데(centered)', default: false},
    ],
    code: (v) =>
      `import {Tabs} from 'antd';\n\n<Tabs${v.type !== 'line' ? ` type="${v.type}"` : ''}${v.tabPlacement !== 'top' ? ` tabPlacement="${v.tabPlacement}"` : ''}${v.size !== 'medium' ? ` size="${v.size}"` : ''}${v.centered ? ' centered' : ''}\n  items={[\n    {key: '1', label: '기본 정보', children: '기본 정보 내용'},\n    {key: '2', label: '주문 내역', children: '주문 내역 내용'},\n    {key: '3', label: '설정', children: '설정 내용', disabled: true},\n  ]}\n/>`,
    Preview: ({v}) => (
      <Tabs
        style={{width: '100%'}}
        type={s(v.type) as 'line'}
        tabPlacement={s(v.tabPlacement) as 'top'}
        size={s(v.size) as 'small'}
        centered={b(v.centered)}
        items={[
          {key: '1', label: '기본 정보', children: '기본 정보 내용'},
          {key: '2', label: '주문 내역', children: '주문 내역 내용'},
          {key: '3', label: '설정', children: '설정 내용', disabled: true},
        ]}
      />
    ),
  },

  /* ---------- 피드백 ---------- */
  Alert: {
    tag: 'Alert',
    controls: [
      {kind: 'text', key: 'title', label: '제목(title)', default: '저장했어요'},
      {kind: 'text', key: 'description', label: '설명(description)', default: ''},
      {kind: 'select', key: 'type', label: '종류(type)', options: STATUS4, default: 'success'},
      {kind: 'bool', key: 'showIcon', label: '아이콘(showIcon)', default: true},
      {kind: 'bool', key: 'closable', label: '닫기 버튼(closable)', default: false},
      {kind: 'bool', key: 'banner', label: '배너형(banner)', default: false},
    ],
    Preview: ({v}) => (
      <Alert
        style={{width: '100%'}}
        title={s(v.title)}
        description={s(v.description) || undefined}
        type={s(v.type) as 'success'}
        showIcon={b(v.showIcon)}
        closable={b(v.closable)}
        banner={b(v.banner)}
      />
    ),
  },
  Drawer: {
    tag: 'Drawer',
    controls: [
      {kind: 'text', key: 'title', label: '제목(title)', default: '상세 정보'},
      {kind: 'select', key: 'placement', label: '나오는 방향(placement)', options: ['right', 'left', 'top', 'bottom'], default: 'right'},
      {kind: 'select', key: 'size', label: '크기(size)', options: ['default', 'large'], default: 'default'},
      {kind: 'bool', key: 'resizable', label: '크기 조절(resizable)', default: false},
    ],
    code: (v) =>
      `import {Button, Drawer} from 'antd';\n\nconst [open, setOpen] = useState(false);\n\n<Button onClick={() => setOpen(true)}>열기</Button>\n<Drawer title="${v.title}"${v.placement !== 'right' ? ` placement="${v.placement}"` : ''}${v.size !== 'default' ? ` size="${v.size}"` : ''}${v.resizable ? ' resizable' : ''} open={open} onClose={() => setOpen(false)}>\n  내용\n</Drawer>`,
    Preview: function DrawerPreview({v}) {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button type="primary" onClick={() => setOpen(true)}>
            열기
          </Button>
          <Drawer
            title={s(v.title)}
            placement={s(v.placement) as 'right'}
            size={s(v.size) as 'medium'}
            resizable={b(v.resizable)}
            open={open}
            onClose={() => setOpen(false)}
          >
            서랍 패널 내용이에요.
          </Drawer>
        </>
      );
    },
  },
  Message: {
    tag: 'message',
    controls: [
      {kind: 'select', key: 'type', label: '종류', options: [...STATUS4, 'loading'], default: 'success'},
      {kind: 'text', key: 'content', label: '내용(content)', default: '저장했어요'},
      {kind: 'number', key: 'duration', label: '표시 시간(duration, 초)', default: 3, min: 0, max: 10},
    ],
    code: (v) =>
      `import {App, Button} from 'antd';\n\n// <App> 안에서\nconst {message} = App.useApp();\n\n<Button onClick={() => message.${v.type}('${v.content}'${v.duration !== 3 ? `, ${v.duration}` : ''})}>띄우기</Button>`,
    Preview: function MessagePreview({v}) {
      const {message} = App.useApp();
      return (
        <Button onClick={() => message.open({type: s(v.type) as 'success', content: s(v.content), duration: Number(v.duration)})}>
          메시지 띄우기
        </Button>
      );
    },
  },
  Modal: {
    tag: 'Modal',
    controls: [
      {kind: 'text', key: 'title', label: '제목(title)', default: '저장할까요?'},
      {kind: 'bool', key: 'centered', label: '화면 가운데(centered)', default: false},
      {kind: 'text', key: 'okText', label: '확인 글자(okText)', default: '저장'},
      {kind: 'text', key: 'cancelText', label: '취소 글자(cancelText)', default: '취소'},
      {kind: 'bool', key: 'confirm', label: 'modal.confirm 함수로 띄우기', default: false},
    ],
    code: (v) =>
      v.confirm
        ? `import {App, Button} from 'antd';\n\nconst {modal} = App.useApp();\n\n<Button onClick={() => modal.confirm({\n  title: '${v.title}',\n  content: '변경한 내용을 저장합니다.',\n  okText: '${v.okText}',\n  cancelText: '${v.cancelText}',\n  onOk: () => save(),\n})}>열기</Button>`
        : `import {Button, Modal} from 'antd';\n\nconst [open, setOpen] = useState(false);\n\n<Button onClick={() => setOpen(true)}>열기</Button>\n<Modal\n  title="${v.title}"\n  open={open}${v.centered ? '\n  centered' : ''}\n  okText="${v.okText}"\n  cancelText="${v.cancelText}"\n  onOk={() => setOpen(false)}\n  onCancel={() => setOpen(false)}\n>\n  변경한 내용을 저장합니다.\n</Modal>`,
    Preview: function ModalPreview({v}) {
      const [open, setOpen] = useState(false);
      const {modal} = App.useApp();
      const props = {title: s(v.title), okText: s(v.okText), cancelText: s(v.cancelText), centered: b(v.centered)};
      return (
        <>
          <Button
            type="primary"
            onClick={() => (b(v.confirm) ? modal.confirm({...props, content: '변경한 내용을 저장합니다.'}) : setOpen(true))}
          >
            열기
          </Button>
          <Modal {...props} open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
            변경한 내용을 저장합니다.
          </Modal>
        </>
      );
    },
  },
  Notification: {
    tag: 'notification',
    controls: [
      {kind: 'select', key: 'type', label: '종류', options: STATUS4, default: 'info'},
      {kind: 'text', key: 'title', label: '제목(title)', default: '새 주문'},
      {kind: 'text', key: 'description', label: '내용(description)', default: '주문 1건이 들어왔어요.'},
      {kind: 'select', key: 'placement', label: '위치(placement)', options: ['topRight', 'topLeft', 'bottomRight', 'bottomLeft', 'top', 'bottom'], default: 'topRight'},
      {kind: 'bool', key: 'showProgress', label: '남은 시간 막대(showProgress)', default: false},
    ],
    code: (v) =>
      `import {App, Button} from 'antd';\n\nconst {notification} = App.useApp();\n\n<Button onClick={() => notification.${v.type}({\n  title: '${v.title}',\n  description: '${v.description}',${v.placement !== 'topRight' ? `\n  placement: '${v.placement}',` : ''}${v.showProgress ? '\n  showProgress: true,' : ''}\n})}>띄우기</Button>`,
    Preview: function NotificationPreview({v}) {
      const {notification} = App.useApp();
      return (
        <Button
          onClick={() =>
            notification[s(v.type) as 'info']({
              title: s(v.title),
              description: s(v.description),
              placement: s(v.placement) as 'topRight',
              showProgress: b(v.showProgress),
            })
          }
        >
          알림 띄우기
        </Button>
      );
    },
  },
  Popconfirm: {
    tag: 'Popconfirm',
    controls: [
      {kind: 'text', key: 'title', label: '제목(title)', default: '삭제할까요?'},
      {kind: 'text', key: 'description', label: '설명(description)', default: '되돌릴 수 없어요.'},
      {kind: 'text', key: 'okText', label: '확인 글자(okText)', default: '삭제'},
      {kind: 'text', key: 'cancelText', label: '취소 글자(cancelText)', default: '취소'},
      {kind: 'bool', key: 'showCancel', label: '취소 버튼(showCancel)', default: true},
    ],
    code: (v) =>
      `import {Button, Popconfirm} from 'antd';\n\n<Popconfirm\n  title="${v.title}"\n  description="${v.description}"\n  okText="${v.okText}"\n  cancelText="${v.cancelText}"${v.showCancel ? '' : '\n  showCancel={false}'}\n  onConfirm={() => remove()}\n>\n  <Button danger>삭제</Button>\n</Popconfirm>`,
    Preview: ({v}) => (
      <Popconfirm
        title={s(v.title)}
        description={s(v.description) || undefined}
        okText={s(v.okText)}
        cancelText={s(v.cancelText)}
        showCancel={b(v.showCancel)}
      >
        <Button danger>삭제</Button>
      </Popconfirm>
    ),
  },
  Progress: {
    tag: 'Progress',
    controls: [
      {kind: 'number', key: 'percent', label: '퍼센트(percent)', default: 60, min: 0, max: 100, step: 5},
      {kind: 'select', key: 'type', label: '종류(type)', options: ['line', 'circle', 'dashboard'], default: 'line'},
      {kind: 'select', key: 'status', label: '상태(status)', options: ['normal', 'active', 'success', 'exception'], default: 'normal'},
      {kind: 'bool', key: 'showInfo', label: '숫자 표시(showInfo)', default: true},
      {kind: 'number', key: 'steps', label: '칸 나누기(steps, 0=없음)', default: 0, min: 0, max: 20},
    ],
    code: (v) =>
      `import {Progress} from 'antd';\n\n<Progress percent={${v.percent}}${v.type !== 'line' ? ` type="${v.type}"` : ''}${v.status !== 'normal' ? ` status="${v.status}"` : ''}${v.showInfo ? '' : ' showInfo={false}'}${v.steps ? ` steps={${v.steps}}` : ''} />`,
    Preview: ({v}) => (
      <div style={{width: v.type === 'line' ? '100%' : undefined}}>
        <Progress
          percent={Number(v.percent)}
          type={s(v.type) as 'line'}
          status={s(v.status) as 'normal'}
          showInfo={b(v.showInfo)}
          steps={Number(v.steps) || undefined}
        />
      </div>
    ),
  },
  Result: {
    tag: 'Result',
    controls: [
      {kind: 'select', key: 'status', label: '상태(status)', options: [...STATUS4, '404', '403', '500'], default: 'success'},
      {kind: 'text', key: 'title', label: '제목(title)', default: '주문이 완료됐어요'},
      {kind: 'text', key: 'subTitle', label: '부제목(subTitle)', default: '주문 번호: 2026112600123'},
    ],
    extra: 'extra={<Button type="primary">주문 내역 보기</Button>}',
    Preview: ({v}) => (
      <Result
        status={s(v.status) as 'success'}
        title={s(v.title)}
        subTitle={s(v.subTitle) || undefined}
        extra={<Button type="primary">주문 내역 보기</Button>}
      />
    ),
  },
  Skeleton: {
    tag: 'Skeleton',
    controls: [
      {kind: 'bool', key: 'active', label: '반짝임(active)', default: true},
      {kind: 'bool', key: 'avatar', label: '아바타 자리(avatar)', default: false},
      {kind: 'bool', key: 'round', label: '둥글게(round)', default: false},
      {kind: 'bool', key: 'loading', label: '불러오는 중(loading)', default: true},
    ],
    Preview: ({v}) => (
      <div style={{width: '100%'}}>
        <Skeleton active={b(v.active)} avatar={b(v.avatar)} round={b(v.round)} loading={b(v.loading)}>
          불러온 실제 내용이에요.
        </Skeleton>
      </div>
    ),
  },
  Spin: {
    tag: 'Spin',
    controls: [
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
      {kind: 'text', key: 'description', label: '설명 글자(description)', default: ''},
      {kind: 'bool', key: 'spinning', label: '회전 중(spinning)', default: true},
      {kind: 'bool', key: 'wrap', label: '내용 위에 겹치기 (children 감싸기)', default: false},
    ],
    code: (v) =>
      v.wrap
        ? `import {Spin} from 'antd';\n\n<Spin spinning={loading}${v.description ? ` description="${v.description}"` : ''}>\n  <Card>내용</Card>\n</Spin>`
        : `import {Spin} from 'antd';\n\n<Spin${v.size !== 'medium' ? ` size="${v.size}"` : ''}${v.description ? ` description="${v.description}"` : ''} />`,
    Preview: ({v}) => {
      const props = {size: s(v.size) as 'medium', description: s(v.description) || undefined, spinning: b(v.spinning)};
      return b(v.wrap) ? (
        <Spin {...props}>
          <Alert title="불러오는 동안 이 내용 위에 로딩 표시가 겹쳐요" description="spinning 을 끄면 사라져요." type="info" />
        </Spin>
      ) : (
        <Spin {...props} />
      );
    },
  },
  Watermark: {
    tag: 'Watermark',
    controls: [
      {kind: 'text', key: 'content', label: '글자(content)', default: '대외비'},
      {kind: 'number', key: 'rotate', label: '각도(rotate)', default: -22, min: -90, max: 90, step: 1},
      {kind: 'number', key: 'gap', label: '간격(gap)', default: 100, min: 20, max: 200, step: 10},
    ],
    code: (v) =>
      `import {Watermark} from 'antd';\n\n<Watermark content="${v.content}"${v.rotate !== -22 ? ` rotate={${v.rotate}}` : ''}${v.gap !== 100 ? ` gap={[${v.gap}, ${v.gap}]}` : ''}>\n  <div style={{height: 300}}>내용</div>\n</Watermark>`,
    Preview: ({v}) => (
      <Watermark content={s(v.content)} rotate={Number(v.rotate)} gap={[Number(v.gap), Number(v.gap)]} style={{width: '100%'}}>
        <Space orientation="vertical" style={{height: 160, padding: 16}}>
          <b>사내 보고서</b>
          <span>워터마크가 이 영역 전체에 깔려요.</span>
        </Space>
      </Watermark>
    ),
  },
};
