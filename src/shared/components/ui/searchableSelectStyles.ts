import type { CSSObjectWithLabel, ControlProps, OptionProps, GroupBase } from "react-select";

// Estilos personalizados para react-select con mejor visibilidad del texto de búsqueda
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const searchableSelectStyles: any = {
  control: (base: CSSObjectWithLabel, state: ControlProps<unknown, false, GroupBase<unknown>>) => ({
    ...base,
    minHeight: "44px",
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
  input: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#111827",
    fontSize: "16px", // Importante para móviles (evita zoom automático)
    fontWeight: 500,
  }),
  placeholder: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "14px",
  }),
  singleValue: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#111827",
    fontSize: "14px",
  }),
  option: (base: CSSObjectWithLabel, state: OptionProps<unknown, false, GroupBase<unknown>>) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
      ? "#eff6ff"
      : "white",
    color: state.isSelected ? "white" : "#374151",
    padding: "12px 16px",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#dbeafe",
    },
  }),
  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    zIndex: 9999,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    borderRadius: "8px",
    overflow: "hidden",
  }),
  menuList: (base: CSSObjectWithLabel) => ({
    ...base,
    maxHeight: "200px",
    padding: 0,
  }),
  noOptionsMessage: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#6b7280",
    padding: "12px",
  }),
  clearIndicator: (base: CSSObjectWithLabel) => ({
    ...base,
    cursor: "pointer",
    color: "#9ca3af",
    "&:hover": {
      color: "#ef4444",
    },
  }),
  dropdownIndicator: (base: CSSObjectWithLabel) => ({
    ...base,
    cursor: "pointer",
    color: "#9ca3af",
    "&:hover": {
      color: "#3b82f6",
    },
  }),
};

// Función para obtener classNames con estado de error
export const getSelectClassNames = (hasError: boolean) => ({
  control: () => hasError ? "!border-red-500 !shadow-red-100" : "",
});
