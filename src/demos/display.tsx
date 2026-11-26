import {useRef, useState} from 'react';
import {
  Avatar,
  Badge,
  Button,
  Calendar,
  Card,
  Carousel,
  Collapse,
  Descriptions,
  Empty,
  Image,
  List,
  Listy,
  Popover,
  QRCode,
  Segmented,
  Space,
  Statistic,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Tour,
  Tree,
} from 'antd';
import {BellOutlined, CheckCircleOutlined, EditOutlined, EllipsisOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import type {Demo} from '../demoTypes';
import {b, s} from '../demoTypes';

const SIZES3 = ['small', 'medium', 'large'];
const PLACEMENTS = ['top', 'bottom', 'left', 'right', 'topLeft', 'bottomRight'];
const IMG = 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp';

const people = [
  {key: '1', name: '김철수', dept: '개발팀', age: 32},
  {key: '2', name: '이영희', dept: '영업팀', age: 28},
  {key: '3', name: '박민수', dept: '생산팀', age: 41},
];

const orgTree = [
  {
    key: 'hq',
    title: '본사',
    children: [
      {key: 'dev', title: '개발팀', children: [{key: 'fe', title: '프론트엔드'}, {key: 'be', title: '백엔드'}]},
      {key: 'sales', title: '영업팀'},
    ],
  },
  {key: 'factory', title: '공장', children: [{key: 'prod', title: '생산팀'}]},
];

export const DISPLAY: Record<string, Demo> = {
  Avatar: {
    tag: 'Avatar',
    controls: [
      {kind: 'select', key: 'content', label: '내용', options: ['아이콘', '글자', '이미지'], default: '아이콘'},
      {kind: 'select', key: 'shape', label: '모양(shape)', options: ['circle', 'square'], default: 'circle'},
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
    ],
    code: (v) =>
      `import {Avatar} from 'antd';\n\n<Avatar${v.shape !== 'circle' ? ` shape="${v.shape}"` : ''}${v.size !== 'medium' ? ` size="${v.size}"` : ''}${v.content === '아이콘' ? ' icon={<UserOutlined />}' : v.content === '이미지' ? ' src="/profile.png"' : ''}${v.content === '글자' ? '>김</Avatar>' : ' />'}\n\n// 여러 개 겹치기\n<Avatar.Group max={{count: 2}}>...</Avatar.Group>`,
    Preview: ({v}) => {
      const p = {shape: s(v.shape) as 'circle', size: s(v.size) as 'default'};
      const one =
        v.content === '글자' ? <Avatar {...p}>김</Avatar> : v.content === '이미지' ? <Avatar {...p} src={IMG} /> : <Avatar {...p} icon={<UserOutlined />} />;
      return (
        <Space size="large">
          {one}
          <Avatar.Group max={{count: 2}}>
            <Avatar {...p} style={{background: '#f56a00'}}>김</Avatar>
            <Avatar {...p} style={{background: '#87d068'}}>이</Avatar>
            <Avatar {...p} style={{background: '#1677ff'}}>박</Avatar>
          </Avatar.Group>
        </Space>
      );
    },
  },
  Badge: {
    tag: 'Badge',
    controls: [
      {kind: 'number', key: 'count', label: '숫자(count)', default: 5, min: 0, max: 200},
      {kind: 'number', key: 'overflowCount', label: '최대 표시(overflowCount)', default: 99, min: 1, max: 999},
      {kind: 'bool', key: 'dot', label: '점만(dot)', default: false},
      {kind: 'bool', key: 'showZero', label: '0도 표시(showZero)', default: false},
      {kind: 'select', key: 'size', label: '크기(size)', options: ['medium', 'small'], default: 'medium'},
      {kind: 'select', key: 'status', label: '상태 점(status)', options: ['', 'success', 'processing', 'default', 'error', 'warning'], default: ''},
    ],
    code: (v) =>
      v.status
        ? `import {Badge} from 'antd';\n\n<Badge status="${v.status}" text="진행 상태" />`
        : `import {Avatar, Badge} from 'antd';\n\n<Badge count={${v.count}}${v.overflowCount !== 99 ? ` overflowCount={${v.overflowCount}}` : ''}${v.dot ? ' dot' : ''}${v.showZero ? ' showZero' : ''}${v.size !== 'medium' ? ` size="${v.size}"` : ''}>\n  <Avatar shape="square" icon={<BellOutlined />} />\n</Badge>`,
    Preview: ({v}) =>
      v.status ? (
        <Badge status={s(v.status) as 'success'} text="진행 상태" />
      ) : (
        <Badge
          count={Number(v.count)}
          overflowCount={Number(v.overflowCount)}
          dot={b(v.dot)}
          showZero={b(v.showZero)}
          size={s(v.size) as 'small'}
        >
          <Avatar shape="square" size="large" icon={<BellOutlined />} />
        </Badge>
      ),
  },
  Calendar: {
    tag: 'Calendar',
    controls: [
      {kind: 'bool', key: 'fullscreen', label: '큰 달력(fullscreen)', default: false},
      {kind: 'select', key: 'mode', label: '보기(mode)', options: ['month', 'year'], default: 'month'},
      {kind: 'bool', key: 'showWeek', label: '주차 표시(showWeek)', default: false},
    ],
    extra: 'value={date} onSelect={setDate} cellRender={(date) => 일정 표시}',
    Preview: ({v}) => (
      <div style={{width: '100%', maxWidth: b(v.fullscreen) ? undefined : 320}}>
        <Calendar fullscreen={b(v.fullscreen)} mode={s(v.mode) as 'month'} showWeek={b(v.showWeek)} />
      </div>
    ),
  },
  Card: {
    tag: 'Card',
    controls: [
      {kind: 'text', key: 'title', label: '제목(title)', default: '주문 요약'},
      {kind: 'select', key: 'size', label: '크기(size)', options: ['medium', 'small'], default: 'medium'},
      {kind: 'select', key: 'variant', label: '테두리(variant)', options: ['outlined', 'borderless'], default: 'outlined'},
      {kind: 'bool', key: 'hoverable', label: '올리면 그림자(hoverable)', default: false},
      {kind: 'bool', key: 'loading', label: '로딩(loading)', default: false},
      {kind: 'bool', key: 'actions', label: '아래 버튼(actions)', default: false},
      {kind: 'bool', key: 'cover', label: '위 이미지(cover)', default: false},
    ],
    code: (v) =>
      `import {Card} from 'antd';\n\n<Card\n  title="${v.title}"${v.size !== 'medium' ? `\n  size="${v.size}"` : ''}${v.variant !== 'outlined' ? `\n  variant="${v.variant}"` : ''}${v.hoverable ? '\n  hoverable' : ''}${v.loading ? '\n  loading' : ''}\n  extra={<a href="#">더보기</a>}${v.cover ? '\n  cover={<img src="..." />}' : ''}${v.actions ? '\n  actions={[<SettingOutlined key="setting" />, <EditOutlined key="edit" />]}' : ''}\n>\n  내용\n</Card>`,
    Preview: ({v}) => (
      <Card
        style={{width: 300}}
        title={s(v.title)}
        size={s(v.size) as 'small'}
        variant={s(v.variant) as 'outlined'}
        hoverable={b(v.hoverable)}
        loading={b(v.loading)}
        extra={<a>더보기</a>}
        cover={b(v.cover) ? <img alt="" src={IMG} style={{height: 120, objectFit: 'cover'}} /> : undefined}
        actions={b(v.actions) ? [<SettingOutlined key="s" />, <EditOutlined key="e" />, <EllipsisOutlined key="m" />] : undefined}
      >
        <p style={{margin: 0}}>주문 3건, 합계 129,000원</p>
      </Card>
    ),
  },
  Carousel: {
    tag: 'Carousel',
    controls: [
      {kind: 'bool', key: 'autoplay', label: '자동 넘김(autoplay)', default: false},
      {kind: 'select', key: 'effect', label: '효과(effect)', options: ['scrollx', 'fade'], default: 'scrollx'},
      {kind: 'select', key: 'dotPlacement', label: '점 위치(dotPlacement)', options: ['bottom', 'top', 'start', 'end'], default: 'bottom'},
      {kind: 'bool', key: 'arrows', label: '화살표(arrows)', default: false},
    ],
    code: (v) =>
      `import {Carousel} from 'antd';\n\n<Carousel${v.autoplay ? ' autoplay' : ''}${v.effect !== 'scrollx' ? ` effect="${v.effect}"` : ''}${v.dotPlacement !== 'bottom' ? ` dotPlacement="${v.dotPlacement}"` : ''}${v.arrows ? ' arrows' : ''}>\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</Carousel>`,
    Preview: ({v}) => (
      <div style={{width: '100%', maxWidth: 420}}>
        <Carousel autoplay={b(v.autoplay)} effect={s(v.effect) as 'scrollx'} dotPlacement={s(v.dotPlacement) as 'bottom'} arrows={b(v.arrows)}>
          {['1번 배너', '2번 배너', '3번 배너'].map((t, i) => (
            <div key={t}>
              <div className="gx-slide" style={{background: ['#1677ff', '#13c2c2', '#722ed1'][i]}}>
                {t}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    ),
  },
  Collapse: {
    tag: 'Collapse',
    controls: [
      {kind: 'bool', key: 'accordion', label: '하나만 펼침(accordion)', default: false},
      {kind: 'bool', key: 'ghost', label: '배경 없음(ghost)', default: false},
      {kind: 'bool', key: 'bordered', label: '테두리(bordered)', default: true},
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
      {kind: 'select', key: 'expandIconPlacement', label: '화살표 위치(expandIconPlacement)', options: ['start', 'end'], default: 'start'},
    ],
    code: (v) =>
      `import {Collapse} from 'antd';\n\n<Collapse${v.accordion ? ' accordion' : ''}${v.ghost ? ' ghost' : ''}${v.bordered ? '' : ' bordered={false}'}${v.size !== 'medium' ? ` size="${v.size}"` : ''}${v.expandIconPlacement !== 'start' ? ` expandIconPlacement="${v.expandIconPlacement}"` : ''}\n  items={[\n    {key: '1', label: '배송은 얼마나 걸리나요?', children: <p>보통 2~3일 걸려요.</p>},\n    {key: '2', label: '환불은 어떻게 하나요?', children: <p>주문 내역에서 신청하세요.</p>},\n  ]}\n/>`,
    Preview: ({v}) => (
      <Collapse
        style={{width: '100%'}}
        accordion={b(v.accordion)}
        ghost={b(v.ghost)}
        bordered={b(v.bordered)}
        size={s(v.size) as 'small'}
        expandIconPlacement={s(v.expandIconPlacement) as 'start'}
        defaultActiveKey={['1']}
        items={[
          {key: '1', label: '배송은 얼마나 걸리나요?', children: <p>보통 2~3일 걸려요.</p>},
          {key: '2', label: '환불은 어떻게 하나요?', children: <p>주문 내역에서 신청하세요.</p>},
          {key: '3', label: '영수증을 받을 수 있나요?', children: <p>결제 후 이메일로 보내드려요.</p>},
        ]}
      />
    ),
  },
  Descriptions: {
    tag: 'Descriptions',
    controls: [
      {kind: 'text', key: 'title', label: '제목(title)', default: '회원 정보'},
      {kind: 'bool', key: 'bordered', label: '표 모양(bordered)', default: false},
      {kind: 'number', key: 'column', label: '열 수(column)', default: 3, min: 1, max: 4},
      {kind: 'select', key: 'layout', label: '배치(layout)', options: ['horizontal', 'vertical'], default: 'horizontal'},
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
    ],
    code: (v) =>
      `import {Descriptions} from 'antd';\n\n<Descriptions\n  title="${v.title}"${v.bordered ? '\n  bordered' : ''}\n  column={${v.column}}${v.layout !== 'horizontal' ? `\n  layout="${v.layout}"` : ''}${v.size !== 'medium' ? `\n  size="${v.size}"` : ''}\n  items={[\n    {key: 'name', label: '이름', children: '김철수'},\n    {key: 'phone', label: '전화', children: '010-1234-5678'},\n    {key: 'addr', label: '주소', children: '서울시 강남구', span: 2},\n  ]}\n/>`,
    Preview: ({v}) => (
      <Descriptions
        style={{width: '100%'}}
        title={s(v.title)}
        bordered={b(v.bordered)}
        column={Number(v.column)}
        layout={s(v.layout) as 'horizontal'}
        size={s(v.size) as 'small'}
        items={[
          {key: 'name', label: '이름', children: '김철수'},
          {key: 'phone', label: '전화', children: '010-1234-5678'},
          {key: 'grade', label: '등급', children: 'VIP'},
          {key: 'addr', label: '주소', children: '서울시 강남구 테헤란로 1', span: 2},
          {key: 'join', label: '가입일', children: '2026-01-15'},
        ]}
      />
    ),
  },
  Empty: {
    tag: 'Empty',
    controls: [
      {kind: 'text', key: 'description', label: '설명(description)', default: '데이터가 없어요'},
      {kind: 'bool', key: 'simple', label: '단순 그림(Empty.PRESENTED_IMAGE_SIMPLE)', default: false},
    ],
    code: (v) =>
      `import {Empty} from 'antd';\n\n<Empty description="${v.description}"${v.simple ? ' image={Empty.PRESENTED_IMAGE_SIMPLE}' : ''} />`,
    Preview: ({v}) => <Empty description={s(v.description)} image={b(v.simple) ? Empty.PRESENTED_IMAGE_SIMPLE : undefined} />,
  },
  Image: {
    tag: 'Image',
    controls: [
      {kind: 'number', key: 'width', label: '너비(width)', default: 200, min: 50, max: 400, step: 10},
      {kind: 'bool', key: 'preview', label: '눌러서 크게(preview)', default: true},
      {kind: 'bool', key: 'group', label: '여러 장 묶음(Image.PreviewGroup)', default: false},
    ],
    code: (v) =>
      v.group
        ? `import {Image} from 'antd';\n\n<Image.PreviewGroup>\n  <Image width={${v.width}} src="a.jpg" />\n  <Image width={${v.width}} src="b.jpg" />\n</Image.PreviewGroup>`
        : `import {Image} from 'antd';\n\n<Image width={${v.width}} src="photo.jpg" fallback="대체 이미지 주소"${v.preview ? '' : ' preview={false}'} />`,
    Preview: ({v}) =>
      b(v.group) ? (
        <Image.PreviewGroup>
          <Space>
            <Image width={Number(v.width) / 2} src={IMG} />
            <Image width={Number(v.width) / 2} src={IMG} />
          </Space>
        </Image.PreviewGroup>
      ) : (
        <Image width={Number(v.width)} src={IMG} preview={b(v.preview)} />
      ),
  },
  List: {
    tag: 'List',
    note: '6.6.0부터 폐지 예정(다음 메이저 버전에서 제거)이에요. 새로 만들 때는 Listy 를 쓰세요.',
    controls: [
      {kind: 'bool', key: 'bordered', label: '테두리(bordered)', default: true},
      {kind: 'select', key: 'size', label: '크기(size)', options: ['default', 'small', 'large'], default: 'default'},
      {kind: 'select', key: 'itemLayout', label: '항목 배치(itemLayout)', options: ['horizontal', 'vertical'], default: 'horizontal'},
      {kind: 'bool', key: 'loading', label: '로딩(loading)', default: false},
      {kind: 'bool', key: 'split', label: '항목 사이 선(split)', default: true},
    ],
    code: (v) =>
      `import {List} from 'antd';\n\n<List${v.bordered ? ' bordered' : ''}${v.size !== 'default' ? ` size="${v.size}"` : ''}${v.itemLayout !== 'horizontal' ? ` itemLayout="${v.itemLayout}"` : ''}${v.loading ? ' loading' : ''}${v.split ? '' : ' split={false}'}\n  header="공지사항"\n  dataSource={data}\n  renderItem={(item) => <List.Item>{item.title}</List.Item>}\n/>`,
    Preview: ({v}) => (
      <List
        style={{width: '100%', maxWidth: 420}}
        bordered={b(v.bordered)}
        size={s(v.size) as 'default'}
        itemLayout={s(v.itemLayout) as 'horizontal'}
        loading={b(v.loading)}
        split={b(v.split)}
        header="공지사항"
        dataSource={['12월 정기 점검 안내', '신규 기능 출시', '개인정보 처리방침 변경']}
        renderItem={(t) => (
          <List.Item actions={[<a key="v">보기</a>]}>
            <List.Item.Meta avatar={<Avatar icon={<BellOutlined />} />} title={t} description="2026-11-26" />
          </List.Item>
        )}
      />
    ),
  },
  Listy: {
    tag: 'Listy',
    controls: [
      {kind: 'number', key: 'count', label: '항목 수', default: 1000, min: 10, max: 100000, step: 1000},
      {kind: 'number', key: 'height', label: '높이(height)', default: 240, min: 100, max: 500, step: 20},
      {kind: 'bool', key: 'group', label: '묶음(group)', default: false},
      {kind: 'bool', key: 'rowHoverable', label: '올리면 강조(rowHoverable)', default: true},
    ],
    note: '항목이 아주 많아도 보이는 부분만 그려서(가상 스크롤) 빨라요.',
    code: (v) =>
      `import {Listy} from 'antd';\n\n<Listy\n  height={${v.height}}\n  items={items}\n  rowKey="id"\n  itemRender={(item) => <div>{item.name}</div>}${v.group ? "\n  group={{key: (item) => item.dept, title: (key) => <b>{key}</b>}}" : ''}${v.rowHoverable ? '' : '\n  rowHoverable={false}'}\n/>`,
    Preview: ({v}) => {
      const depts = ['개발팀', '영업팀', '생산팀'];
      const items = Array.from({length: Number(v.count)}, (_, i) => ({id: i, name: `직원 ${i + 1}`, dept: depts[Math.floor(i / (Number(v.count) / 3))] ?? '생산팀'}));
      return (
        <div style={{width: '100%', maxWidth: 360, border: '1px solid #f0f0f0', borderRadius: 8}}>
          <Listy
            height={Number(v.height)}
            items={items}
            rowKey="id"
            rowHoverable={b(v.rowHoverable)}
            itemRender={(item) => <div style={{padding: '6px 12px'}}>{item.name}</div>}
            group={b(v.group) ? {key: (item) => item.dept, title: (key) => <b style={{display: 'block', padding: '4px 12px', background: '#fafafa'}}>{String(key)}</b>} : undefined}
          />
        </div>
      );
    },
  },
  Popover: {
    tag: 'Popover',
    controls: [
      {kind: 'text', key: 'title', label: '제목(title)', default: '담당자'},
      {kind: 'text', key: 'content', label: '내용(content)', default: '김철수 · 010-1234-5678'},
      {kind: 'select', key: 'trigger', label: '여는 방법(trigger)', options: ['hover', 'click', 'focus'], default: 'hover'},
      {kind: 'select', key: 'placement', label: '위치(placement)', options: PLACEMENTS, default: 'top'},
      {kind: 'bool', key: 'arrow', label: '화살표(arrow)', default: true},
    ],
    code: (v) =>
      `import {Button, Popover} from 'antd';\n\n<Popover title="${v.title}" content="${v.content}"${v.trigger !== 'hover' ? ` trigger="${v.trigger}"` : ''}${v.placement !== 'top' ? ` placement="${v.placement}"` : ''}${v.arrow ? '' : ' arrow={false}'}>\n  <Button>담당자 보기</Button>\n</Popover>`,
    Preview: ({v}) => (
      <Popover
        title={s(v.title)}
        content={s(v.content)}
        trigger={s(v.trigger) as 'hover'}
        placement={s(v.placement) as 'top'}
        arrow={b(v.arrow)}
      >
        <Button>담당자 보기</Button>
      </Popover>
    ),
  },
  QRCode: {
    tag: 'QRCode',
    controls: [
      {kind: 'text', key: 'value', label: '내용(value)', default: 'https://ant.design'},
      {kind: 'number', key: 'size', label: '크기(size)', default: 160, min: 80, max: 300, step: 10},
      {kind: 'select', key: 'type', label: '그리는 방식(type)', options: ['canvas', 'svg'], default: 'canvas'},
      {kind: 'select', key: 'status', label: '상태(status)', options: ['active', 'expired', 'loading', 'scanned'], default: 'active'},
      {kind: 'select', key: 'errorLevel', label: '오류 복원 수준(errorLevel)', options: ['L', 'M', 'Q', 'H'], default: 'M'},
      {kind: 'bool', key: 'bordered', label: '테두리(bordered)', default: true},
    ],
    Preview: ({v}) => (
      <QRCode
        value={s(v.value) || '-'}
        size={Number(v.size)}
        type={s(v.type) as 'canvas'}
        status={s(v.status) as 'active'}
        errorLevel={s(v.errorLevel) as 'M'}
        bordered={b(v.bordered)}
      />
    ),
  },
  Segmented: {
    tag: 'Segmented',
    controls: [
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
      {kind: 'select', key: 'shape', label: '모양(shape)', options: ['default', 'round'], default: 'default'},
      {kind: 'bool', key: 'block', label: '꽉 차게(block)', default: false},
      {kind: 'bool', key: 'vertical', label: '세로(vertical)', default: false},
      {kind: 'bool', key: 'disabled', label: '비활성(disabled)', default: false},
    ],
    extra: "options={['일간', '주간', '월간']} value={value} onChange={setValue}",
    Preview: function SegmentedPreview({v}) {
      const [value, setValue] = useState('주간');
      return (
        <div style={{width: b(v.block) ? '100%' : undefined}}>
          <Segmented
            options={['일간', '주간', '월간']}
            value={value}
            onChange={setValue}
            size={s(v.size) as 'middle'}
            shape={s(v.shape) as 'default'}
            block={b(v.block)}
            vertical={b(v.vertical)}
            disabled={b(v.disabled)}
          />
        </div>
      );
    },
  },
  Statistic: {
    tag: 'Statistic',
    controls: [
      {kind: 'text', key: 'title', label: '제목(title)', default: '이번 달 매출'},
      {kind: 'number', key: 'value', label: '값(value)', default: 1234567.89, min: 0, max: 100000000, step: 1000},
      {kind: 'number', key: 'precision', label: '소수 자리(precision)', default: 0, min: 0, max: 4},
      {kind: 'text', key: 'prefix', label: '앞 글자(prefix)', default: '₩'},
      {kind: 'text', key: 'suffix', label: '뒤 글자(suffix)', default: ''},
      {kind: 'bool', key: 'loading', label: '로딩(loading)', default: false},
    ],
    Preview: ({v}) => (
      <Statistic
        title={s(v.title)}
        value={Number(v.value)}
        precision={Number(v.precision)}
        prefix={s(v.prefix) || undefined}
        suffix={s(v.suffix) || undefined}
        loading={b(v.loading)}
      />
    ),
  },
  Table: {
    tag: 'Table',
    controls: [
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
      {kind: 'bool', key: 'bordered', label: '칸 테두리(bordered)', default: false},
      {kind: 'bool', key: 'rowSelection', label: '행 선택(rowSelection)', default: false},
      {kind: 'bool', key: 'loading', label: '로딩(loading)', default: false},
      {kind: 'bool', key: 'pagination', label: '쪽 나누기(pagination)', default: true},
      {kind: 'bool', key: 'showHeader', label: '머리글(showHeader)', default: true},
    ],
    note: '「나이」 열 머리글을 누르면 정렬, 「부서」는 필터가 돼요.',
    code: (v) =>
      `import {Table} from 'antd';\n\nconst columns = [\n  {title: '이름', dataIndex: 'name', key: 'name'},\n  {title: '부서', dataIndex: 'dept', key: 'dept',\n    filters: [{text: '개발팀', value: '개발팀'}, {text: '영업팀', value: '영업팀'}],\n    onFilter: (value, row) => row.dept === value},\n  {title: '나이', dataIndex: 'age', key: 'age', sorter: (a, b) => a.age - b.age},\n];\n\n<Table\n  rowKey="id"\n  columns={columns}\n  dataSource={data}${v.size !== 'medium' ? `\n  size="${v.size}"` : ''}${v.bordered ? '\n  bordered' : ''}${v.rowSelection ? '\n  rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}}' : ''}${v.loading ? '\n  loading' : ''}${v.pagination ? '\n  pagination={{pageSize: 10}}' : '\n  pagination={false}'}${v.showHeader ? '' : '\n  showHeader={false}'}\n/>`,
    Preview: ({v}) => (
      <Table
        style={{width: '100%'}}
        size={s(v.size) as 'middle'}
        bordered={b(v.bordered)}
        loading={b(v.loading)}
        showHeader={b(v.showHeader)}
        pagination={b(v.pagination) ? {pageSize: 2} : false}
        rowSelection={b(v.rowSelection) ? {} : undefined}
        dataSource={people}
        columns={[
          {title: '이름', dataIndex: 'name', key: 'name'},
          {
            title: '부서',
            dataIndex: 'dept',
            key: 'dept',
            filters: ['개발팀', '영업팀', '생산팀'].map((d) => ({text: d, value: d})),
            onFilter: (val, row) => row.dept === val,
          },
          {title: '나이', dataIndex: 'age', key: 'age', sorter: (a, z) => a.age - z.age},
        ]}
      />
    ),
  },
  Tag: {
    tag: 'Tag',
    controls: [
      {kind: 'text', key: 'children', label: '글자', default: '진행 중'},
      {kind: 'select', key: 'color', label: '색(color)', options: ['', 'success', 'processing', 'error', 'warning', 'blue', 'green', 'red', 'orange', 'purple', '#f50'], default: ''},
      {kind: 'select', key: 'variant', label: '모양(variant)', options: ['filled', 'solid', 'outlined'], default: 'filled'},
      {kind: 'bool', key: 'closable', label: '닫기 버튼(closable)', default: false},
      {kind: 'bool', key: 'icon', label: '아이콘(icon)', default: false},
    ],
    code: (v) =>
      `import {Tag} from 'antd';\n\n<Tag${v.color ? ` color="${v.color}"` : ''}${v.variant !== 'filled' ? ` variant="${v.variant}"` : ''}${v.closable ? ' closable onClose={() => remove()}' : ''}${v.icon ? ' icon={<CheckCircleOutlined />}' : ''}>${v.children}</Tag>\n\n// 눌러서 켜고 끄는 태그\n<Tag.CheckableTag checked={checked} onChange={setChecked}>선택</Tag.CheckableTag>`,
    Preview: ({v}) => (
      <Tag
        color={s(v.color) || undefined}
        variant={s(v.variant) as 'filled'}
        closable={b(v.closable)}
        icon={b(v.icon) ? <CheckCircleOutlined /> : undefined}
      >
        {s(v.children)}
      </Tag>
    ),
  },
  Timeline: {
    tag: 'Timeline',
    controls: [
      {kind: 'select', key: 'mode', label: '배치(mode)', options: ['start', 'alternate', 'end'], default: 'start'},
      {kind: 'select', key: 'orientation', label: '방향(orientation)', options: ['vertical', 'horizontal'], default: 'vertical'},
      {kind: 'select', key: 'variant', label: '점 모양(variant)', options: ['outlined', 'filled'], default: 'outlined'},
      {kind: 'bool', key: 'reverse', label: '거꾸로(reverse)', default: false},
    ],
    code: (v) =>
      `import {Timeline} from 'antd';\n\n<Timeline${v.mode !== 'start' ? ` mode="${v.mode}"` : ''}${v.orientation !== 'vertical' ? ` orientation="${v.orientation}"` : ''}${v.variant !== 'outlined' ? ` variant="${v.variant}"` : ''}${v.reverse ? ' reverse' : ''}\n  items={[\n    {title: '11-20', content: '주문 접수'},\n    {title: '11-21', content: '결제 완료', color: 'green'},\n    {title: '11-22', content: '배송 중', loading: true},\n  ]}\n/>`,
    Preview: ({v}) => (
      <div style={{width: '100%', paddingTop: 8}}>
        <Timeline
          mode={s(v.mode) as 'start'}
          orientation={s(v.orientation) as 'vertical'}
          variant={s(v.variant) as 'outlined'}
          reverse={b(v.reverse)}
          items={[
            {title: '11-20', content: '주문 접수'},
            {title: '11-21', content: '결제 완료', color: 'green'},
            {title: '11-22', content: '배송 중', loading: true},
          ]}
        />
      </div>
    ),
  },
  Tooltip: {
    tag: 'Tooltip',
    controls: [
      {kind: 'text', key: 'title', label: '도움말(title)', default: '저장하지 않은 내용은 사라져요'},
      {kind: 'select', key: 'placement', label: '위치(placement)', options: PLACEMENTS, default: 'top'},
      {kind: 'select', key: 'trigger', label: '여는 방법(trigger)', options: ['hover', 'click', 'focus'], default: 'hover'},
      {kind: 'text', key: 'color', label: '배경색(color)', default: ''},
      {kind: 'bool', key: 'arrow', label: '화살표(arrow)', default: true},
    ],
    code: (v) =>
      `import {Button, Tooltip} from 'antd';\n\n<Tooltip title="${v.title}"${v.placement !== 'top' ? ` placement="${v.placement}"` : ''}${v.trigger !== 'hover' ? ` trigger="${v.trigger}"` : ''}${v.color ? ` color="${v.color}"` : ''}${v.arrow ? '' : ' arrow={false}'}>\n  <Button>나가기</Button>\n</Tooltip>`,
    Preview: ({v}) => (
      <Tooltip
        title={s(v.title)}
        placement={s(v.placement) as 'top'}
        trigger={s(v.trigger) as 'hover'}
        color={s(v.color) || undefined}
        arrow={b(v.arrow)}
      >
        <Button>나가기</Button>
      </Tooltip>
    ),
  },
  Tour: {
    tag: 'Tour',
    controls: [
      {kind: 'select', key: 'type', label: '종류(type)', options: ['default', 'primary'], default: 'default'},
      {kind: 'bool', key: 'mask', label: '배경 가리개(mask)', default: true},
      {kind: 'bool', key: 'arrow', label: '화살표(arrow)', default: true},
    ],
    code: (v) =>
      `import {Button, Tour} from 'antd';\n\nconst saveRef = useRef(null);\nconst [open, setOpen] = useState(false);\n\n<Button ref={saveRef}>저장</Button>\n<Tour\n  open={open}\n  onClose={() => setOpen(false)}${v.type !== 'default' ? `\n  type="${v.type}"` : ''}${v.mask ? '' : '\n  mask={false}'}${v.arrow ? '' : '\n  arrow={false}'}\n  steps={[\n    {title: '저장', description: '여기를 눌러 저장해요.', target: () => saveRef.current},\n  ]}\n/>`,
    Preview: function TourPreview({v}) {
      const saveRef = useRef<HTMLButtonElement>(null);
      const delRef = useRef<HTMLButtonElement>(null);
      const [open, setOpen] = useState(false);
      return (
        <Space>
          <Button type="primary" onClick={() => setOpen(true)}>
            안내 시작
          </Button>
          <Button ref={saveRef}>저장</Button>
          <Button ref={delRef} danger>
            삭제
          </Button>
          <Tour
            open={open}
            onClose={() => setOpen(false)}
            type={s(v.type) as 'default'}
            mask={b(v.mask)}
            arrow={b(v.arrow)}
            steps={[
              {title: '저장', description: '여기를 눌러 저장해요.', target: () => saveRef.current!},
              {title: '삭제', description: '지운 내용은 되돌릴 수 없어요.', target: () => delRef.current!},
            ]}
          />
        </Space>
      );
    },
  },
  Tree: {
    tag: 'Tree',
    controls: [
      {kind: 'bool', key: 'checkable', label: '체크박스(checkable)', default: false},
      {kind: 'bool', key: 'showLine', label: '연결선(showLine)', default: false},
      {kind: 'bool', key: 'draggable', label: '끌어서 옮기기(draggable)', default: false},
      {kind: 'bool', key: 'defaultExpandAll', label: '모두 펼침(defaultExpandAll)', default: true},
      {kind: 'bool', key: 'blockNode', label: '줄 전체 선택(blockNode)', default: false},
      {kind: 'bool', key: 'multiple', label: '여러 개 선택(multiple)', default: false},
    ],
    extra: 'treeData={treeData} onSelect={(keys) => ...}',
    Preview: ({v}) => (
      <div style={{width: '100%', maxWidth: 320}}>
        <Tree
          key={String(v.defaultExpandAll)}
          treeData={orgTree}
          checkable={b(v.checkable)}
          showLine={b(v.showLine)}
          draggable={b(v.draggable)}
          defaultExpandAll={b(v.defaultExpandAll)}
          blockNode={b(v.blockNode)}
          multiple={b(v.multiple)}
        />
      </div>
    ),
  },
};
