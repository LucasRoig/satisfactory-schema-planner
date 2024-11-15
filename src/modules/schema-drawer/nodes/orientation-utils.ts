import { Position } from "@xyflow/react";

const ORIENTATIONS = [Position.Right, Position.Bottom, Position.Left, Position.Top];

function getIndex(orientation: Position) {
  return ORIENTATIONS.indexOf(orientation);
}

function getAtIndex(index: number) {
  const i = index % ORIENTATIONS.length;
  return ORIENTATIONS[i];
}

function rotate(initialOrientation: Position | undefined, delta: number) {
  if (initialOrientation === undefined) {
    return Position.Right;
  }
  const index = getIndex(initialOrientation);
  return getAtIndex(index + delta);
}

export const OrientationUtils = {
  getIndex,
  getAtIndex,
  rotate,
};
