import { BaseInputTemplateProps } from '@rjsf/utils';
import { Templates } from '@rjsf/mui';
import { Box, Typography } from '@mui/material';

const { BaseInputTemplate } = Templates;

const baseInputTemplate = (props: BaseInputTemplateProps) => {
  if (BaseInputTemplate) {
    return (
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography
          component="span"
          id={`${props.id}-label`}
          sx={{ color: 'text.primary', fontWeight: 'bold', whiteSpace: 'normal' }}
        >
          {props.label}{' '}
        </Typography>
        <BaseInputTemplate
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          variant="filled"
          aria-labelledby={`${props.id}-label`}
          hiddenLabel
        />
      </Box>
    );
  }

  return undefined;
};

export const EntryTemplates = {
  BaseInputTemplate: baseInputTemplate
};
