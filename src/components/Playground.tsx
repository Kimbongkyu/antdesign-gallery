import {useState} from 'react';
import {Card, Input, InputNumber, Select, Switch, Typography} from 'antd';
import {DEMOS, buildCode, defaultValues, type Control, type Values} from '../demos';
import {PreviewBoundary} from './PreviewBoundary';
import {CopyButton} from './shared';

/* ---------- 속성 조절 패널 ---------- */

type V = string | boolean | number;

function ControlRow({c, value, onChange}: {c: Control; value: V; onChange: (v: V) => void}) {
  switch (c.kind) {
    case 'bool':
      return (
        <label className="gx-ctl gx-ctl-bool">
          <Switch size="small" checked={value === true} onChange={onChange} aria-label={c.label} />
          <span>{c.label}</span>
        </label>
      );
    case 'text':
      return (
        <label className="gx-ctl">
          <span>{c.label}</span>
          <Input size="small" aria-label={c.label} value={String(value)} onChange={(e) => onChange(e.target.value)} />
        </label>
      );
    case 'number':
      return (
        <label className="gx-ctl">
          <span>{c.label}</span>
          <InputNumber
            size="small"
            aria-label={c.label}
            value={Number(value)}
            min={c.min}
            max={c.max}
            step={c.step ?? 1}
            onChange={(v) => onChange(v ?? c.default)}
            style={{width: '100%'}}
          />
        </label>
      );
    case 'select':
      return (
        <div className="gx-ctl">
          <span>{c.label}</span>
          <Select
            size="small"
            aria-label={c.label}
            value={String(value)}
            options={c.options.map((o) => ({value: o, label: o}))}
            onChange={onChange}
          />
        </div>
      );
  }
}

export function Playground({name}: {name: string}) {
  const demo = DEMOS[name];
  const [values, setValues] = useState<Values>(() => defaultValues(demo));
  const code = buildCode(demo, values);
  const {Preview} = demo;
  return (
    <section className="gx-play">
      <Card className="gx-stage" size="small">
        {demo.noPreview ? (
          <Typography.Text type="secondary">{demo.noPreview}</Typography.Text>
        ) : (
          <PreviewBoundary key={JSON.stringify(values)}>
            <Preview v={values} />
          </PreviewBoundary>
        )}
      </Card>
      {demo.note && <Typography.Paragraph type="secondary">{demo.note}</Typography.Paragraph>}
      {demo.controls.length > 0 && (
        <div className="gx-ctls">
          {demo.controls.map((c) => (
            <ControlRow
              key={c.key}
              c={c}
              value={values[c.key]}
              onChange={(v) => setValues((prev) => ({...prev, [c.key]: v}))}
            />
          ))}
        </div>
      )}
      <div className="gx-code">
        <div className="gx-code-bar">
          <Typography.Text strong>코드</Typography.Text>
          <CopyButton text={code} label="코드 복사" />
        </div>
        <pre data-testid="code">{code}</pre>
      </div>
    </section>
  );
}
