import { Field } from 'common/Field';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { ReactNode } from 'react';

type FieldIcon = {
  id: string;
  icon: ReactNode;
};

const FIELD_ICONS: FieldIcon[] = [
  { id: 'CommunicationMethod', icon: <ForumOutlinedIcon /> },
  { id: 'ContactName', icon: <PersonIcon /> }
];

export function getFieldIcon(field: Field): FieldIcon | undefined {
  return field ? FIELD_ICONS.find((fieldIcon) => fieldIcon.id === field.id) : undefined;
}
