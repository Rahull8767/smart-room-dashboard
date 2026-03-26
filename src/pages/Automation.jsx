import React, { useState } from 'react';
import { Grid, Typography, Box, Button, List, Switch, IconButton, Chip, Paper } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useAppContext } from '../context/AppContext';

const SENSORS = ['motion', 'sound', 'door', 'temperature', 'humidity'];
const DEVICES = ['light', 'fan'];

const SwipeableRule = ({ rule, getRuleText, toggleRule, deleteRule }) => {
  const [offset, setOffset] = useState(0);
  const handleTouchStart = (e) => { e.currentTarget.startX = e.touches[0].clientX; };
  const handleTouchMove = (e) => {
    const x = e.touches[0].clientX;
    const diff = e.currentTarget.startX - x;
    if (diff > 0 && diff < 100) setOffset(-diff);
  };
  const handleTouchEnd = () => setOffset(offset < -40 ? -80 : 0);
  return (
    <Box sx={{ position: 'relative', mb: 1.5, overflow: 'hidden', borderRadius: 3 }}>
      <Box sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => deleteRule(rule.id)}>
         <DeleteOutlineRoundedIcon sx={{ color: '#fff' }} />
      </Box>
      <Paper 
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} 
        elevation={0}
        sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 3, transform: `translateX(${offset}px)`, transition: offset === 0 || offset === -80 ? 'transform 0.2s ease' : 'none' }}>
        <Box>
           <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{getRuleText(rule)}</Typography>
           <Typography variant="caption" sx={{ color: rule.enabled ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600 }}>{rule.enabled ? 'Enabled' : 'Disabled'}</Typography>
        </Box>
        <Switch size="small" checked={rule.enabled} onChange={(e) => { e.stopPropagation(); toggleRule(rule.id); }}
           sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--accent-glow)' } }} />
      </Paper>
    </Box>
  );
};

const Automation = () => {
  const { automationRules, addRule, deleteRule, toggleRule } = useAppContext();

  const [wizardStep, setWizardStep] = useState(0);
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

      {/* Rule Builder Wizard */}
      <Box sx={{ mb: 6 }}>
        {wizardStep === 0 && (
          <Button variant="contained" fullWidth onClick={() => setWizardStep(1)} sx={{ py: 2, backgroundColor: 'var(--card-bg)', border: '1px dashed var(--accent)', color: 'var(--accent)', fontWeight: 700, boxShadow: 'none', '&:hover': { backgroundColor: 'var(--accent-light)' } }}>
            <AddRoundedIcon sx={{ mr: 1 }} /> Create New Automation
          </Button>
        )}
        {wizardStep === 1 && (
          <Paper sx={{ p: 4, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 4, elevation: 0 }}>
             <Typography sx={{ color: 'var(--accent)', fontWeight: 700, mb: 3, letterSpacing: '0.05em' }}>STEP 1: IF THIS HAPPENS...</Typography>
             <Grid container spacing={2}>
               {SENSORS.map(s => (
                 <Grid item xs={6} key={s}>
                   <Box onClick={() => { setConditionSensor(s); setConditionValue(s === 'sound' ? 70 : s === 'door' ? 'open' : 'detected'); setWizardStep(2); }} sx={{ p: 2.5, border: '1px solid var(--border-color)', borderRadius: 3, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease', '&:hover': { borderColor: 'var(--accent)', background: 'var(--accent-light)' } }}>
                     <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{s}</Typography>
                   </Box>
                 </Grid>
               ))}
             </Grid>
          </Paper>
        )}
        {wizardStep === 2 && (
          <Paper sx={{ p: 4, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 4, elevation: 0 }}>
             <Typography sx={{ color: 'var(--accent)', fontWeight: 700, mb: 3, letterSpacing: '0.05em' }}>STEP 2: THEN DO THIS...</Typography>
             <Grid container spacing={2}>
               {DEVICES.map(d => (
                 <Grid item xs={6} key={d}>
                   <Box onClick={() => { setActionDevice(d); setActionState('on'); setWizardStep(3); }} sx={{ p: 2.5, border: '1px solid var(--border-color)', borderRadius: 3, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease', '&:hover': { borderColor: 'var(--accent)', background: 'var(--accent-light)' } }}>
                     <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{d}</Typography>
                   </Box>
                 </Grid>
               ))}
             </Grid>
          </Paper>
        )}
        {wizardStep === 3 && (
          <Paper sx={{ p: 4, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 4, elevation: 0 }}>
             <Typography sx={{ color: 'var(--accent)', fontWeight: 700, mb: 3, letterSpacing: '0.05em' }}>STEP 3: CONFIRM AUTOMATION</Typography>
             <Box sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 4, border: '1px solid var(--border-color)' }}>
               <Typography sx={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 500, lineHeight: 1.6 }}>
                  If <span style={{ color: 'var(--accent)'}}>{conditionSensor}</span> is triggered, then turn <span style={{ color: 'var(--accent)'}}>{actionDevice}</span> <span style={{ color: 'var(--accent)'}}>ON</span>.
               </Typography>
             </Box>
             <Button variant="contained" fullWidth onClick={() => { handleAddRule(); setWizardStep(0); }} sx={{ py: 1.5, backgroundColor: 'var(--accent)', color: '#000', fontWeight: 800, fontSize: 13, '&:hover': { background: '#00c853' } }}>
               Save Automation
             </Button>
          </Paper>
        )}
      </Box>

      {/* Rules List */}
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#475569', mb: 2.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Active Rules ({automationRules.length})
      </Typography>

      {automationRules.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, backgroundColor: 'var(--card-bg)', border: '1px dashed var(--border-color)', borderRadius: 4 }}>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>No rules defined yet.</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {automationRules.map((rule) => (
            <SwipeableRule key={rule.id} rule={rule} getRuleText={getRuleText} toggleRule={toggleRule} deleteRule={deleteRule} />
          ))}
        </List>
      )}
    </Box>
  );
};

export default Automation;
