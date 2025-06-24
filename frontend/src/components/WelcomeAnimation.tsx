import React from 'react';
import { Box, Typography, useTheme, PaletteMode } from '@mui/material';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';

// Animation JSON data for the robot animation
const robotAnimationData = {
  v: "5.7.1",
  fr: 30,
  ip: 0,
  op: 60,
  w: 400,
  h: 400,
  nm: "Robot Welcome",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Robot",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], h: 1 },
            { t: 30, s: [10], h: 1 },
            { t: 60, s: [0], h: 1 }
          ],
          ix: 10
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [200, 200, 0], h: 1 },
            { t: 15, s: [200, 190, 0], h: 1 },
            { t: 30, s: [200, 210, 0], h: 1 },
            { t: 45, s: [200, 190, 0], h: 1 },
            { t: 60, s: [200, 200, 0], h: 1 }
          ],
          ix: 2,
          l: 2
        },
        a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
        s: { a: 0, k: [100, 100, 100], ix: 6, l: 2 }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [80, 80], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Head",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.42, 0.22, 0.8, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            }
          ],
          nm: "Head",
          np: 3,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [100, 120], ix: 2 },
              p: { a: 0, k: [0, 90], ix: 3 },
              r: { a: 0, k: 10, ix: 4 },
              nm: "Body",
              mn: "ADBE Vector Shape - Rect",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.42, 0.22, 0.8, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            }
          ],
          nm: "Body",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 2,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [20, 20], ix: 2 },
              p: { a: 0, k: [-15, -10], ix: 3 },
              nm: "Eye Left",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            }
          ],
          nm: "Eye Left",
          np: 3,
          cix: 2,
          bm: 0,
          ix: 3,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [20, 20], ix: 2 },
              p: { a: 0, k: [15, -10], ix: 3 },
              nm: "Eye Right",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            }
          ],
          nm: "Eye Right",
          np: 3,
          cix: 2,
          bm: 0,
          ix: 4,
          mn: "ADBE Vector Group",
          hd: false
        },
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [40, 10], ix: 2 },
              p: { a: 0, k: [0, 10], ix: 3 },
              r: { a: 0, k: 5, ix: 4 },
              nm: "Mouth",
              mn: "ADBE Vector Shape - Rect",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            }
          ],
          nm: "Mouth",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 5,
          mn: "ADBE Vector Group",
          hd: false
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ],
  markers: []
};

interface WelcomeAnimationProps {
  mode: PaletteMode;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ mode }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
      }}
    >
      <Box
        sx={{ 
          width: '200px',
          height: '200px',
          mb: 3,
        }}
      >
        <Lottie 
          animationData={robotAnimationData}
          loop={true}
        />
      </Box>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ 
            mb: 2,
            fontWeight: 600,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #8e24aa 30%, #3f51b5 90%)'
              : 'linear-gradient(45deg, #6a11cb 30%, #2575fc 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Welcome to DeepMine Sentinel
        </Typography>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Typography
          variant="body1"
          align="center"
          color="textSecondary"
          sx={{ mb: 3, maxWidth: 500 }}
        >
          I'm your Mining Safety AI Assistant — here to provide safety tips, assess risks based on conditions like seismic activity or weather, and help you maintain a safer mining environment. How can I assist you today?
        </Typography>
      </motion.div>
    </Box>
  );
};

export default WelcomeAnimation;
