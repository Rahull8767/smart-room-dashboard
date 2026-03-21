import React, { useState } from 'react';
import { Grid, Typography, Box, Button, List, Switch, IconButton, Chip, Paper } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useAppContext } from '../context/AppContext';

const SENSORS = ['motion', 'sound', 'door', 'temperature', 'humidity'];
const DEVICES = ['light', 'fan'];

const StyledSelect = ({ label, value, onChange, children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
      {label}
    </Typography>
    <Box
      component="select"
      value={value}
      onChange={onChange}
      sx={{
        backgroundColor: '#111318',
        border: '1px solid #2a2d35',
        borderRadius: 1,
        color: '#f8fafc',
        fontSize: 13,
        fontWeight: 500,
        p: '10px 12px',
        outline: 'none',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        '&:focus': { borderColor: '#ffffff' },
        '& option': { background: '#1c1f26', color: '#f8fafc' },
      }}
    >
      {children}
    </Box>
  </Box>
);

const Automation = () => {
  const { automationRules, addRule, deleteRule, toggleRule } = useAppContext();

  const [conditionSensor, setConditionSensor] = useState('motion');
  const [conditionOperator, setConditionOperator] = useState('==');
  const [conditionValue, setConditionValue] = useState('detected');
  const [actionDevice, setActionDevice] = useState('light');
  const [actionState, setActionState] = useState('on');

  const handleAddRule = () => {
    let finalValue = conditionValue;
    let state = conditionValue;
    if (conditionSensor === 'sound') {
      finalValue = parseInt(conditionValue, 10) || 70;
      setConditionOperator('>');
      state = null;
    } else if (conditionSensor === 'motion') {
      state = 'detected';
    } else if (conditionSensor === 'door') {
      state = conditionValue === 'open' ? 'open' : 'closed';
    }
    addRule({ conditionSensor, conditionOperator, conditionValue: finalValue, conditionState: state, actionDevice, actionState, enabled: true });
    setConditionSensor('motion');
    setConditionValue('detected');
    setActionDevice('light');
    setActionState('on');
  };

  const getRuleText = (rule) => {
    const valText = rule.conditionState || rule.conditionValue;
    return `If ${rule.conditionSensor} ${rule.conditionOperator === '>' ? 'exceeds' : 'is'} ${valText}, then turn ${rule.actionDevice} ${rule.actionState.toUpperCase()}`;
  };

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Automation
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#64748b', mt: 0.5 }}>
          Create rules to automate your environment
        </Typography>
      </Box>

      {/* Rule Builder */}
      <Paper sx={{ p: 4, mb: 6, backgroundColor: '#1c1f26', border: '1px solid #2a2d35' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <AutoAwesomeRoundedIcon sx={{ color: '#ffffff', fontSize: 16 }} />
          <Typography sx={{ fontWeight: 600, color: '#f8fafc', fontSize: 15 }}>New Rule</Typography>
        </Box>

        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} sm={3}>
            <StyledSelect label="Trigger" value={conditionSensor} onChange={(e) => setConditionSensor(e.target.value)}>
              {SENSORS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </StyledSelect>
          </Grid>
          <Grid item xs={12} sm={3}>
            {conditionSensor === 'sound' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Threshold (dB)</Typography>
                <Box
                  component="input"
                  type="number"
                  value={conditionValue}
                  onChange={(e) => setConditionValue(e.target.value)}
                  sx={{
                    backgroundColor: '#111318',
                    border: '1px solid #2a2d35',
                    borderRadius: 1,
                    color: '#f8fafc',
                    fontSize: 13,
                    p: '10px 12px',
                    outline: 'none',
                    '&:focus': { borderColor: '#ffffff' },
                  }}
                />
              </Box>
            ) : conditionSensor === 'door' ? (
              <StyledSelect label="Condition" value={conditionValue} onChange={(e) => setConditionValue(e.target.value)}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </StyledSelect>
            ) : (
              <StyledSelect label="Condition" value={conditionValue} onChange={(e) => setConditionValue(e.target.value)}>
                <option value="detected">Detected</option>
                <option value="clear">Clear</option>
              </StyledSelect>
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <StyledSelect label="Action" value={actionDevice} onChange={(e) => setActionDevice(e.target.value)}>
              {DEVICES.map(d => <option key={d} value={d}>Turn {d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </StyledSelect>
          </Grid>
          <Grid item xs={12} sm={2}>
            <StyledSelect label="State" value={actionState} onChange={(e) => setActionState(e.target.value)}>
              <option value="on">On</option>
              <option value="off">Off</option>
            </StyledSelect>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleAddRule}
              sx={{ height: 42, minWidth: 42 }}
            >
              <AddRoundedIcon fontSize="small" />
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Rules List */}
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', mb: 2.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Active Rules ({automationRules.length})
      </Typography>

      {automationRules.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#1c1f26', border: '1px dashed #2a2d35', borderRadius: 2 }}>
          <Typography sx={{ color: '#475569', fontSize: 13 }}>No rules defined yet.</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {automationRules.map((rule) => (
            <Paper key={rule.id} sx={{ mb: 1.5, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1c1f26', border: '1px solid #2a2d35' }}>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#f8fafc' }}>
                  {getRuleText(rule)}
                </Typography>
                <Typography variant="caption" sx={{ color: rule.enabled ? '#10b981' : '#64748b', fontWeight: 600 }}>
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Switch
                  size="small"
                  checked={rule.enabled}
                  onChange={() => toggleRule(rule.id)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#ffffff' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#475569' },
                  }}
                />
                <IconButton size="small" onClick={() => deleteRule(rule.id)} sx={{ color: '#475569', '&:hover': { color: '#ef4444' } }}>
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Automation;
