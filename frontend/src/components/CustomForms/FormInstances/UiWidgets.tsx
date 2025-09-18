// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { RegistryWidgetsType, WidgetProps } from '@rjsf/utils';
import { Widgets } from '@rjsf/mui';
import { Box, Typography } from '@mui/material';

const { SelectWidget } = Widgets;

const selectWidget = (props: WidgetProps) => (
  <Box display="flex" flexDirection="column" gap={1}>
    <Typography
      component="span"
      id={`${props.id}-label`}
      sx={{
        color: (props.rawErrors?.length ?? 0) > 0 ? '#EB2626' : 'initial',
        fontWeight: 'bold',
        whiteSpace: 'normal'
      }}
    >
      {props.label}{' '}
    </Typography>
    <SelectWidget
      {...props}
      variant="filled"
      aria-labelledby={`${props.id}-label`}
      label={props.value ? '' : 'Select...'}
      required={false}
      error={false}
      sx={{
        '.MuiSelect-select': { paddingTop: '17px', paddingBottom: '16px', color: '#3670b3' },
        '.MuiFormLabel-root': { transform: 'translate(12px, 15px)', transformOrigin: 'initial' },
        '.MuiSvgIcon-root': { color: '#3670b3' }
      }}
    />
  </Box>
);
export const UiWidgets: RegistryWidgetsType = {
  SelectWidget: selectWidget
};
