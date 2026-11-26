import {Flex, Tag, Typography} from 'antd';
import {ArrowLeftOutlined, ExportOutlined} from '@ant-design/icons';
import {API_DOCS} from '../api';
import {DEMOS} from '../demos';
import {BY_NAME, GROUPS, docsUrl} from '../registry';
import {ApiTable} from './ApiTable';
import {Playground} from './Playground';
import {Star, type FavApi} from './shared';

const {Title, Paragraph} = Typography;

type Props = {name: string; fav: FavApi; backHref: string; backLabel: string};

export function Detail({name, fav, backHref, backLabel}: Props) {
  const e = BY_NAME[name];
  const g = GROUPS.find((x) => x.id === e.group)!;
  return (
    <article className="gx-detail">
      <a href={backHref} className="gx-back">
        <ArrowLeftOutlined /> {backLabel}
      </a>
      <Flex align="center" gap={8} wrap>
        <Title level={2} style={{margin: 0}}>
          {e.name} <span className="gx-ko">{e.ko}</span>
        </Title>
        <Tag>{g.label}</Tag>
        <Star on={fav.favs.includes(e.name)} onClick={() => fav.toggle(e.name)} name={e.ko} />
      </Flex>
      <Paragraph type="secondary" style={{marginTop: 8}}>
        {e.desc}
      </Paragraph>

      <Title level={3}>바로 해보기</Title>
      {DEMOS[name] ? <Playground name={name} /> : <Paragraph type="secondary">아직 바로 해보기가 없어요.</Paragraph>}

      <Title level={3}>속성</Title>
      <ApiTable doc={API_DOCS[e.slug]} />

      <Paragraph style={{marginTop: 24}}>
        <a href={docsUrl(e)} target="_blank" rel="noreferrer">
          공식 문서(영문) <ExportOutlined />
        </a>
      </Paragraph>
    </article>
  );
}
