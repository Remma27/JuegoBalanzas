import React, { useState, useRef, useEffect } from 'react';
import { View, Text, PanResponder, Animated, Button } from 'react-native';
import { styles } from '../css/styles.js';
import GuessColorModal from './GuessColorModal'; // Importa la modal

const DragAndDrop = () => {
    const containerRef = useRef(null);
    const [containerLayout, setContainerLayout] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad de la modal

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
        // Código de la función getBoxIdFromPosition
    };

    const handleCubeDrop = (boxId, cubeId) => {
        // Código de la función handleCubeDrop
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleGuess = (guessedCorrectly) => {
        console.log('Guessed correctly:', guessedCorrectly);
        closeModal(); // Cierra la modal después de adivinar
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
            <Button title="Adivinar colores" onPress={openModal} />
            {/* Agrega la modal */}
            <GuessColorModal
                visible={modalVisible}
                onClose={closeModal}
                onGuess={handleGuess}
            />
        </View>
    );
};

export default DragAndDrop;
