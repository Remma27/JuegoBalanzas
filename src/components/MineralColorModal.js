/* eslint-disable prettier/prettier */
import React from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const MineralColorModal = ({ isVisible, onClose, onSelectColor }) => {
    const colors = ['Red', 'Yellow', 'Green', 'Blue', 'Violet'];
    const buttonColors = ['#FF5733', '#FFC300', '#28B463', '#3498DB', '#9B59B6'];
    const screenWidth = Dimensions.get('window').width;
    const buttonWidth = (screenWidth - 80) / colors.length; // Calcular el ancho de los botones

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
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalText}>Choose the color of the mineral:</Text>
                    {colors.map((color, index) => (
                        <TouchableOpacity
                            key={color}
                            style={[styles.colorButton, { width: buttonWidth, backgroundColor: buttonColors[index] }]} // Establecer el ancho y color del botón
                            onPress={() => handleColorSelect(color)}
                        >
                            <Text style={styles.buttonText}>{color}</Text>
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
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default MineralColorModal;
