import {Card, Empty, Tag, Typography} from 'antd';
import {DEMOS} from '../demos';
import type {Entry} from '../registry';
import {Star, type FavApi} from './shared';

function EntryCard({entry, fav}: {entry: Entry; fav: FavApi}) {
  const on = fav.favs.includes(entry.name);
  return (
    <li className="gx-card" id={`card-${entry.name}`} data-testid="card" data-name={entry.name}>
      <a href={`#/c/${entry.name}`} aria-label={`${entry.ko} (${entry.name}) 자세히 보기`}>
        <Card size="small" hoverable>
          <div className="gx-card-head">
            <Typography.Text strong>{entry.name}</Typography.Text>
            {DEMOS[entry.name] && <Tag color="green">바로 해보기</Tag>}
          </div>
          <Typography.Text type="secondary">{entry.ko}</Typography.Text>
          <Typography.Paragraph type="secondary" className="gx-card-desc">
            {entry.desc}
          </Typography.Paragraph>
        </Card>
      </a>
      <Star className="gx-card-star" on={on} onClick={() => fav.toggle(entry.name)} name={entry.ko} />
    </li>
  );
}

export function CardList({entries, fav}: {entries: Entry[]; fav: FavApi}) {
  if (!entries.length) return <Empty description="해당하는 컴포넌트가 없어요." />;
  return (
    <ul className="gx-cards">
      {entries.map((e) => (
        <EntryCard key={e.name} entry={e} fav={fav} />
      ))}
    </ul>
  );
}
