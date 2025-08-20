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
          sx={{
            color: (props.rawErrors?.length ?? 0) > 0 ? '#EB2626' : 'initial',
            fontWeight: 'bold',
            whiteSpace: 'normal'
          }}
        >
          {props.label}{' '}
        </Typography>
        <BaseInputTemplate
          {...props}
          variant="filled"
          aria-labelledby={`${props.id}-label`}
          placeholder="Type..."
          label=""
          required={false}
          InputLabelProps={{ shrink: false }}
          error={false}
          sx={{ '.MuiInputBase-input': { paddingTop: '17px', paddingBottom: '16px' } }}
        />
      </Box>
    );
  }

  return undefined;
};

export const UiTemplates = {
  BaseInputTemplate: baseInputTemplate
};
