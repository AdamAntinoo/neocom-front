export interface ISelectable {
  isSelected(): boolean;
  select(): void;
  unselect(): void;
  toggleSelected(): boolean;
}
