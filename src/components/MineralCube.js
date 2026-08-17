/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import { Animated, PanResponder, Text, StyleSheet } from 'react-native';
import { CUBE_COLORS } from './Scale';
import { cap, COLOR_ES } from '../game/rules';

const hitZone = (x, y, zones) => {
  const inZone = which => {
    const z = zones[which];
    return z && x > z.x && x < z.x + z.w && y > z.y && y < z.y + z.h;
  };
  if (inZone('left')) return 'l';
  if (inZone('right')) return 'r';
  return null;
};

const MineralCube = ({ color, count, dropZones, onPlace, canPlace = true }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);

  const latest = useRef({});
  latest.current = { dropZones, onPlace, count, canPlace };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => latest.current.count > 0 && latest.current.canPlace,
      onMoveShouldSetPanResponder: () => latest.current.count > 0 && latest.current.canPlace,
      onPanResponderGrant: () => {
        pan.setValue({ x: 0, y: 0 });
        setDragging(true);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, g) => {
        setDragging(false);
        const { dropZones: zones, onPlace: place } = latest.current;
        if (zones) {
          const zone = hitZone(evt.nativeEvent.pageX, evt.nativeEvent.pageY, zones);
          if (zone) place(color, zone);
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 6,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.cube,
        { backgroundColor: CUBE_COLORS[color], opacity: count > 0 ? 1 : 0.3 },
        dragging && styles.dragging,
        { transform: pan.getTranslateTransform() },
      ]}
    >
      <Text style={styles.cubeText}>{count}</Text>
      <Text style={styles.cubeLabel}>{cap(COLOR_ES[color])}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cube: {
    width: 64,
    height: 64,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.25)',
  },
  cubeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cubeLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  dragging: {
    zIndex: 10,
    elevation: 10,
  },
});

export default MineralCube;