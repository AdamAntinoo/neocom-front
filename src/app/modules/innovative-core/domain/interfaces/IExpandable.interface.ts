export interface IExpandable {
  isExpandable(): boolean;
  isExpanded(): boolean;
  expand(): boolean;
  collapse(): boolean;
  toggleExpanded(): void;
}
