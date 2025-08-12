// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { render, screen, fireEvent } from '@testing-library/react';
import DataList, { type ListRow } from '../DataList';

describe('DataList component', () => {
  const mockItems: ListRow[] = [
    {
      key: 'item1',
      title: 'First Item',
      content: 'This is the content for the first item',
      footer: 'Footer text',
      metaRight: 'Meta info'
    },
    {
      key: 'item2',
      title: 'Second Item',
      emphasizeTitle: true,
      titleDot: <div>•</div>,
      onClick: jest.fn()
    }
  ];

  it('renders list items correctly', () => {
    render(<DataList items={mockItems} />);

    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
    expect(screen.getByText('This is the content for the first item')).toBeInTheDocument();
    expect(screen.getByText('Footer text')).toBeInTheDocument();
    expect(screen.getByText('Meta info')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const mockOnClick = jest.fn();
    const clickableItems: ListRow[] = [
      {
        key: 'clickable',
        title: 'Clickable Item',
        onClick: mockOnClick
      }
    ];

    render(<DataList items={clickableItems} />);

    const listItem = screen.getByRole('listitem');
    fireEvent.click(listItem);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders title dots when present', () => {
    const itemsWithDots: ListRow[] = [
      {
        key: 'with-dot',
        title: 'Item with dot',
        titleDot: <span data-testid="dot">•</span>
      },
      {
        key: 'without-dot',
        title: 'Item without dot'
      }
    ];

    render(<DataList items={itemsWithDots} />);

    expect(screen.getByTestId('dot')).toBeInTheDocument();
  });

  it('emphasizes titles when specified', () => {
    const itemsWithEmphasis: ListRow[] = [
      {
        key: 'emphasized',
        title: 'Emphasized Title',
        emphasizeTitle: true
      }
    ];

    render(<DataList items={itemsWithEmphasis} />);

    const title = screen.getByText('Emphasized Title');
    expect(title).toHaveStyle('font-weight: 700');
  });

  it('renders empty list when no items provided', () => {
    render(<DataList items={[]} />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list).toBeEmptyDOMElement();
  });

  it('applies cursor pointer style for clickable items', () => {
    const clickableItems: ListRow[] = [
      {
        key: 'clickable',
        title: 'Clickable Item',
        onClick: jest.fn()
      }
    ];

    render(<DataList items={clickableItems} />);

    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveStyle('cursor: pointer');
  });

  it('applies default cursor for non-clickable items', () => {
    const nonClickableItems: ListRow[] = [
      {
        key: 'non-clickable',
        title: 'Non-clickable Item'
      }
    ];

    render(<DataList items={nonClickableItems} />);

    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveStyle('cursor: default');
  });

  it('applies correct gap when no items have dots', () => {
    const itemsWithoutDots: ListRow[] = [
      {
        key: 'item1',
        title: 'Item One'
      },
      {
        key: 'item2',
        title: 'Item Two'
      }
    ];

    render(<DataList items={itemsWithoutDots} />);

    const containerBoxes = screen.getAllByTestId('list-item-container');
    expect(containerBoxes[0]).toHaveStyle('gap: 0px');
  });
});
