/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../css/styles.js';

const DragAndDrop = () => {
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

    const [selectedCube, setSelectedCube] = useState(null);

    const handleCubePress = (cubeId) => {
        console.log('handleCubePress:', cubeId);
        setSelectedCube(cubeId);
    };

    const handleBoxPress = (boxId) => {
        console.log('handleBoxPress:', boxId);
        if (selectedCube) {
            const selectedCubeIndex = cubes.findIndex((cube) => cube.id === selectedCube);
            if (selectedCubeIndex === -1) {
                console.log('Selected cube not found in cubes array');
                setSelectedCube(null);
                return;
            }
            // eslint-disable-next-line no-shadow
            const selectedCube = cubes[selectedCubeIndex];

            if (selectedCube && selectedCube.color && puedeSoltar(selectedCube.color, boxId)) {
                console.log('Placing cube:', selectedCube.id, 'in box:', boxId);
                const updatedBoxes = boxes.map((box) =>
                    box.id === boxId
                        ? { ...box, count: box.count + 1, colors: [...box.colors, selectedCube.color] }
                        : box
                );
                const updatedCubes = cubes.filter((cube) => cube.id !== selectedCube.id);

                setBoxes(updatedBoxes);
                setCubes(updatedCubes);
                setSelectedCube(null);
            } else {
                console.log('Cannot place cube:', selectedCube.id, 'in box:', boxId);
            }
        }
    };

    const puedeSoltar = (color, targetBox) => {
        console.log('puedeSoltar:', color, targetBox);
        if (!color) {
            console.log('Color is undefined');
            return false;
        }

        const targetBoxIndex = boxes.findIndex((box) => box.id === targetBox);
        const targetBoxColors = boxes[targetBoxIndex].colors;

        console.log('Target box colors:', targetBoxColors);

        if (!targetBoxColors.includes(color)) {
            console.log('Color not found in target box');
            return true;
        }
        for (const box of boxes) {
            if (box.id !== targetBox && box.colors.includes(color)) {
                console.log('Color found in another box');
                return false;
            }
        }
        console.log('Cube can be placed in target box');
        return true;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Drag And Drop</Text>
            <View style={styles.boxContainer}>
                {boxes.map((box) => (
                    <TouchableOpacity
                        key={box.id}
                        style={styles.box}
                        id={box.id}
                        onPress={() => handleBoxPress(box.id)}
                    >
                        <Text style={styles.counter}>{box.count}</Text>
                        {box.count > 0 && (
                            <View style={styles.colorContainer}>
                                {box.colors.map((color, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.colorBox,
                                            { backgroundColor: color },
                                        ]}
                                    />
                                ))}
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.cubeContainer}>
                {cubes.map((cube) => (
                    <TouchableOpacity
                        key={cube.id}
                        style={[
                            styles.cube,
                            // eslint-disable-next-line react-native/no-inline-styles
                            { backgroundColor: cube.color, borderWidth: selectedCube === cube.id ? 2 : 1 },
                        ]}
                        id={cube.id}
                        onPress={() => handleCubePress(cube.id)}
                    >
                        <Text style={styles.cubeText}>{cube.value}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default DragAndDrop;