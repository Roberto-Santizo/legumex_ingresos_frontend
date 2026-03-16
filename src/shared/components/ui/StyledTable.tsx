import type { ReactNode } from "react";
import { Link } from "react-router-dom";

// ============================================
// TIPOS
// ============================================
interface TableContainerProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  title: string;
  linkTo?: string;
  linkText?: string;
  children?: ReactNode;
}

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeadProps {
  children: ReactNode;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

interface TableEmptyProps {
  message?: string;
}

interface TableActionsProps {
  children: ReactNode;
  align?: "left" | "center" | "right";
}

// ============================================
// COMPONENTES
// ============================================

const TableContainer = ({ children, className = "" }: TableContainerProps) => (
  <div className={`table-container ${className}`}>
    {children}
  </div>
);

const TableHeader = ({ title, linkTo, linkText = "Crear", children }: TableHeaderProps) => (
  <div className="table-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
    <h2 className="table-title">{title}</h2>
    {children ? children : (
      linkTo && (
        <Link to={linkTo} className="btn-primary whitespace-nowrap">
          {linkText}
        </Link>
      )
    )}
  </div>
);

const Table = ({ children, className = "" }: TableProps) => (
  <div className="overflow-x-auto">
    <table className={`table ${className}`}>
      {children}
    </table>
  </div>
);

const TableHead = ({ children }: TableHeadProps) => (
  <thead>{children}</thead>
);

const TableBody = ({ children }: TableBodyProps) => (
  <tbody>{children}</tbody>
);

const TableRow = ({ children, className = "" }: TableRowProps) => (
  <tr className={className}>{children}</tr>
);

const Th = ({ children, align = "left", className = "" }: TableCellProps) => {
  const alignClass = align === "center" ? "table-cell-center" : align === "right" ? "table-cell-right" : "";
  return <th className={`${alignClass} ${className}`}>{children}</th>;
};

const Td = ({ children, align = "left", className = "" }: TableCellProps) => {
  const alignClass = align === "center" ? "table-cell-center" : align === "right" ? "table-cell-right" : "";
  return <td className={`${alignClass} ${className}`}>{children}</td>;
};

const TableEmpty = ({ message = "No hay datos registrados." }: TableEmptyProps) => (
  <p className="text-center py-10 text-gray-500">{message}</p>
);

const TableActions = ({ children, align = "center" }: TableActionsProps) => {
  const alignClass = align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";
  return <div className={`table-actions ${alignClass}`}>{children}</div>;
};

export {
  TableContainer,
  TableHeader,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Th,
  Td,
  TableEmpty,
  TableActions,
};