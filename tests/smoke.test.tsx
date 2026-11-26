import {render, screen} from '@testing-library/react';
import {Root} from '../src/main';

test('앱 제목이 보인다', () => {
  render(<Root />);
  expect(screen.getByText('Ant Design 둘러보기')).toBeInTheDocument();
});
