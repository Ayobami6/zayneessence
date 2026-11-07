import type React from 'react';

/**
 * Props for one option of a custom radio group, following the WAI-ARIA radio pattern:
 * the group is a single tab stop (the checked option, or the first when none is checked),
 * and the arrow keys, Home and End move both the selection and focus.
 *
 * Options must be rendered inside an element with role="radiogroup", in the same order as `options`.
 */
export function rovingRadioProps<T extends string>(
  options: readonly T[],
  value: T | undefined,
  onChange: (next: T) => void,
  option: T
) {
  const checked = option === value;
  const hasChecked = value !== undefined && options.includes(value);
  return {
    role: 'radio' as const,
    'aria-checked': checked,
    tabIndex: checked || (!hasChecked && option === options[0]) ? 0 : -1,
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      const index = options.indexOf(option);
      let nextIndex: number;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = (index + 1) % options.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = (index - 1 + options.length) % options.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = options.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      onChange(options[nextIndex]);
      const group = event.currentTarget.closest('[role="radiogroup"]');
      const radios = group ? Array.from(group.querySelectorAll<HTMLElement>('[role="radio"]')) : [];
      radios[nextIndex]?.focus();
    },
  };
}
