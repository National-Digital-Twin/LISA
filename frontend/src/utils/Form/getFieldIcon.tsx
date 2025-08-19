import { Field } from 'common/Field';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { ReactNode } from 'react';

type FieldIcon = {
  id: string;
  icon: ReactNode;
};

const FIELD_ICONS: FieldIcon[] = [
  { id: 'CommunicationMethod', icon: <ForumOutlinedIcon /> },
  { id: 'ContactName', icon: <PersonOutlineOutlinedIcon /> }
];

export function getFieldIcon(field: Field): FieldIcon | undefined {
  return field ? FIELD_ICONS.find((fieldIcon) => fieldIcon.id === field.id) : undefined;
}
