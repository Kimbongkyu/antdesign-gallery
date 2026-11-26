import {
  Affix,
  App,
  BorderBeam,
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Divider,
  Flex,
  FloatButton,
  Input,
  Layout,
  Masonry,
  Row,
  Space,
  Splitter,
  Typography,
} from 'antd';
import {
  CustomerServiceOutlined,
  HeartTwoTone,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  SmileOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type {Demo} from '../demoTypes';
import {b, s} from '../demoTypes';

const SIZES3 = ['small', 'medium', 'large'];
const box = (label: string, h = 40) => (
  <div key={label} className="gx-box" style={{height: h}}>
    {label}
  </div>
);

export const GENERAL_LAYOUT_OTHER: Record<string, Demo> = {
  /* ---------- 통용 ---------- */
  Button: {
    tag: 'Button',
    controls: [
      {kind: 'text', key: 'children', label: '글자', default: '버튼'},
      {kind: 'select', key: 'type', label: '종류(type)', options: ['default', 'primary', 'dashed', 'text', 'link'], default: 'primary'},
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
      {kind: 'select', key: 'shape', label: '모양(shape)', options: ['default', 'round', 'circle'], default: 'default'},
      {kind: 'bool', key: 'danger', label: '위험(danger)', default: false},
      {kind: 'bool', key: 'disabled', label: '비활성(disabled)', default: false},
      {kind: 'bool', key: 'loading', label: '로딩(loading)', default: false},
      {kind: 'bool', key: 'block', label: '꽉 차게(block)', default: false},
    ],
    Preview: ({v}) => (
      <Button
        type={s(v.type) as 'primary'}
        size={s(v.size) as 'middle'}
        shape={s(v.shape) as 'round'}
        danger={b(v.danger)}
        disabled={b(v.disabled)}
        loading={b(v.loading)}
        block={b(v.block)}
      >
        {s(v.children)}
      </Button>
    ),
  },
  FloatButton: {
    tag: 'FloatButton',
    controls: [
      {kind: 'select', key: 'type', label: '종류(type)', options: ['default', 'primary'], default: 'primary'},
      {kind: 'select', key: 'shape', label: '모양(shape)', options: ['circle', 'square'], default: 'circle'},
      {kind: 'text', key: 'tooltip', label: '툴팁(tooltip)', default: '도움말'},
    ],
    note: '실제로는 화면 오른쪽 아래에 고정돼요. 여기서는 미리보기 상자 안에 보이도록 위치를 바꿨어요.',
    extra: 'icon={<QuestionCircleOutlined />}',
    Preview: ({v}) => (
      <div style={{position: 'relative', width: '100%', height: 120}}>
        <FloatButton
          style={{position: 'absolute', insetInlineEnd: 16, bottom: 16}}
          type={s(v.type) as 'primary'}
          shape={s(v.shape) as 'circle'}
          tooltip={s(v.tooltip) || undefined}
          icon={<QuestionCircleOutlined />}
        />
      </div>
    ),
  },
  Icon: {
    tag: 'SmileOutlined',
    controls: [
      {kind: 'bool', key: 'spin', label: '회전(spin)', default: false},
      {kind: 'number', key: 'rotate', label: '각도(rotate)', default: 0, min: 0, max: 360, step: 15},
    ],
    code: (v) =>
      `import {SmileOutlined} from '@ant-design/icons';\n\n<SmileOutlined${v.spin ? ' spin' : ''}${v.rotate ? ` rotate={${v.rotate}}` : ''} />`,
    note: '아이콘은 @ant-design/icons 패키지에서 가져와요. 이름 뒤에 Outlined / Filled / TwoTone 이 붙어요.',
    Preview: ({v}) => (
      <Space size="large" style={{fontSize: 28}}>
        <SmileOutlined spin={b(v.spin)} rotate={Number(v.rotate)} />
        <SettingOutlined spin={b(v.spin)} rotate={Number(v.rotate)} />
        <SyncOutlined spin={b(v.spin)} rotate={Number(v.rotate)} />
        <HeartTwoTone twoToneColor="#eb2f96" spin={b(v.spin)} rotate={Number(v.rotate)} />
      </Space>
    ),
  },
  Typography: {
    tag: 'Typography.Text',
    controls: [
      {kind: 'text', key: 'children', label: '글자', default: 'Ant Design 글자'},
      {kind: 'select', key: 'type', label: '종류(type)', options: ['', 'secondary', 'success', 'warning', 'danger'], default: ''},
      {kind: 'bool', key: 'strong', label: '굵게(strong)', default: false},
      {kind: 'bool', key: 'underline', label: '밑줄(underline)', default: false},
      {kind: 'bool', key: 'delete', label: '취소선(delete)', default: false},
      {kind: 'bool', key: 'code', label: '코드(code)', default: false},
      {kind: 'bool', key: 'mark', label: '형광펜(mark)', default: false},
      {kind: 'bool', key: 'copyable', label: '복사 버튼(copyable)', default: false},
    ],
    Preview: ({v}) => (
      <Typography.Text
        type={(s(v.type) || undefined) as 'secondary'}
        strong={b(v.strong)}
        underline={b(v.underline)}
        delete={b(v.delete)}
        code={b(v.code)}
        mark={b(v.mark)}
        copyable={b(v.copyable)}
      >
        {s(v.children)}
      </Typography.Text>
    ),
  },

  /* ---------- 레이아웃 ---------- */
  Divider: {
    tag: 'Divider',
    controls: [
      {kind: 'text', key: 'children', label: '가운데 글자', default: '구분'},
      {kind: 'select', key: 'titlePlacement', label: '글자 위치(titlePlacement)', options: ['center', 'start', 'end'], default: 'center'},
      {kind: 'select', key: 'variant', label: '선 모양(variant)', options: ['solid', 'dashed', 'dotted'], default: 'solid'},
      {kind: 'bool', key: 'plain', label: '보통 글자(plain)', default: false},
    ],
    Preview: ({v}) => (
      <div style={{width: '100%'}}>
        <Typography.Paragraph>위쪽 내용</Typography.Paragraph>
        <Divider titlePlacement={s(v.titlePlacement) as 'center'} variant={s(v.variant) as 'solid'} plain={b(v.plain)}>
          {s(v.children) || undefined}
        </Divider>
        <Typography.Paragraph>아래쪽 내용</Typography.Paragraph>
      </div>
    ),
  },
  Flex: {
    tag: 'Flex',
    controls: [
      {kind: 'bool', key: 'vertical', label: '세로(vertical)', default: false},
      {kind: 'select', key: 'justify', label: '가로 정렬(justify)', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'], default: 'flex-start'},
      {kind: 'select', key: 'align', label: '세로 정렬(align)', options: ['flex-start', 'center', 'flex-end'], default: 'flex-start'},
      {kind: 'select', key: 'gap', label: '간격(gap)', options: ['small', 'medium', 'large'], default: 'small'},
      {kind: 'bool', key: 'wrap', label: '줄바꿈(wrap)', default: false},
    ],
    code: (v) =>
      `import {Flex} from 'antd';\n\n<Flex${v.vertical ? ' vertical' : ''} justify="${v.justify}" align="${v.align}" gap="${v.gap}"${v.wrap ? ' wrap' : ''}>\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</Flex>`,
    Preview: ({v}) => (
      <Flex
        vertical={b(v.vertical)}
        justify={s(v.justify)}
        align={s(v.align)}
        gap={s(v.gap) as 'small'}
        wrap={b(v.wrap)}
        style={{width: '100%', minHeight: 120, background: '#fafafa'}}
      >
        {box('1')}
        {box('2', 60)}
        {box('3')}
      </Flex>
    ),
  },
  Grid: {
    tag: 'Row',
    controls: [
      {kind: 'number', key: 'gutter', label: '칸 간격(gutter)', default: 16, min: 0, max: 48, step: 8},
      {kind: 'number', key: 'span', label: '칸 너비(span, 24칸 중)', default: 8, min: 1, max: 24},
      {kind: 'select', key: 'justify', label: '정렬(justify)', options: ['start', 'center', 'end', 'space-between'], default: 'start'},
    ],
    code: (v) =>
      `import {Col, Row} from 'antd';\n\n<Row gutter={${v.gutter}} justify="${v.justify}">\n  <Col span={${v.span}}>A</Col>\n  <Col span={${v.span}}>B</Col>\n</Row>`,
    Preview: ({v}) => (
      <Row gutter={Number(v.gutter)} justify={s(v.justify) as 'start'} style={{width: '100%'}}>
        {['A', 'B'].map((x) => (
          <Col key={x} span={Number(v.span)}>
            {box(`${x} · span ${v.span}`)}
          </Col>
        ))}
      </Row>
    ),
  },
  Layout: {
    tag: 'Layout',
    controls: [
      {kind: 'bool', key: 'sider', label: '사이드바 표시', default: true},
      {kind: 'select', key: 'theme', label: '사이드바 테마(theme)', options: ['light', 'dark'], default: 'light'},
    ],
    code: (v) =>
      `import {Layout} from 'antd';\n\nconst {Header, Sider, Content, Footer} = Layout;\n\n<Layout>\n  <Header>헤더</Header>\n  <Layout>\n${v.sider ? `    <Sider theme="${v.theme}">사이드바</Sider>\n` : ''}    <Content>본문</Content>\n  </Layout>\n  <Footer>푸터</Footer>\n</Layout>`,
    Preview: ({v}) => (
      <Layout style={{width: '100%', textAlign: 'center'}}>
        <Layout.Header style={{color: '#fff', height: 40, lineHeight: '40px'}}>헤더</Layout.Header>
        <Layout>
          {b(v.sider) && (
            <Layout.Sider theme={s(v.theme) as 'light'} width={100} style={{padding: 12}}>
              사이드바
            </Layout.Sider>
          )}
          <Layout.Content style={{padding: 24}}>본문</Layout.Content>
        </Layout>
        <Layout.Footer style={{padding: 8}}>푸터</Layout.Footer>
      </Layout>
    ),
  },
  Masonry: {
    tag: 'Masonry',
    controls: [
      {kind: 'number', key: 'columns', label: '열 수(columns)', default: 3, min: 1, max: 5},
      {kind: 'number', key: 'gutter', label: '간격(gutter)', default: 8, min: 0, max: 24, step: 4},
    ],
    code: (v) =>
      `import {Masonry} from 'antd';\n\n<Masonry\n  columns={${v.columns}}\n  gutter={${v.gutter}}\n  items={items.map((it) => ({key: it.id, data: it}))}\n  itemRender={({data}) => <Card>{data.title}</Card>}\n/>`,
    Preview: ({v}) => (
      <div style={{width: '100%'}}>
        <Masonry
          columns={Number(v.columns)}
          gutter={Number(v.gutter)}
          items={[60, 100, 40, 80, 120, 50, 90].map((h, i) => ({key: i, data: h}))}
          itemRender={({data, key}) => box(String(key), data)}
        />
      </div>
    ),
  },
  Space: {
    tag: 'Space',
    controls: [
      {kind: 'select', key: 'orientation', label: '방향(orientation)', options: ['horizontal', 'vertical'], default: 'horizontal'},
      {kind: 'select', key: 'size', label: '간격(size)', options: SIZES3, default: 'small'},
      {kind: 'bool', key: 'wrap', label: '줄바꿈(wrap)', default: false},
    ],
    code: (v) =>
      `import {Button, Space} from 'antd';\n\n<Space${v.orientation !== 'horizontal' ? ` orientation="${v.orientation}"` : ''}${v.size !== 'small' ? ` size="${v.size}"` : ''}${v.wrap ? ' wrap' : ''}>\n  <Button>하나</Button>\n  <Button>둘</Button>\n  <Button>셋</Button>\n</Space>`,
    Preview: ({v}) => (
      <Space orientation={s(v.orientation) as 'horizontal'} size={s(v.size) as 'small'} wrap={b(v.wrap)}>
        <Button>하나</Button>
        <Button>둘</Button>
        <Button>셋</Button>
      </Space>
    ),
  },
  Splitter: {
    tag: 'Splitter',
    controls: [
      {kind: 'select', key: 'orientation', label: '방향(orientation)', options: ['horizontal', 'vertical'], default: 'horizontal'},
      {kind: 'bool', key: 'collapsible', label: '접기 가능(Panel collapsible)', default: false},
    ],
    code: (v) =>
      `import {Splitter} from 'antd';\n\n<Splitter${v.orientation !== 'horizontal' ? ` orientation="${v.orientation}"` : ''}>\n  <Splitter.Panel defaultSize="40%" min="20%"${v.collapsible ? ' collapsible' : ''}>왼쪽</Splitter.Panel>\n  <Splitter.Panel>오른쪽</Splitter.Panel>\n</Splitter>`,
    Preview: ({v}) => (
      <Splitter orientation={s(v.orientation) as 'horizontal'} style={{width: '100%', height: 160, background: '#fafafa'}}>
        <Splitter.Panel defaultSize="40%" min="20%" collapsible={b(v.collapsible)}>
          <Flex justify="center" align="center" style={{height: '100%'}}>
            첫째
          </Flex>
        </Splitter.Panel>
        <Splitter.Panel>
          <Flex justify="center" align="center" style={{height: '100%'}}>
            둘째 (가운데 막대를 끌어보세요)
          </Flex>
        </Splitter.Panel>
      </Splitter>
    ),
  },

  /* ---------- 기타 ---------- */
  Affix: {
    tag: 'Affix',
    controls: [{kind: 'number', key: 'offsetTop', label: '위에서 거리(offsetTop)', default: 70, min: 0, max: 200, step: 10}],
    code: (v) => `import {Affix, Button} from 'antd';\n\n<Affix offsetTop={${v.offsetTop}}>\n  <Button type="primary">고정 버튼</Button>\n</Affix>`,
    note: '페이지를 스크롤하면 이 버튼이 화면 위쪽에 붙어 따라와요.',
    Preview: ({v}) => (
      <Affix offsetTop={Number(v.offsetTop)}>
        <Button type="primary">고정 버튼</Button>
      </Affix>
    ),
  },
  App: {
    tag: 'App',
    controls: [],
    code: () =>
      `import {App, Button} from 'antd';\n\n// 최상위를 <App> 으로 감싸면 하위 어디서나 훅으로 띄울 수 있다\nfunction SaveButton() {\n  const {message} = App.useApp();\n  return <Button onClick={() => message.success('저장했어요')}>저장</Button>;\n}\n\n<App>\n  <SaveButton />\n</App>`,
    Preview: function AppPreview() {
      const {message} = App.useApp();
      return <Button onClick={() => message.success('저장했어요')}>App.useApp() 으로 메시지 띄우기</Button>;
    },
  },
  BorderBeam: {
    tag: 'BorderBeam',
    controls: [
      {kind: 'number', key: 'duration', label: '한 바퀴 시간(duration, 초)', default: 6, min: 1, max: 20},
      {kind: 'number', key: 'count', label: '빛줄기 수(count)', default: 1, min: 1, max: 4},
      {kind: 'number', key: 'size', label: '빛 길이(size)', default: 100, min: 20, max: 300, step: 20},
      {kind: 'text', key: 'color', label: '색(color)', default: '#1677ff'},
    ],
    code: (v) =>
      `import {BorderBeam, Card} from 'antd';\n\n<BorderBeam duration={${v.duration}} count={${v.count}} size={${v.size}} color="${v.color}">\n  <Card>강조할 카드</Card>\n</BorderBeam>`,
    Preview: ({v}) => (
      <BorderBeam duration={Number(v.duration)} count={Number(v.count)} size={Number(v.size)} color={s(v.color)}>
        <Card style={{width: 240}}>강조할 카드</Card>
      </BorderBeam>
    ),
  },
  ConfigProvider: {
    tag: 'ConfigProvider',
    controls: [
      {kind: 'text', key: 'colorPrimary', label: '대표 색(theme.token.colorPrimary)', default: '#00b96b'},
      {kind: 'number', key: 'borderRadius', label: '모서리(theme.token.borderRadius)', default: 6, min: 0, max: 20},
      {kind: 'select', key: 'componentSize', label: '전체 크기(componentSize)', options: SIZES3, default: 'medium'},
      {kind: 'bool', key: 'componentDisabled', label: '전체 비활성(componentDisabled)', default: false},
    ],
    code: (v) =>
      `import {ConfigProvider} from 'antd';\nimport koKR from 'antd/locale/ko_KR';\n\n<ConfigProvider\n  locale={koKR}\n  componentSize="${v.componentSize}"${v.componentDisabled ? '\n  componentDisabled' : ''}\n  theme={{token: {colorPrimary: '${v.colorPrimary}', borderRadius: ${v.borderRadius}}}}\n>\n  <App />\n</ConfigProvider>`,
    Preview: ({v}) => (
      <ConfigProvider
        componentSize={s(v.componentSize) as 'middle'}
        componentDisabled={b(v.componentDisabled)}
        theme={{token: {colorPrimary: s(v.colorPrimary), borderRadius: Number(v.borderRadius)}}}
      >
        <Space wrap>
          <Button type="primary">버튼</Button>
          <Input placeholder="입력" style={{width: 120}} prefix={<SearchOutlined />} />
          <DatePicker />
          <Button icon={<CustomerServiceOutlined />} />
        </Space>
      </ConfigProvider>
    ),
  },
  Util: {
    tag: 'GetProps',
    controls: [],
    noPreview: '화면에 그리는 컴포넌트가 아니라, 컴포넌트의 속성·ref 타입을 꺼내는 TypeScript 도구예요.',
    code: () =>
      `import type {GetProp, GetProps, GetRef} from 'antd';\nimport {Checkbox, Input, Select} from 'antd';\n\n// 컴포넌트 전체 속성 타입\ntype CheckboxGroupProps = GetProps<typeof Checkbox.Group>;\n\n// 속성 하나의 타입\ntype SelectOption = GetProp<typeof Select, 'options'>[number];\n\n// ref 타입\ntype InputRef = GetRef<typeof Input>;`,
    Preview: () => null,
  },
};
