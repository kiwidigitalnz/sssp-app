/**
 * Component documentation template
 * 
 * @component ComponentName
 * @description Brief description of what the component does
 * 
 * @example
 * ```tsx
 * <ComponentName prop1="value" prop2={value} />
 * ```
 * 
 * @props
 * @prop {type} propName - Description of the prop
 * 
 * @returns {JSX.Element} Description of what the component renders
 */

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormComponentProps<T = any> extends BaseComponentProps {
  onSubmit: (data: T) => Promise<void> | void;
  initialData?: Partial<T>;
  isLoading?: boolean;
}

export interface DialogProps extends BaseComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface SelectionProps<T = string> extends BaseComponentProps {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}