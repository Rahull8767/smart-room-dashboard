import React from 'react';
import { Box, Slider } from '@mui/material';

const fanMarks = [
  { value: 0, label: 'OFF' },
  { value: 1, label: 'LOW' },
  { value: 2, label: 'MED' },
  { value: 3, label: 'HIGH' },
];

const FanSlider = ({ value, onChange }) => {
  const numValue = value === 'HIGH' ? 3 : value === 'MEDIUM' ? 2 : value === 'LOW' ? 1 : 0;
  
  const handleSliderChange = (e, val) => {
    const map = ['OFF', 'LOW', 'MEDIUM', 'HIGH'];
    if (map[val] !== value) {
       if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(15);
       onChange(map[val]);
    }
  };

  return (
    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
      <Slider
        value={numValue}
        min={0}
        max={3}
        step={1}
        marks={fanMarks}
        onChange={handleSliderChange}
        sx={{
          color: numValue > 0 ? 'var(--accent)' : 'var(--text-muted)',
          height: 8,
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
            backgroundColor: '#fff',
            border: '2px solid currentColor',
            boxShadow: numValue > 0 ? '0 0 10px var(--accent-glow)' : 'none',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
              boxShadow: numValue > 0 ? '0 0 15px var(--accent)' : 'inherit',
            },
          },
          '& .MuiSlider-track': { border: 'none', height: 8 },
          '& .MuiSlider-rail': { opacity: 0.3, backgroundColor: 'var(--border-color)' },
          '& .MuiSlider-mark': { display: 'none' },
          '& .MuiSlider-markLabel': { color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, mt: 0.5, fontFamily: 'Inter' },
          '& .MuiSlider-markLabelActive': { color: 'var(--text-primary)' }
        }}
      />
    </Box>
  );
};

export default FanSlider;
