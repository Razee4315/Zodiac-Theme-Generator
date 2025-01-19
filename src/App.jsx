import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextField, Button, Container, Box, Typography, CircularProgress, IconButton, Tooltip, Paper, Grid, Dialog, DialogTitle, DialogContent, Snackbar, Alert } from '@mui/material';
import { ColorLens, Refresh, Download, Share, Favorite, AutoAwesome, History, Collections, KeyboardTab, Info } from '@mui/icons-material';
import Tilt from 'react-parallax-tilt';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Particles from 'react-particles';
import { loadFull } from "tsparticles";
import Confetti from 'react-confetti';
import { ChromePicker } from 'react-color';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [accentColor, setAccentColor] = useState('#FE6B8B');
  const [liked, setLiked] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [variations, setVariations] = useState([]);
  const [showVariations, setShowVariations] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('themeHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    
    // Show keyboard shortcuts hint
    const shortcutsShown = localStorage.getItem('shortcutsShown');
    if (!shortcutsShown) {
      setShowShortcuts(true);
      localStorage.setItem('shortcutsShown', 'true');
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'g':
            e.preventDefault();
            generateImage();
            break;
          case 'h':
            e.preventDefault();
            setShowHistory(true);
            break;
          case 'v':
            e.preventDefault();
            generateVariations();
            break;
          case 's':
            e.preventDefault();
            if (imageUrl) shareImage();
            break;
          case 'd':
            e.preventDefault();
            if (imageUrl) downloadImage();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [imageUrl, prompt]);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesConfig = {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: accentColor },
      shape: { type: "circle" },
      opacity: {
        value: 0.5,
        random: true,
        animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
      },
      size: {
        value: 3,
        random: true,
        animation: { enable: true, speed: 2, minimumValue: 0.1, sync: false }
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: false,
        straight: false,
        outModes: { default: "out" },
      }
    }
  };

  const generateImage = async () => {
    if (!prompt) {
      toast.error('Please enter a theme idea first!');
      return;
    }
    
    setLoading(true);
    const formattedPrompt = `a-Zodiac-Theme-${prompt.replace(/\s+/g, '-')}`;
    const url = `https://image.pollinations.ai/prompt/${formattedPrompt}`;
    setImageUrl(url);
    
    // Add to history
    const newHistory = [{ prompt, url, timestamp: new Date().toISOString() }, ...history.slice(0, 19)];
    setHistory(newHistory);
    localStorage.setItem('themeHistory', JSON.stringify(newHistory));
    
    setLoading(false);
    setShowConfetti(true);
    toast.success('🎨 Your theme has been generated!');
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const generateVariations = async () => {
    if (!prompt) return;
    setLoading(true);
    const variations = [];
    const modifiers = ['mystical', 'futuristic', 'vintage', 'minimalist'];
    
    for (const modifier of modifiers) {
      const formattedPrompt = `a-Zodiac-Theme-${modifier}-${prompt.replace(/\s+/g, '-')}`;
      variations.push({
        url: `https://image.pollinations.ai/prompt/${formattedPrompt}`,
        modifier
      });
    }
    
    setVariations(variations);
    setShowVariations(true);
    setLoading(false);
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zodiac-theme-${prompt.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.info('🎉 Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const shareImage = () => {
    if (!imageUrl) return;
    navigator.clipboard.writeText(imageUrl);
    toast.info('🔗 Link copied to clipboard!');
  };

  return (
    <>
      <Particles init={particlesInit} options={particlesConfig} />
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      <ToastContainer position="bottom-right" theme="dark" />
      
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 4,
            gap: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                background: `linear-gradient(45deg, ${accentColor} 30%, #FF8E53 90%)`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                mb: 2,
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Zodiac Theme Generator
            </Typography>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: 600 }}
          >
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Enter your theme idea"
                    variant="outlined"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: accentColor,
                        },
                      },
                    }}
                  />
                  <Tooltip title="Change accent color">
                    <IconButton onClick={() => setShowColorPicker(!showColorPicker)}>
                      <ColorLens sx={{ color: accentColor }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                {showColorPicker && (
                  <Box sx={{ position: 'absolute', zIndex: 2 }}>
                    <ChromePicker
                      color={accentColor}
                      onChange={(color) => setAccentColor(color.hex)}
                    />
                  </Box>
                )}

                <Button
                  variant="contained"
                  onClick={generateImage}
                  disabled={!prompt || loading}
                  startIcon={<AutoAwesome />}
                  sx={{
                    background: `linear-gradient(45deg, ${accentColor} 30%, #FF8E53 90%)`,
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${accentColor} 10%, #FF8E53 70%)`,
                    },
                  }}
                >
                  Generate Magic
                </Button>
              </Box>
            </Paper>
          </motion.div>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Tooltip title="View History (Ctrl+H)">
              <IconButton onClick={() => setShowHistory(true)} color="primary">
                <History />
              </IconButton>
            </Tooltip>
            <Tooltip title="Generate Variations (Ctrl+V)">
              <IconButton onClick={generateVariations} color="primary" disabled={!prompt}>
                <Collections />
              </IconButton>
            </Tooltip>
            <Tooltip title="Keyboard Shortcuts">
              <IconButton onClick={() => setShowShortcuts(true)} color="primary">
                <KeyboardTab />
              </IconButton>
            </Tooltip>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress sx={{ color: accentColor }} />
              <Typography>Creating your magical theme...</Typography>
            </Box>
          ) : imageUrl && (
            <AnimatePresence mode="wait">
              <motion.div
                key={imageUrl}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Tilt
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  scale={1.02}
                  transitionSpeed={2000}
                >
                  <Paper 
                    elevation={6}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: '#fff',
                      position: 'relative',
                    }}
                  >
                    <Box
                      component="img"
                      src={imageUrl}
                      alt="Generated theme"
                      sx={{
                        width: '100%',
                        maxWidth: 600,
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Tooltip title="Download">
                        <IconButton onClick={downloadImage} color="primary">
                          <Download />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share">
                        <IconButton onClick={shareImage} color="primary">
                          <Share />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={liked ? "Unlike" : "Like"}>
                        <IconButton onClick={() => setLiked(!liked)} color={liked ? "error" : "default"}>
                          <Favorite />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Generate New">
                        <IconButton onClick={generateImage} color="primary">
                          <Refresh />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                </Tilt>
              </motion.div>
            </AnimatePresence>
          )}
        </Box>
      </Container>

      {/* History Dialog */}
      <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generation History</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {history.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Box component="img" src={item.url} alt={item.prompt} sx={{ width: '100%', borderRadius: 1 }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>{item.prompt}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.timestamp).toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Variations Dialog */}
      <Dialog open={showVariations} onClose={() => setShowVariations(false)} maxWidth="md" fullWidth>
        <DialogTitle>Theme Variations</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {variations.map((variation, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Box component="img" src={variation.url} alt={variation.modifier} sx={{ width: '100%', borderRadius: 1 }} />
                  <Typography variant="body2" sx={{ mt: 1, textTransform: 'capitalize' }}>
                    {variation.modifier} Style
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showShortcuts} onClose={() => setShowShortcuts(false)}>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>Ctrl/⌘ + G: Generate Theme</Typography>
            <Typography>Ctrl/⌘ + H: View History</Typography>
            <Typography>Ctrl/⌘ + V: Generate Variations</Typography>
            <Typography>Ctrl/⌘ + S: Share Theme</Typography>
            <Typography>Ctrl/⌘ + D: Download Theme</Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* First-time shortcuts hint */}
      <Snackbar
        open={showShortcuts}
        autoHideDuration={6000}
        onClose={() => setShowShortcuts(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          Pro tip: Use keyboard shortcuts for quick actions! Click the keyboard icon to learn more.
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
