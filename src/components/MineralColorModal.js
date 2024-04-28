/* eslint-disable prettier/prettier */
import React from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const MineralColorModal = ({ isVisible, onClose, onSelectColor }) => {
    const colors = ['Red', 'Yellow', 'Green', 'Blue', 'Violet'];

    const handleColorSelect = (color) => {
        onSelectColor(color);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose && (() => onClose())}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Choose the color of the mineral:</Text>
                    {colors.map((color) => (
                        <TouchableOpacity
                            key={color}
                            style={styles.colorButton}
                            onPress={() => handleColorSelect(color)}
                        >
                            <Text>{color}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    colorButton: {
        backgroundColor: '#DDDDDD',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default MineralColorModal;
