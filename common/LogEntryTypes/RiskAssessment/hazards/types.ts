export type Hazard = {
  id: string;
  label: string;
  description?: string;
  defaultOpen?: boolean;
  risks: string;
  applicableControls: Array<{ id: string, label: string }>;
}
