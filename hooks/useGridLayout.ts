'use client';

import { useMemo } from 'react';

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  videoStream?: MediaStream;
}

interface GridLayout {
  gridTemplateColumns: string;
  gridTemplateRows: string;
}

export default function useDailyVideoGrid(
  participants: Participant[]
): GridLayout & { participants: Participant[] } {
  const { gridTemplateColumns, gridTemplateRows } = useMemo(() => {
    const DEFAULT_COLUMNS = 3;
    const DEFAULT_ROWS = 2;
    const MAX_COLUMNS = 4;

    let cols = DEFAULT_COLUMNS;
    let rows = DEFAULT_ROWS;

    if (participants.length > DEFAULT_COLUMNS * DEFAULT_ROWS) {
      cols = Math.min(MAX_COLUMNS, Math.ceil(Math.sqrt(participants.length)));
      rows = Math.ceil(participants.length / cols);
    }

    return {
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    };
  }, [participants.length]);

  return {
    gridTemplateColumns,
    gridTemplateRows,
    participants,
  };
}
