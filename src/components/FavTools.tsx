import {useState} from 'react';
import {Alert, Button, Collapse, Input, Space, Typography} from 'antd';
import {exportText, parseImport} from '../favorites';
import {BY_NAME} from '../registry';
import {CopyButton, type FavApi} from './shared';

/* ---------- 즐겨찾기 백업/복원 ---------- */

const KNOWN = new Set(Object.keys(BY_NAME));

export function FavTools({fav}: {fav: FavApi}) {
  const [text, setText] = useState('');
  const [added, setAdded] = useState<number | null>(null);
  return (
    <Collapse
      items={[
        {
          key: 'move',
          label: '다른 기기로 즐겨찾기 옮기기',
          children: (
            <Space orientation="vertical" style={{width: '100%'}}>
              <Typography.Text type="secondary">
                즐겨찾기는 이 기기의 브라우저에만 저장돼요. 다른 기기로 옮기려면 복사해서 붙여넣으세요.
              </Typography.Text>
              <CopyButton text={exportText(fav.favs)} label="내 즐겨찾기 복사" />
              <Input.TextArea
                aria-label="가져올 즐겨찾기"
                rows={2}
                placeholder="다른 기기에서 복사한 내용을 붙여넣기"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button
                onClick={() => {
                  const fresh = parseImport(text, KNOWN).filter((n) => !fav.favs.includes(n));
                  fav.merge(fresh);
                  setAdded(fresh.length);
                  setText('');
                }}
              >
                가져오기
              </Button>
              {added !== null &&
                (added ? (
                  <Alert type="success" title={`${added}개를 새로 담았어요.`} />
                ) : (
                  <Alert type="warning" title="새로 담을 이름이 없어요." />
                ))}
            </Space>
          ),
        },
      ]}
    />
  );
}
