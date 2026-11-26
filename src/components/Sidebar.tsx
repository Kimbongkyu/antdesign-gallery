import {Badge, Drawer, Menu, type MenuProps} from 'antd';
import {AppstoreOutlined, StarOutlined} from '@ant-design/icons';
import {ENTRIES, GROUPS} from '../registry';

type Props = {
  activeKey: string; // 'all' | 'fav' | 그룹 id
  favCount: number;
  isMobile: boolean;
  open: boolean;
  onClose: () => void;
};

const KEY_HASH = (key: string) => (key === 'all' ? '#/' : key === 'fav' ? '#/fav' : `#/g/${key}`);

export function Sidebar({activeKey, favCount, isMobile, open, onClose}: Props) {
  const items: MenuProps['items'] = [
    {key: 'all', icon: <AppstoreOutlined />, label: `전체 ${ENTRIES.length}`},
    {key: 'fav', icon: <StarOutlined />, label: <span>즐겨찾기 <Badge count={favCount} size="small" color="#faad14" /></span>},
    {type: 'divider'},
    ...GROUPS.map((g) => ({
      key: g.id,
      label: (
        <span className="gx-side-item">
          <span>{g.label}</span>
          <span className="gx-side-count">{ENTRIES.filter((e) => e.group === g.id).length}</span>
        </span>
      ),
    })),
  ];
  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[activeKey]}
      items={items}
      onClick={({key}) => {
        window.location.hash = KEY_HASH(key);
        onClose();
      }}
    />
  );
  if (isMobile) {
    return (
      <Drawer title="그룹" placement="left" open={open} onClose={onClose} size={260}>
        {menu}
      </Drawer>
    );
  }
  return <aside className="gx-side">{menu}</aside>;
}
