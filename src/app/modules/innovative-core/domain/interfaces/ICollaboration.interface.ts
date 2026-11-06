export interface ICollaboration {
  /** Flatten this node (and visible children when expanded) into the render list. */
  collaborate2View(variant?: string): ICollaboration[];
}
