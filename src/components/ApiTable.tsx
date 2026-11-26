import {useMemo, useState} from 'react';
import {Empty, Input, Table, Tag, Typography} from 'antd';
import type {ApiDoc, ApiRow} from '../api';
import {API_KO} from '../api-ko';

/* ---------- 속성(API) 표: 한글 설명 우선, 폐지 속성은 맨 아래 ---------- */

export function ApiTable({doc}: {doc: ApiDoc}) {
  const [q, setQ] = useState('');
  const ko = API_KO[doc.slug] ?? {};

  const sections = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return doc.sections
      .map((s) => ({
        section: s.section,
        rows: s.rows
          .filter((r) => r.prop.toLowerCase().includes(needle))
          .sort((a, b) => Number(a.deprecated) - Number(b.deprecated)),
      }))
      .filter((s) => s.rows.length > 0);
  }, [doc, q]);

  if (doc.sections.length === 0) {
    return (
      <Typography.Paragraph type="secondary">
        이 컴포넌트는 속성 표가 없어요. 공식 문서를 참고하세요.
      </Typography.Paragraph>
    );
  }

  const columns = [
    {
      title: '속성',
      dataIndex: 'prop',
      width: 180,
      render: (p: string, r: ApiRow) =>
        r.deprecated ? (
          <>
            <del>{p}</del> <Tag>폐지</Tag>
          </>
        ) : (
          <Typography.Text code>{p}</Typography.Text>
        ),
    },
    {
      title: '설명',
      dataIndex: 'desc',
      width: 380,
      render: (d: string, r: ApiRow) =>
        ko[r.prop] ?? (
          <>
            {d} <Tag bordered={false}>영문</Tag>
          </>
        ),
    },
    {title: '타입', dataIndex: 'type', width: 240, render: (t: string) => <span className="gx-type">{t}</span>},
    {title: '기본값', dataIndex: 'default', width: 110},
    {title: '버전', dataIndex: 'version', width: 80},
  ];

  return (
    <div className="gx-api">
      <Input
        allowClear
        placeholder="속성 이름으로 찾기"
        aria-label="속성 이름으로 찾기"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{maxWidth: 320, marginBottom: 12}}
      />
      {sections.length === 0 && <Empty description="일치하는 속성이 없어요" />}
      {sections.map((s) => (
        <div key={s.section} className="gx-api-section">
          {doc.sections.length > 1 && <Typography.Title level={4}>{s.section}</Typography.Title>}
          <Table<ApiRow>
            size="small"
            pagination={false}
            scroll={{x: 960}}
            rowKey={(r) => `${r.prop}-${r.deprecated}`}
            columns={columns}
            dataSource={s.rows}
          />
        </div>
      ))}
    </div>
  );
}
