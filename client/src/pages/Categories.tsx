import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  Icon,
  Divider
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import axios from '../utils/apiClient';

interface Category {
  id: string;
  name: string;
  color: string | null;
  productive: boolean;
  icon: string | null;
  defaultUrgent: boolean;
  defaultImportant: boolean;
}

const PRESET_COLORS = [
  '#6C9EFF', '#3FB950', '#F85149', '#D29922',
  '#BC8CFF', '#30B0C7', '#F470A7', '#7EE787', '#A371F7',
];

const isMaterialIconName = (value: string | null): boolean => {
  if (!value) return false;
  return /^[a-z_]+$/.test(value);
};

const CategoryIcon = ({ icon, color, size = 22 }: { icon: string | null; color: string | null; size?: number }) => {
  if (icon && isMaterialIconName(icon)) {
    return <Icon sx={{ fontSize: size, color: color || '#8B949E' }}>{icon}</Icon>;
  }
  return <span style={{ fontSize: size * 0.8 }}>{icon || '📂'}</span>;
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [color, setColor] = useState('#6C9EFF');
  const [icon, setIcon] = useState('');
  const [productive, setProductive] = useState(false);
  const [defaultUrgent, setDefaultUrgent] = useState(false);
  const [defaultImportant, setDefaultImportant] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch (err) {
      showToast('Failed to load categories', 'error');
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleOpenAddDialog = () => {
    setEditingCategory(null);
    setName('');
    setColor(PRESET_COLORS[0]);
    setIcon('');
    setProductive(false);
    setDefaultUrgent(false);
    setDefaultImportant(false);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setColor(cat.color || PRESET_COLORS[0]);
    setIcon(cat.icon || '');
    setProductive(cat.productive);
    setDefaultUrgent(cat.defaultUrgent);
    setDefaultImportant(cat.defaultImportant);
    setIsDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!name.trim()) { showToast('Category name is required', 'error'); return; }
    try {
      const payload = { name, color, icon: icon || null, productive, defaultUrgent, defaultImportant };
      if (editingCategory) {
        await axios.put(`http://localhost:5000/api/categories/${editingCategory.id}`, payload);
        showToast('Category updated!');
      } else {
        await axios.post('http://localhost:5000/api/categories', payload);
        showToast('Category created!');
      }
      fetchCategories();
      setIsDialogOpen(false);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (categories.length <= 1) { showToast('Cannot delete the only remaining category.', 'error'); return; }
    if (!window.confirm('Are you sure? All activities and time blocks linked to this category will also be deleted.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      showToast('Category deleted!');
      fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#E6EDF3', fontWeight: 700, mb: 0.5 }}>
            Categories
          </Typography>
          <Typography sx={{ color: '#8B949E', fontSize: '0.9rem' }}>
            Manage your activity categories, colors, and Eisenhower defaults.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            bgcolor: '#6C9EFF', color: '#000', fontWeight: 600,
            textTransform: 'none', borderRadius: 2, px: 3, py: 1,
            '&:hover': { bgcolor: '#58A6FF' }
          }}
        >
          Add Category
        </Button>
      </Box>

      {/* List Header */}
      <Paper sx={{ bgcolor: '#161B22', borderRadius: 3, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 100px 90px 90px 80px',
            gap: 2,
            px: 3, py: 1.5,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Typography sx={{ color: '#8B949E', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</Typography>
          <Typography sx={{ color: '#8B949E', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</Typography>
          <Typography sx={{ color: '#8B949E', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Urgent</Typography>
          <Typography sx={{ color: '#8B949E', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Important</Typography>
          <Box />
        </Box>

        {/* List Rows */}
        {categories.map((cat, idx) => (
          <Box
            key={cat.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 100px 90px 90px 80px',
              gap: 2,
              px: 3, py: 1.5,
              alignItems: 'center',
              borderBottom: idx < categories.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.15s ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
            }}
          >
            {/* Name + Icon + Color */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 36, height: 36, borderRadius: '10px',
                  bgcolor: `${cat.color || '#6C9EFF'}18`,
                  border: `1px solid ${cat.color || '#6C9EFF'}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CategoryIcon icon={cat.icon} color={cat.color} size={20} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: '#E6EDF3', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cat.name}
                </Typography>
                {cat.color && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cat.color, flexShrink: 0 }} />
                    <Typography sx={{ color: '#8B949E', fontSize: '0.7rem' }}>{cat.color}</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Productive */}
            <Chip
              label={cat.productive ? 'Productive' : 'Neutral'}
              size="small"
              sx={{
                height: 22, fontSize: '0.7rem', fontWeight: 600,
                bgcolor: cat.productive ? 'rgba(63,185,80,0.12)' : 'rgba(139,148,158,0.1)',
                color: cat.productive ? '#3FB950' : '#8B949E',
                border: `1px solid ${cat.productive ? 'rgba(63,185,80,0.25)' : 'rgba(139,148,158,0.2)'}`,
              }}
            />

            {/* Urgent */}
            <Typography sx={{ fontSize: '0.8rem', color: cat.defaultUrgent ? '#D29922' : '#484F58' }}>
              {cat.defaultUrgent ? '● Yes' : '○ No'}
            </Typography>

            {/* Important */}
            <Typography sx={{ fontSize: '0.8rem', color: cat.defaultImportant ? '#F85149' : '#484F58' }}>
              {cat.defaultImportant ? '● Yes' : '○ No'}
            </Typography>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
              <IconButton
                size="small"
                onClick={() => handleOpenEditDialog(cat)}
                sx={{ color: '#8B949E', '&:hover': { color: '#6C9EFF' } }}
              >
                <EditRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteCategory(cat.id)}
                disabled={categories.length <= 1}
                sx={{ color: '#8B949E', '&:hover': { color: '#F85149' } }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        ))}

        {categories.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: '#484F58' }}>No categories yet. Click "Add Category" to get started.</Typography>
          </Box>
        )}
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#161B22', color: '#E6EDF3',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3, width: '100%', maxWidth: 480,
            }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)', pb: 2 }}>
          {editingCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Name */}
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{
              '& label': { color: '#8B949E' },
              '& label.Mui-focused': { color: '#6C9EFF' },
              '& .MuiOutlinedInput-root': {
                color: '#E6EDF3',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#6C9EFF' },
              }
            }}
          />

          {/* Icon */}
          <TextField
            label="Icon (Material Icon name, e.g. school, work, brush)"
            variant="outlined"
            fullWidth
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            sx={{
              '& label': { color: '#8B949E' },
              '& label.Mui-focused': { color: '#6C9EFF' },
              '& .MuiOutlinedInput-root': {
                color: '#E6EDF3',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#6C9EFF' },
              }
            }}
            slotProps={{
              input: {
                endAdornment: icon && isMaterialIconName(icon) ? (
                  <Icon sx={{ color: color || '#8B949E' }}>{icon}</Icon>
                ) : null,
              }
            }}
          />

          {/* Color */}
          <Box>
            <Typography variant="caption" sx={{ color: '#8B949E', fontWeight: 600, mb: 1, display: 'block' }}>
              Color
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {PRESET_COLORS.map((preset) => (
                <Box
                  key={preset}
                  onClick={() => setColor(preset)}
                  sx={{
                    width: 28, height: 28, borderRadius: '50%', bgcolor: preset, cursor: 'pointer',
                    border: color === preset ? '2.5px solid #FFF' : '2px solid transparent',
                    transform: color === preset ? 'scale(1.15)' : 'none',
                    transition: 'all 0.15s ease',
                    boxShadow: color === preset ? `0 0 10px ${preset}60` : 'none',
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

          {/* Switches */}
          <FormControlLabel
            control={<Switch checked={productive} onChange={(e) => setProductive(e.target.checked)} color="success" />}
            label={
              <Box>
                <Typography sx={{ color: '#E6EDF3', fontSize: '0.9rem', fontWeight: 600 }}>Productive</Typography>
                <Typography sx={{ color: '#8B949E', fontSize: '0.75rem' }}>Counts towards productive time in trends</Typography>
              </Box>
            }
            sx={{ m: 0 }}
          />

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

          <Typography variant="caption" sx={{ color: '#8B949E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Eisenhower Matrix Defaults
          </Typography>

          <FormControlLabel
            control={<Switch checked={defaultUrgent} onChange={(e) => setDefaultUrgent(e.target.checked)} color="warning" />}
            label={<Typography sx={{ color: '#E6EDF3', fontSize: '0.9rem' }}>Default to Urgent</Typography>}
            sx={{ m: 0 }}
          />

          <FormControlLabel
            control={<Switch checked={defaultImportant} onChange={(e) => setDefaultImportant(e.target.checked)} color="error" />}
            label={<Typography sx={{ color: '#E6EDF3', fontSize: '0.9rem' }}>Default to Important</Typography>}
            sx={{ m: 0 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.06)', gap: 1 }}>
          <Button onClick={() => setIsDialogOpen(false)} sx={{ color: '#8B949E', textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            sx={{ bgcolor: '#6C9EFF', color: '#000', fontWeight: 600, textTransform: 'none', px: 3, '&:hover': { bgcolor: '#58A6FF' } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} variant="filled"
          sx={{ width: '100%', bgcolor: toastSeverity === 'success' ? '#3FB950' : '#F85149', color: '#fff', fontWeight: 600 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
