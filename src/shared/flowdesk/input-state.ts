import { sampleText } from './fixtures';

export function valueOnIntakeFocus(value: string) {
  return value === sampleText ? '' : value;
}

export function valueOnIntakeBlur(value: string) {
  return value.trim() ? value : sampleText;
}
