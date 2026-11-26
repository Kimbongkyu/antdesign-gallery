import {useState, type Key} from 'react';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from 'antd';
import {InboxOutlined, UploadOutlined} from '@ant-design/icons';
import type {Demo, Values} from '../demoTypes';
import {b, s} from '../demoTypes';

const SIZES3 = ['small', 'medium', 'large'];
const VARIANTS = ['outlined', 'filled', 'borderless', 'underlined'];
const STATUS = ['', 'error', 'warning'];

// 입력 컴포넌트에 공통으로 붙는 조절 항목
const common = [
  {kind: 'select' as const, key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
  {kind: 'select' as const, key: 'variant', label: '모양(variant)', options: VARIANTS, default: 'outlined'},
  {kind: 'select' as const, key: 'status', label: '상태(status)', options: STATUS, default: ''},
  {kind: 'bool' as const, key: 'disabled', label: '비활성(disabled)', default: false},
];
const commonProps = (v: Values) => ({
  size: s(v.size) as 'middle',
  variant: s(v.variant) as 'outlined',
  status: (s(v.status) || undefined) as 'error' | undefined,
  disabled: b(v.disabled),
});

const fruits = ['사과', '바나나', '포도', '오렌지', '복숭아'].map((x) => ({value: x, label: x}));

const regions = [
  {
    value: 'seoul',
    label: '서울',
    children: [
      {value: 'gangnam', label: '강남구'},
      {value: 'mapo', label: '마포구'},
    ],
  },
  {
    value: 'busan',
    label: '부산',
    children: [
      {value: 'haeundae', label: '해운대구'},
      {value: 'suyeong', label: '수영구'},
    ],
  },
];

const orgTree = [
  {
    value: 'hq',
    title: '본사',
    children: [
      {value: 'dev', title: '개발팀'},
      {value: 'sales', title: '영업팀'},
    ],
  },
  {value: 'factory', title: '공장', children: [{value: 'prod', title: '생산팀'}]},
];

export const ENTRY: Record<string, Demo> = {
  AutoComplete: {
    tag: 'AutoComplete',
    controls: [{kind: 'text', key: 'placeholder', label: '안내 글자(placeholder)', default: '이메일 입력'}, ...common, {kind: 'bool', key: 'allowClear', label: '지우기 버튼(allowClear)', default: false}],
    extra: 'options={options} onSearch={(text) => setOptions(...)}',
    note: '글자를 입력하면 @도메인 후보가 나와요.',
    Preview: function AutoCompletePreview({v}) {
      const [options, setOptions] = useState<{value: string}[]>([]);
      return (
        <AutoComplete
          style={{width: 240}}
          placeholder={s(v.placeholder)}
          allowClear={b(v.allowClear)}
          {...commonProps(v)}
          options={options}
          onSearch={(t) => setOptions(t && !t.includes('@') ? ['gmail.com', 'naver.com', 'daum.net'].map((d) => ({value: `${t}@${d}`})) : [])}
        />
      );
    },
  },
  Cascader: {
    tag: 'Cascader',
    controls: [
      {kind: 'text', key: 'placeholder', label: '안내 글자(placeholder)', default: '지역 선택'},
      ...common,
      {kind: 'bool', key: 'multiple', label: '여러 개(multiple)', default: false},
      {kind: 'bool', key: 'changeOnSelect', label: '중간 단계도 선택(changeOnSelect)', default: false},
      {kind: 'select', key: 'expandTrigger', label: '펼치는 방법(expandTrigger)', options: ['click', 'hover'], default: 'click'},
    ],
    extra: 'options={options} onChange={(value) => ...}',
    Preview: ({v}) => (
      <Cascader
        style={{width: 240}}
        options={regions}
        placeholder={s(v.placeholder)}
        {...commonProps(v)}
        multiple={b(v.multiple) as false}
        changeOnSelect={b(v.changeOnSelect)}
        expandTrigger={s(v.expandTrigger) as 'click'}
      />
    ),
  },
  Checkbox: {
    tag: 'Checkbox',
    controls: [
      {kind: 'text', key: 'children', label: '글자', default: '약관에 동의'},
      {kind: 'bool', key: 'indeterminate', label: '일부 선택 표시(indeterminate)', default: false},
      {kind: 'bool', key: 'disabled', label: '비활성(disabled)', default: false},
      {kind: 'bool', key: 'group', label: 'Checkbox.Group 으로 보기', default: false},
    ],
    code: (v) =>
      v.group
        ? `import {Checkbox} from 'antd';\n\n<Checkbox.Group\n  options={['사과', '바나나', '포도']}\n  value={checked}\n  onChange={setChecked}${v.disabled ? '\n  disabled' : ''}\n/>`
        : `import {Checkbox} from 'antd';\n\n<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}${v.indeterminate ? ' indeterminate' : ''}${v.disabled ? ' disabled' : ''}>${v.children}</Checkbox>`,
    Preview: function CheckboxPreview({v}) {
      const [checked, setChecked] = useState(false);
      const [list, setList] = useState<string[]>(['사과']);
      return b(v.group) ? (
        <Checkbox.Group options={['사과', '바나나', '포도']} value={list} onChange={setList} disabled={b(v.disabled)} />
      ) : (
        <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} indeterminate={b(v.indeterminate)} disabled={b(v.disabled)}>
          {s(v.children)}
        </Checkbox>
      );
    },
  },
  ColorPicker: {
    tag: 'ColorPicker',
    controls: [
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
      {kind: 'bool', key: 'showText', label: '색 값 글자(showText)', default: true},
      {kind: 'bool', key: 'allowClear', label: '지우기(allowClear)', default: false},
      {kind: 'bool', key: 'disabledAlpha', label: '투명도 끄기(disabledAlpha)', default: false},
      {kind: 'select', key: 'trigger', label: '여는 방법(trigger)', options: ['click', 'hover'], default: 'click'},
      {kind: 'bool', key: 'disabled', label: '비활성(disabled)', default: false},
    ],
    extra: 'value={color} onChange={(c) => setColor(c.toHexString())}',
    Preview: function ColorPickerPreview({v}) {
      const [color, setColor] = useState('#1677ff');
      return (
        <ColorPicker
          value={color}
          onChange={(c) => setColor(c.toHexString())}
          size={s(v.size) as 'middle'}
          showText={b(v.showText)}
          allowClear={b(v.allowClear)}
          disabledAlpha={b(v.disabledAlpha)}
          trigger={s(v.trigger) as 'click'}
          disabled={b(v.disabled)}
        />
      );
    },
  },
  DatePicker: {
    tag: 'DatePicker',
    controls: [
      {kind: 'select', key: 'picker', label: '고르는 단위(picker)', options: ['date', 'week', 'month', 'quarter', 'year'], default: 'date'},
      {kind: 'bool', key: 'range', label: '기간(RangePicker)', default: false},
      {kind: 'bool', key: 'showTime', label: '시간까지(showTime)', default: false},
      ...common,
    ],
    code: (v) => {
      const tag = v.range ? 'DatePicker.RangePicker' : 'DatePicker';
      const attrs = [
        v.picker !== 'date' && `picker="${v.picker}"`,
        v.showTime && 'showTime',
        v.size !== 'medium' && `size="${v.size}"`,
        v.variant !== 'outlined' && `variant="${v.variant}"`,
        v.status && `status="${v.status}"`,
        v.disabled && 'disabled',
        'value={value}',
        'onChange={setValue}',
      ].filter(Boolean);
      return `import {DatePicker} from 'antd';\nimport dayjs from 'dayjs';\n\n<${tag} ${attrs.join(' ')} />`;
    },
    note: '값은 dayjs 객체예요. 한글 달력은 ConfigProvider locale={koKR} + dayjs.locale(\'ko\') 로 맞춰요.',
    Preview: ({v}) => {
      const p = {picker: s(v.picker) as 'date', showTime: b(v.showTime), ...commonProps(v)};
      return b(v.range) ? <DatePicker.RangePicker {...p} /> : <DatePicker {...p} />;
    },
  },
  Form: {
    tag: 'Form',
    controls: [
      {kind: 'select', key: 'layout', label: '배치(layout)', options: ['horizontal', 'vertical', 'inline'], default: 'horizontal'},
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
      {kind: 'select', key: 'variant', label: '입력칸 모양(variant)', options: VARIANTS, default: 'outlined'},
      {kind: 'bool', key: 'disabled', label: '전체 비활성(disabled)', default: false},
    ],
    note: '비워둔 채 「저장」을 누르면 검증 메시지가 나와요.',
    code: (v) =>
      `import {Button, Form, Input} from 'antd';\n\nconst [form] = Form.useForm();\n\n<Form\n  form={form}\n  layout="${v.layout}"${v.size !== 'medium' ? `\n  size="${v.size}"` : ''}${v.variant !== 'outlined' ? `\n  variant="${v.variant}"` : ''}${v.disabled ? '\n  disabled' : ''}\n  onFinish={(values) => save(values)}\n>\n  <Form.Item label="이름" name="name" rules={[{required: true, message: '이름을 입력하세요'}]}>\n    <Input />\n  </Form.Item>\n  <Form.Item label="이메일" name="email" rules={[{type: 'email', message: '이메일 형식이 아니에요'}]}>\n    <Input />\n  </Form.Item>\n  <Form.Item>\n    <Button type="primary" htmlType="submit">저장</Button>\n  </Form.Item>\n</Form>`,
    Preview: function FormPreview({v}) {
      const [form] = Form.useForm();
      const [saved, setSaved] = useState('');
      return (
        <Form
          form={form}
          style={{width: '100%', maxWidth: 520}}
          layout={s(v.layout) as 'horizontal'}
          size={s(v.size) as 'middle'}
          variant={s(v.variant) as 'outlined'}
          disabled={b(v.disabled)}
          labelCol={v.layout === 'horizontal' ? {span: 6} : undefined}
          onFinish={(values) => setSaved(JSON.stringify(values))}
        >
          <Form.Item label="이름" name="name" rules={[{required: true, message: '이름을 입력하세요'}]}>
            <Input />
          </Form.Item>
          <Form.Item label="이메일" name="email" rules={[{type: 'email', message: '이메일 형식이 아니에요'}]}>
            <Input />
          </Form.Item>
          <Form.Item label={v.layout === 'horizontal' ? ' ' : undefined} colon={false} extra={saved && `저장한 값: ${saved}`}>
            <Button type="primary" htmlType="submit">
              저장
            </Button>
          </Form.Item>
        </Form>
      );
    },
  },
  Input: {
    tag: 'Input',
    controls: [
      {kind: 'select', key: 'kind', label: '종류', options: ['Input', 'Input.TextArea', 'Input.Password', 'Input.Search', 'Input.OTP'], default: 'Input'},
      {kind: 'text', key: 'placeholder', label: '안내 글자(placeholder)', default: '이름을 입력하세요'},
      ...common,
      {kind: 'bool', key: 'allowClear', label: '지우기 버튼(allowClear)', default: false},
      {kind: 'bool', key: 'showCount', label: '글자 수(showCount)', default: false},
      {kind: 'number', key: 'maxLength', label: '최대 글자 수(maxLength, 0=없음)', default: 0, min: 0, max: 100},
    ],
    code: (v) => {
      const attrs = [
        v.kind !== 'Input.OTP' && v.placeholder && `placeholder="${v.placeholder}"`,
        v.size !== 'medium' && `size="${v.size}"`,
        v.variant !== 'outlined' && `variant="${v.variant}"`,
        v.status && `status="${v.status}"`,
        v.disabled && 'disabled',
        v.allowClear && 'allowClear',
        v.showCount && 'showCount',
        Number(v.maxLength) > 0 && `maxLength={${v.maxLength}}`,
        'value={value}',
        v.kind === 'Input.OTP' ? 'onChange={setValue}' : 'onChange={(e) => setValue(e.target.value)}',
      ].filter(Boolean);
      return `import {Input} from 'antd';\n\n<${v.kind} ${attrs.join(' ')} />`;
    },
    Preview: ({v}) => {
      const p = {
        ...commonProps(v),
        placeholder: s(v.placeholder),
        allowClear: b(v.allowClear),
        showCount: b(v.showCount),
        maxLength: Number(v.maxLength) || undefined,
        style: {width: 280},
      };
      switch (v.kind) {
        case 'Input.TextArea':
          return <Input.TextArea {...p} rows={3} />;
        case 'Input.Password':
          return <Input.Password {...p} />;
        case 'Input.Search':
          return <Input.Search {...p} enterButton />;
        case 'Input.OTP':
          return <Input.OTP size={p.size} variant={p.variant} status={p.status} disabled={p.disabled} />;
        default:
          return <Input {...p} />;
      }
    },
  },
  InputNumber: {
    tag: 'InputNumber',
    controls: [
      {kind: 'number', key: 'min', label: '최소(min)', default: 0, min: -1000, max: 1000},
      {kind: 'number', key: 'max', label: '최대(max)', default: 100, min: -1000, max: 10000},
      {kind: 'number', key: 'step', label: '단위(step)', default: 1, min: 0.1, max: 100, step: 0.1},
      {kind: 'number', key: 'precision', label: '소수 자리(precision)', default: 0, min: 0, max: 4},
      {kind: 'text', key: 'suffix', label: '뒤 글자(suffix)', default: ''},
      {kind: 'select', key: 'mode', label: '버튼 모양(mode)', options: ['input', 'spinner'], default: 'input'},
      ...common,
    ],
    extra: 'value={value} onChange={setValue}',
    Preview: ({v}) => (
      <InputNumber
        style={{width: 180}}
        defaultValue={10}
        min={Number(v.min)}
        max={Number(v.max)}
        step={Number(v.step)}
        precision={Number(v.precision)}
        suffix={s(v.suffix) || undefined}
        mode={s(v.mode) as 'input'}
        {...commonProps(v)}
      />
    ),
  },
  Mentions: {
    tag: 'Mentions',
    controls: [
      {kind: 'text', key: 'placeholder', label: '안내 글자(placeholder)', default: '@를 입력해 보세요'},
      {kind: 'text', key: 'prefix', label: '부르는 글자(prefix)', default: '@'},
      {kind: 'select', key: 'placement', label: '목록 위치(placement)', options: ['bottom', 'top'], default: 'bottom'},
      ...common,
    ],
    extra: "options={[{value: 'kim', label: '김철수'}, ...]}",
    Preview: ({v}) => (
      <Mentions
        style={{width: 280}}
        placeholder={s(v.placeholder)}
        prefix={s(v.prefix) || '@'}
        placement={s(v.placement) as 'bottom'}
        {...commonProps(v)}
        options={[
          {value: 'kim', label: '김철수'},
          {value: 'lee', label: '이영희'},
          {value: 'park', label: '박민수'},
        ]}
      />
    ),
  },
  Radio: {
    tag: 'Radio.Group',
    controls: [
      {kind: 'select', key: 'optionType', label: '모양(optionType)', options: ['default', 'button'], default: 'default'},
      {kind: 'select', key: 'buttonStyle', label: '버튼 스타일(buttonStyle)', options: ['outline', 'solid'], default: 'outline'},
      {kind: 'select', key: 'size', label: '크기(size, 버튼일 때)', options: SIZES3, default: 'medium'},
      {kind: 'bool', key: 'vertical', label: '세로(vertical)', default: false},
      {kind: 'bool', key: 'disabled', label: '비활성(disabled)', default: false},
    ],
    extra: "options={['일간', '주간', '월간']} value={value} onChange={(e) => setValue(e.target.value)}",
    Preview: function RadioPreview({v}) {
      const [value, setValue] = useState('주간');
      return (
        <Radio.Group
          options={['일간', '주간', '월간']}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          optionType={s(v.optionType) as 'default'}
          buttonStyle={s(v.buttonStyle) as 'outline'}
          size={s(v.size) as 'middle'}
          vertical={b(v.vertical)}
          disabled={b(v.disabled)}
        />
      );
    },
  },
  Rate: {
    tag: 'Rate',
    controls: [
      {kind: 'number', key: 'count', label: '별 개수(count)', default: 5, min: 1, max: 10},
      {kind: 'bool', key: 'allowHalf', label: '반 개(allowHalf)', default: false},
      {kind: 'bool', key: 'allowClear', label: '다시 눌러 지우기(allowClear)', default: true},
      {kind: 'select', key: 'size', label: '크기(size)', options: SIZES3, default: 'medium'},
      {kind: 'bool', key: 'disabled', label: '읽기 전용(disabled)', default: false},
    ],
    extra: 'value={value} onChange={setValue}',
    Preview: function RatePreview({v}) {
      const [value, setValue] = useState(3);
      return (
        <Rate
          value={value}
          onChange={setValue}
          count={Number(v.count)}
          allowHalf={b(v.allowHalf)}
          allowClear={b(v.allowClear)}
          size={s(v.size) as 'medium'}
          disabled={b(v.disabled)}
        />
      );
    },
  },
  Select: {
    tag: 'Select',
    controls: [
      {kind: 'text', key: 'placeholder', label: '안내 글자(placeholder)', default: '과일 선택'},
      {kind: 'select', key: 'mode', label: '여러 개(mode)', options: ['', 'multiple', 'tags'], default: ''},
      {kind: 'bool', key: 'showSearch', label: '검색(showSearch)', default: false},
      {kind: 'bool', key: 'allowClear', label: '지우기 버튼(allowClear)', default: false},
      {kind: 'bool', key: 'loading', label: '로딩(loading)', default: false},
      ...common,
    ],
    extra: "options={[{value: 'apple', label: '사과'}, ...]} value={value} onChange={setValue}",
    Preview: ({v}) => (
      <Select
        style={{width: 240}}
        options={fruits}
        placeholder={s(v.placeholder)}
        mode={(s(v.mode) || undefined) as 'multiple'}
        showSearch={b(v.showSearch)}
        allowClear={b(v.allowClear)}
        loading={b(v.loading)}
        {...commonProps(v)}
      />
    ),
  },
  Slider: {
    tag: 'Slider',
    controls: [
      {kind: 'number', key: 'min', label: '최소(min)', default: 0, min: -100, max: 100},
      {kind: 'number', key: 'max', label: '최대(max)', default: 100, min: 1, max: 1000},
      {kind: 'number', key: 'step', label: '단위(step)', default: 1, min: 1, max: 50},
      {kind: 'bool', key: 'range', label: '범위(range)', default: false},
      {kind: 'bool', key: 'dots', label: '눈금 점(dots)', default: false},
      {kind: 'bool', key: 'marks', label: '눈금 글자(marks)', default: false},
      {kind: 'bool', key: 'disabled', label: '비활성(disabled)', default: false},
    ],
    extra: 'value={value} onChange={setValue}',
    Preview: ({v}) => {
      const p = {
        min: Number(v.min),
        max: Number(v.max),
        step: Number(v.step),
        dots: b(v.dots),
        disabled: b(v.disabled),
        marks: b(v.marks) ? {[Number(v.min)]: '최소', [Number(v.max)]: '최대'} : undefined,
        style: {width: 280},
      };
      return b(v.range) ? <Slider range defaultValue={[20, 60]} {...p} /> : <Slider defaultValue={30} {...p} />;
    },
  },
  Switch: {
    tag: 'Switch',
    controls: [
      {kind: 'select', key: 'size', label: '크기(size)', options: ['medium', 'small'], default: 'medium'},
      {kind: 'text', key: 'checkedChildren', label: '켜짐 글자(checkedChildren)', default: ''},
      {kind: 'text', key: 'unCheckedChildren', label: '꺼짐 글자(unCheckedChildren)', default: ''},
      {kind: 'bool', key: 'loading', label: '로딩(loading)', default: false},
      {kind: 'bool', key: 'disabled', label: '비활성(disabled)', default: false},
    ],
    extra: 'checked={on} onChange={setOn}',
    Preview: function SwitchPreview({v}) {
      const [on, setOn] = useState(true);
      return (
        <Switch
          checked={on}
          onChange={setOn}
          size={s(v.size) as 'small'}
          checkedChildren={s(v.checkedChildren) || undefined}
          unCheckedChildren={s(v.unCheckedChildren) || undefined}
          loading={b(v.loading)}
          disabled={b(v.disabled)}
        />
      );
    },
  },
  TimePicker: {
    tag: 'TimePicker',
    controls: [
      {kind: 'select', key: 'format', label: '형식(format)', options: ['HH:mm:ss', 'HH:mm', 'h:mm a'], default: 'HH:mm:ss'},
      {kind: 'number', key: 'minuteStep', label: '분 단위(minuteStep)', default: 1, min: 1, max: 30},
      {kind: 'bool', key: 'use12Hours', label: '12시간제(use12Hours)', default: false},
      {kind: 'bool', key: 'range', label: '기간(RangePicker)', default: false},
      ...common,
    ],
    code: (v) =>
      `import {TimePicker} from 'antd';\n\n<${v.range ? 'TimePicker.RangePicker' : 'TimePicker'} format="${v.format}"${Number(v.minuteStep) > 1 ? ` minuteStep={${v.minuteStep}}` : ''}${v.use12Hours ? ' use12Hours' : ''}${v.size !== 'medium' ? ` size="${v.size}"` : ''}${v.variant !== 'outlined' ? ` variant="${v.variant}"` : ''}${v.status ? ` status="${v.status}"` : ''}${v.disabled ? ' disabled' : ''} value={value} onChange={setValue} />`,
    Preview: ({v}) => {
      const p = {
        format: s(v.format),
        minuteStep: Number(v.minuteStep) as 1,
        use12Hours: b(v.use12Hours),
        ...commonProps(v),
      };
      return b(v.range) ? <TimePicker.RangePicker {...p} /> : <TimePicker {...p} />;
    },
  },
  Transfer: {
    tag: 'Transfer',
    controls: [
      {kind: 'bool', key: 'showSearch', label: '검색(showSearch)', default: false},
      {kind: 'bool', key: 'oneWay', label: '한 방향만(oneWay)', default: false},
      {kind: 'bool', key: 'disabled', label: '비활성(disabled)', default: false},
    ],
    extra: "dataSource={data} targetKeys={targetKeys} onChange={setTargetKeys} render={(item) => item.title} titles={['전체', '선택됨']}",
    Preview: function TransferPreview({v}) {
      const data = ['김철수', '이영희', '박민수', '최지우', '정다은'].map((t, i) => ({key: String(i), title: t}));
      const [target, setTarget] = useState<Key[]>(['1']);
      return (
        <Transfer
          dataSource={data}
          targetKeys={target}
          onChange={setTarget}
          render={(item) => item.title}
          titles={['전체', '선택됨']}
          showSearch={b(v.showSearch)}
          oneWay={b(v.oneWay)}
          disabled={b(v.disabled)}
        />
      );
    },
  },
  TreeSelect: {
    tag: 'TreeSelect',
    controls: [
      {kind: 'text', key: 'placeholder', label: '안내 글자(placeholder)', default: '부서 선택'},
      {kind: 'bool', key: 'treeCheckable', label: '체크박스(treeCheckable)', default: false},
      {kind: 'bool', key: 'multiple', label: '여러 개(multiple)', default: false},
      {kind: 'bool', key: 'treeDefaultExpandAll', label: '모두 펼침(treeDefaultExpandAll)', default: true},
      {kind: 'bool', key: 'showSearch', label: '검색(showSearch)', default: false},
      ...common,
    ],
    extra: 'treeData={treeData} value={value} onChange={setValue}',
    Preview: ({v}) => (
      <TreeSelect
        style={{width: 260}}
        treeData={orgTree}
        placeholder={s(v.placeholder)}
        treeCheckable={b(v.treeCheckable)}
        multiple={b(v.multiple)}
        treeDefaultExpandAll={b(v.treeDefaultExpandAll)}
        showSearch={b(v.showSearch)}
        {...commonProps(v)}
      />
    ),
  },
  Upload: {
    tag: 'Upload',
    controls: [
      {kind: 'select', key: 'listType', label: '목록 모양(listType)', options: ['text', 'picture', 'picture-card', 'picture-circle'], default: 'text'},
      {kind: 'bool', key: 'dragger', label: '끌어다 놓기(Upload.Dragger)', default: false},
      {kind: 'bool', key: 'multiple', label: '여러 파일(multiple)', default: false},
      {kind: 'number', key: 'maxCount', label: '최대 개수(maxCount, 0=무제한)', default: 0, min: 0, max: 10},
      {kind: 'bool', key: 'disabled', label: '비활성(disabled)', default: false},
    ],
    note: '미리보기에서는 실제로 올리지 않아요(beforeUpload 가 false 를 돌려줌).',
    code: (v) => {
      const tag = v.dragger ? 'Upload.Dragger' : 'Upload';
      const attrs = [
        'action="/api/upload"',
        v.listType !== 'text' && `listType="${v.listType}"`,
        v.multiple && 'multiple',
        Number(v.maxCount) > 0 && `maxCount={${v.maxCount}}`,
        v.disabled && 'disabled',
        'fileList={fileList}',
        'onChange={({fileList}) => setFileList(fileList)}',
      ].filter(Boolean);
      return `import {Button, Upload} from 'antd';\nimport {UploadOutlined} from '@ant-design/icons';\n\n<${tag} ${attrs.join(' ')}>\n  ${v.dragger ? '<p>파일을 끌어다 놓거나 눌러서 선택</p>' : '<Button icon={<UploadOutlined />}>파일 선택</Button>'}\n</${tag}>`;
    },
    Preview: ({v}) => {
      const p = {
        beforeUpload: () => false,
        listType: s(v.listType) as 'text' | 'picture' | 'picture-card' | 'picture-circle',
        multiple: b(v.multiple),
        maxCount: Number(v.maxCount) || undefined,
        disabled: b(v.disabled),
      };
      if (b(v.dragger))
        return (
          <div style={{width: '100%'}}>
            <Upload.Dragger {...p}>
              <p style={{fontSize: 32, margin: 0}}>
                <InboxOutlined />
              </p>
              <p>파일을 끌어다 놓거나 눌러서 선택</p>
            </Upload.Dragger>
          </div>
        );
      const card = p.listType === 'picture-card' || p.listType === 'picture-circle';
      return <Upload {...p}>{card ? '+ 올리기' : <Button icon={<UploadOutlined />}>파일 선택</Button>}</Upload>;
    },
  },
};
