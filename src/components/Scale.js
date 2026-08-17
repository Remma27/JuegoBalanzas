/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';

export const CUBE_COLORS = {
  red: '#E53935',
  yellow: '#FDD835',
  green: '#43A047',
  blue: '#1E88E5',
  violet: '#8E24AA',
};

const PAN_W = 96;
const PAN_H = 92;
const PIVOT_Y = 84;
const MAX_TILT = 16;

const Scale = ({ scale, leftWeight = 0, rightWeight = 0, onZoneChange }) => {
  const tilt = useRef(new Animated.Value(0)).current;
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const diff = leftWeight - rightWeight;
  const angle = Math.max(-MAX_TILT, Math.min(MAX_TILT, (diff / 60) * MAX_TILT));

  useEffect(() => {
    Animated.timing(tilt, {
      toValue: angle,
      duration: 450,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [angle, tilt]);

  const report = which => {
    const ref = which === 'left' ? leftRef : rightRef;
    if (ref.current) {
      ref.current.measureInWindow((x, y, w, h) => {
        onZoneChange(which, { x, y, w, h });
      });
    }
  };

  useEffect(() => {
    report('left');
    report('right');
  }, [angle, scale, tilt]);

  const rot = tilt.interpolate({
    inputRange: [-MAX_TILT, MAX_TILT],
    outputRange: [`${-MAX_TILT}deg`, `${MAX_TILT}deg`],
  });

  const renderCubes = side => {
    const groups = {};
    side.forEach(name => {
      const color = name.split(' ')[0].toLowerCase();
      groups[color] = (groups[color] || 0) + 1;
    });
    return Object.entries(groups).map(([color, count]) => (
      <View key={color} style={[styles.miniCube, { backgroundColor: CUBE_COLORS[color] || '#999' }]}>
        <Text style={styles.miniCubeText}>{count}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.scaleArea}>
      <View style={[styles.base]} />
      <View style={[styles.post, { top: PIVOT_Y }]} />
      <View style={[styles.pivot, { top: PIVOT_Y - 13 }]} />
      <Animated.View
        style={[
          styles.assembly,
          { top: PIVOT_Y - PAN_H / 2, transform: [{ rotate: rot }] },
        ]}
      >
        <View style={styles.pan} ref={leftRef} onLayout={() => report('left')}>
          {renderCubes(scale[0])}
        </View>
        <View style={styles.beamBar} />
        <View style={styles.pan} ref={rightRef} onLayout={() => report('right')}>
          {renderCubes(scale[1])}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  scaleArea: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  base: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 14,
    backgroundColor: '#6D4C41',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  post: {
    position: 'absolute',
    left: '50%',
    marginLeft: -4,
    bottom: 14,
    width: 8,
    backgroundColor: '#8D6E63',
  },
  pivot: {
    position: 'absolute',
    left: '50%',
    marginLeft: -13,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFD54F',
    borderWidth: 2,
    borderColor: '#F9A825',
  },
  assembly: {
    position: 'absolute',
    left: '3%',
    right: '3%',
    height: PAN_H,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pan: {
    width: PAN_W,
    height: PAN_H,
    backgroundColor: '#E0E0E0',
    borderWidth: 3,
    borderColor: '#757575',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  beamBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#6D4C41',
    borderRadius: 6,
  },
  miniCube: {
    width: 28,
    height: 28,
    margin: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCubeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Scale;