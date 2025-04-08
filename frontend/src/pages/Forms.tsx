import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Button, Grid2 as Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateForms = () => {
  const navigate = useNavigate();

  const handleAddForm = () => {
    navigate('/forms/create');
  };
    
  return (
    <Box sx={{ p: 3 }}>
      {/* Top Row: Add New Form Button */}
      <Grid sx={{ xs:6 }} />
      <Grid container justifyContent="space-between" alignItems="center" mb={4}>
        <Grid sx={{ xs:'auto' }}>
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
  
      {/* Bottom Row: Message on the left */}
      <Grid container>
        <Grid sx={{ xs:12 }}>
          <Box>
            <h3>There are currently no forms.</h3>
            <hr />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

}

export default CreateForms;