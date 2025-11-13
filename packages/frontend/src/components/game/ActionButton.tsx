import { Button, ButtonProps } from '../primitives/Button';

export type GameAction = 'play' | 'move' | 'activate' | 'pass';

export interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
  /**
   * Type of game action
   */
  action: GameAction;
}

const actionLabels: Record<GameAction, string> = {
  play: 'Play Card',
  move: 'Move Unit',
  activate: 'Activate Ability',
  pass: 'Pass Priority',
};

const actionVariants: Record<GameAction, ButtonProps['variant']> = {
  play: 'primary',
  move: 'secondary',
  activate: 'primary',
  pass: 'ghost',
};

/**
 * ActionButton - Game action button with preset labels/variants
 *
 * Actions:
 * - play: Play a card from hand
 * - move: Move a unit between battlefields
 * - activate: Activate a card ability
 * - pass: Pass priority to opponent
 */
export function ActionButton({
  action,
  children,
  ...props
}: ActionButtonProps) {
  return (
    <Button variant={actionVariants[action]} {...props}>
      {children || actionLabels[action]}
    </Button>
  );
}
