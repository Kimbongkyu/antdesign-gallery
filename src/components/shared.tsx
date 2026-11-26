import {useState} from 'react';
import {Button} from 'antd';
import {StarFilled, StarOutlined} from '@ant-design/icons';
import type {useFavorites} from '../favorites';

export type FavApi = ReturnType<typeof useFavorites>;

/* ---------- 작은 부품들 ---------- */

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyButton({text, label = '복사'}: {text: string; label?: string}) {
  const [done, setDone] = useState(false);
  return (
    <Button
      size="small"
      onClick={async () => {
        const ok = await copyText(text);
        setDone(ok);
        window.setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? '복사됨' : label}
    </Button>
  );
}

export function Star({on, onClick, name, className}: {on: boolean; onClick: () => void; name: string; className?: string}) {
  return (
    <Button
      className={className}
      type="text"
      aria-label={`${name} 즐겨찾기 ${on ? '해제' : '추가'}`}
      icon={on ? <StarFilled className="gx-star on" /> : <StarOutlined className="gx-star" />}
      onClick={onClick}
    />
  );
}
