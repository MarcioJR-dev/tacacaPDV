import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';

const MenuCard = ({ title, icon: Icon, to, color }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        color: 'white',
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
        <Icon sx={{ fontSize: 48 }} />
        <Typography variant="h5" component="h2" align="center" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  </Link>
);

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
        Bem-vindo ao Sistema
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MenuCard
            title="Clientes"
            icon={PeopleIcon}
            to="/clientes"
            color="#2E7D32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MenuCard
            title="Pedidos"
            icon={ShoppingCartIcon}
            to="/pedidos"
            color="#1B5E20"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MenuCard
            title="Produtos"
            icon={InventoryIcon}
            to="/produtos"
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MenuCard
            title="Dívidas"
            icon={ReceiptIcon}
            to="/dividas"
            color="#388E3C"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 