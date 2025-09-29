// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Button, Card, CardContent, Grid2 as Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useFormTemplates } from '../../hooks/Forms/useFormTemplates';
import Format from '../../utils/Format';
import { PageTitle } from '../../components';
import PageWrapper from '../../components/PageWrapper';
import { useIsOnline } from '../../hooks/useIsOnline';

const FormTemplates = () => {
  const navigate = useNavigate();
  const isOnline = useIsOnline();
  const { forms } = useFormTemplates();

  const tableHeaders = ['Form name', 'Created by', 'Date'];

  const handleAddForm = () => {
    navigate('/forms/create');
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'white',
          paddingX: { xs: '1rem', md: '60px' },
          paddingY: '1.3rem'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'inherit',
            textDecoration: 'none',
            mr: 2
          }}
        >
          <PageTitle title="Form Templates" />
        </Box>
      </Box>

      <PageWrapper backgroundColor="#f7f7f7">
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}
        >
          <Button
            color="primary"
            startIcon={<AddCircleIcon />}
            variant="contained"
            onClick={handleAddForm}
            disabled={!isOnline}
            sx={{
              flexBasis: { xs: '48%', md: 'auto' },
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            Add New Form
          </Button>
        </Box>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <TableContainer sx={{ boxShadow: 0 }} component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: 'background.default' }}>
                    <TableRow>
                      {tableHeaders.map((value) => (
                        <TableCell key={value} align="left">
                          <Typography variant="body1" fontWeight="600" padding={0} margin={0}>
                            {value}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {forms?.map((form) => {
                      const { id, title, authorName, createdAt } = form;
                      return (
                        <TableRow key={id}>
                          <TableCell>
                            <Typography
                              component={Link}
                              to="/forms/preview"
                              state={{ form }}
                              variant="body1"
                              color="primary"
                              fontWeight="bold"
                            >
                              {title}
                            </Typography>
                          </TableCell>
                          <TableCell>{authorName}</TableCell>
                          <TableCell>{Format.date(createdAt)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </CardContent>
        </Card>
      </PageWrapper>

    </>
  );
};

export default FormTemplates;
