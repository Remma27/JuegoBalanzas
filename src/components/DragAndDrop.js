/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, PanResponder, Animated } from 'react-native';
import { styles } from '../css/styles.js';

const DragAndDrop = () => {
    const containerRef = useRef(null);
    const [containerLayout, setContainerLayout] = useState(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.measure((x, y, width, height) => {
                setContainerLayout({ x, y, width, height });
            });
        }
    }, []);

    const [boxes, setBoxes] = useState([
        { id: 'box0', count: 0, colors: [] },
        { id: 'box1', count: 0, colors: [] },
        { id: 'box2', count: 0, colors: [] },
        { id: 'box3', count: 0, colors: [] },
        { id: 'box4', count: 0, colors: [] },
    ]);

    const [cubes, setCubes] = useState([
        { id: 'rojo', color: 'red', value: '1' },
        { id: 'rojo2', color: 'red', value: '2' },
        { id: 'azul', color: 'blue', value: '1' },
        { id: 'azul2', color: 'blue', value: '2' },
        { id: 'verde', color: 'green', value: '1' },
        { id: 'verde2', color: 'green', value: '2' },
        { id: 'amarillo', color: 'yellow', value: '1' },
        { id: 'amarillo2', color: 'yellow', value: '2' },
        { id: 'violeta', color: 'violet', value: '1' },
        { id: 'violeta2', color: 'violet', value: '2' },
    ]);

    const [cubePositions] = useState(
        cubes.reduce((positions, cube) => {
            positions[cube.id] = new Animated.ValueXY();
            return positions;
        }, {})
    );

    const panResponders = {};
    cubes.forEach((cube) => {
        panResponders[cube.id] = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                cubePositions[cube.id].setValue({ x: gestureState.dx, y: gestureState.dy });
            },
            onPanResponderRelease: (_, gestureState) => {
                if (!containerLayout) {
                    return;
                }

                const boxId = getBoxIdFromPosition(gestureState.dx, gestureState.dy);
                console.log('Determined boxId:', boxId);
                if (boxId) {
                    handleCubeDrop(boxId, cube.id);
                } else {
                    console.log('Invalid boxId:', boxId);
                    Animated.spring(cubePositions[cube.id], {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                    }).start();
                }
            },
        });
    });

    const getBoxIdFromPosition = (x, y) => {
        if (!containerLayout) {
            console.log('Container layout not available');
            return null;
        }

        console.log('Container layout:', containerLayout);
        console.log('Received coordinates (x, y):', x, y);

        // Calculate the relative coordinates within the container
        const relativeX = x - containerLayout.x;
        const relativeY = y - containerLayout.y;

        console.log('Relative coordinates (relativeX, relativeY):', relativeX, relativeY);

        // Check if the relative coordinates are valid
        if (isNaN(relativeX) || isNaN(relativeY)) {
            console.log('Invalid relative coordinates');
            return null;
        }

        // Check if the relative coordinates are within the container bounds
        if (
            relativeX < 0 ||
            relativeY < 0 ||
            relativeX > containerLayout.width ||
            relativeY > containerLayout.height
        ) {
            console.log('Coordinates out of bounds');
            return null;
        }

        // Calculate the box index
        const boxWidth = 80;
        const boxHeight = 100;
        const boxMargin = 20;
        const numColumns = 5;

        const column = Math.floor(relativeX / (boxWidth + boxMargin));
        const row = Math.floor(relativeY / (boxHeight + boxMargin));
        const boxIndex = row * numColumns + column;

        console.log('Calculated boxIndex:', boxIndex);

        // Check if the box index is within the bounds
        if (boxIndex >= 0 && boxIndex < boxes.length) {
            return boxes[boxIndex].id;
        } else {
            console.log('Invalid box index');
            return null;
        }
    };

    const handleCubeDrop = (boxId, cubeId) => {
        console.log('Handling cube drop:', cubeId, 'into box:', boxId);

        const targetBox = boxes.find(box => box.id === boxId);
        const cube = cubes.find(cube => cube.id === cubeId);
        const currentBox = boxes.find(box => box.colors.includes(cubeId));

        // Verificar si la caja objetivo está vacía o contiene solo cubos del mismo color
        const canDropIntoTargetBox = targetBox.colors.length === 0 || targetBox.colors.every(color => {
            const cubeColor = cubes.find(c => c.id === color).color;
            return cubeColor === cube.color;
        });

        if (!canDropIntoTargetBox) {
            Animated.spring(cubePositions[cubeId], {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true,
            }).start();
            return;
        }

        const updatedBoxes = [...boxes];

        // Eliminar el cubo de la caja actual
        if (currentBox.id !== boxId) {
            const currentIndex = updatedBoxes.findIndex(box => box.id === currentBox.id);
            if (currentIndex !== -1) {
                updatedBoxes[currentIndex].colors = updatedBoxes[currentIndex].colors.filter(color => color !== cubeId);
                updatedBoxes[currentIndex].count--;
            }
        }

        // Agregar el cubo a la caja objetivo
        const targetIndex = updatedBoxes.findIndex(box => box.id === boxId);
        if (targetIndex !== -1) {
            updatedBoxes[targetIndex].colors.push(cubeId);
            updatedBoxes[targetIndex].count++;
        }

        console.log('Before updating boxes:', JSON.stringify(boxes));
        setBoxes(updatedBoxes);
        console.log('After updating boxes:', JSON.stringify(updatedBoxes));

        Animated.spring(cubePositions[cubeId], {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Drag And Drop</Text>
            <View style={{ flex: 1 }}>
                <View style={styles.boxContainer} ref={containerRef} onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    setContainerLayout({ x, y, width, height });
                }}>
                    {boxes.map((box) => (
                        <View key={box.id} style={styles.box}>
                            <Text style={styles.counter}>{box.count}</Text>
                            {box.colors.map((color, index) => (
                                <View key={index} style={[styles.colorBox, { backgroundColor: color }]} />
                            ))}
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.cubeContainer}>
                {cubes.map((cube) => (
                    <Animated.View
                        key={cube.id}
                        style={[
                            styles.cube,
                            {
                                backgroundColor: cube.color,
                                transform: [
                                    { translateX: cubePositions[cube.id].x },
                                    { translateY: cubePositions[cube.id].y },
                                ],
                            },
                        ]}
                        {...(panResponders[cube.id] ? panResponders[cube.id].panHandlers : {})}
                    >
                        <Text style={styles.cubeText}>{cube.value}</Text>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
};

export default DragAndDrop;
