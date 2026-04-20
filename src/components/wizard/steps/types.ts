export interface StepHandle {
  /** Returns true if validation passed and data was saved. */
  submit: () => Promise<boolean>;
}
