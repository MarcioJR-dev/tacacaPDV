import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Paper, Button, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Background from './Background';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const actionButtons = [
    { text: 'Novo Cliente', icon: <PeopleIcon />, path: '/clientes/novo' },
    { text: 'Novo Produto', icon: <InventoryIcon />, path: '/produtos/novo' },
    { text: 'Novo Pedido', icon: <ShoppingCartIcon />, path: '/pedidos/novo' },
    { text: 'Nova Dívida', icon: <MoneyOffIcon />, path: '/dividas/novo' }
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'relative',
    }}>
      <Background />
      
      <AppBar 
        position="static" 
        color="primary" 
        elevation={0}
        sx={{ 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'linear-gradient(90deg, #1B5E20 0%, #2E7D32 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Logo />
          </Link>
          
          <Stack direction="row" spacing={1}>
            {actionButtons.map((button) => (
              <Button
                key={button.text}
                variant="contained"
                startIcon={button.icon}
                onClick={() => navigate(button.path)}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {button.text}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          position: 'relative',
        }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2E7D32, #4CAF50)',
            }
          }}
        >
          {children}
        </Paper>
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Tacacá Distribuidora - Todos os direitos reservados
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout; 