import { RegistryWidgetsType, WidgetProps } from '@rjsf/utils';
import { Widgets } from '@rjsf/mui';
import { Box, Typography } from '@mui/material';

const { SelectWidget } = Widgets;

const selectWidget = (props: WidgetProps) => (
  <Box display="flex" flexDirection="column" gap={1}>
    <Typography
      component="span"
      id={`${props.id}-label`}
      sx={{ color: 'text.primary', fontWeight: 'bold', whiteSpace: 'normal' }}
    >
      {props.label}{' '}
    </Typography>
    <SelectWidget
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      variant="filled"
      aria-labelledby={`${props.id}-label`}
      hiddenLabel
    />
  </Box>
);
export const EntryWidgets: RegistryWidgetsType = {
  SelectWidget: selectWidget
};
