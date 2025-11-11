import { useMemo } from 'react';

interface GridLayout {
  gridTemplateColumns: string;
  gridTemplateRows: string;
}

const DEFAULT_COLUMNS = 3;
const DEFAULT_ROWS = 2;
const MAX_COLUMNS = 4;

export default function useGridLayout(participantCount: number): GridLayout {
  const { gridTemplateColumns, gridTemplateRows } = useMemo(() => {
    let cols = DEFAULT_COLUMNS;
    let rows = DEFAULT_ROWS;

    if (participantCount > DEFAULT_COLUMNS * DEFAULT_ROWS) {
      cols = Math.min(MAX_COLUMNS, Math.ceil(Math.sqrt(participantCount)));
      rows = Math.ceil(participantCount / cols);
    }

    return {
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    };
  }, [participantCount]);

  return {
    gridTemplateColumns,
    gridTemplateRows,
  };
}
