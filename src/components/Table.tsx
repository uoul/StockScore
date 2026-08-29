import type React from "react";
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import DownIcon from "../assets/DownIcon";
import UpIcon from "../assets/UpIcon";
import UpDownIcon from "../assets/UpDownIcon";


export interface Column<T> {
  name: string;
  renderCell: (c: T, idx: number) => React.ReactNode;
  sortFunc?: (a: T, b: T) => number;
}

const Table = <T extends any>({ cols, rows, onRowClick, className, headerClass, rowClass, colClass }: { cols: Column<T>[], rows: T[], onRowClick?: (row: T) => void, className?: string, headerClass?: string, rowClass?: string, colClass?: string }) => {
  const [sort, setSort] = useState<{ col: Column<T>, dir: "asc" | "desc" }>()

  const sortedRows = useMemo<T[]>(() => {
    const rowsCopy = [...rows];
    if (sort && sort.col.sortFunc) {
      const sortFunc = sort.col.sortFunc;     // ← captured, narrowed
      const dir = sort.dir;                   // ← captured too
      return rowsCopy.sort((a, b) =>
        dir == "desc" ? -1 * sortFunc(a, b) : sortFunc(a, b)
      );
    }
    return rowsCopy;
  }, [rows, sort]);


  const updateSort = (col: Column<T>) => {
    if (sort && col.name == sort.col.name) {
      if (sort.dir == "desc") {
        setSort(undefined)
      } else {
        setSort({ col: col, dir: "desc" })
      }
    } else {
      setSort({ col: col, dir: "asc" })
    }
  }

  const renderSortIcon = (col: Column<T>) => {
    if(!col.sortFunc) return
    return (
      <span className="ml-1 opacity-40">
        {!sort || col !== sort.col ?
          <span className="opacity-80"><UpDownIcon className="h-4" /></span>
          :
          <span className="opacity-80">{sort.dir === "asc" ? <UpIcon className="h-4" /> : <DownIcon className="h-4" />}</span>
        }
      </span>
    )
  };

  return (
    <table className={`table  ${className}`}>
      <thead>
        <tr className={`${headerClass}`}>
          {cols.map((c) => (
            <th key={uuidv4()} onClick={() => updateSort(c)}><div className="flex items-center cursor-pointer select-none">{c.name} {renderSortIcon(c)}</div></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((r, idx) => (
          <tr key={uuidv4()} onClick={() => onRowClick ? onRowClick(r) : undefined} className={`${rowClass}`}>
            {cols.map((c) => (
              <td key={uuidv4()} className={`${colClass}`}>{c.renderCell(r, idx)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default Table;