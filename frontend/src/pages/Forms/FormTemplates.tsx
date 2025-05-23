// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Button, Grid2 as Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useFormTemplates } from '../../hooks/Forms/useFormTemplates';
import Format from '../../utils/Format';

const FormTemplates = () => {
  const navigate = useNavigate();
  const { forms } = useFormTemplates();

  const tableHeaders = ['Form name', 'Created by', 'Date'];

  const handleAddForm = () => {
    navigate('/forms/create');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="flex-end" alignItems="center" mb={4}>
        <Grid>
          <Button
            type="button"
            variant="contained"
            size="large"
            startIcon={<AddCircleIcon />}
            onClick={handleAddForm}
          >
            Add New Form
          </Button>
        </Grid>
      </Grid>

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
    </Box>
  );
};

export default FormTemplates;
