import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center', // Alineación centrada del texto
    },
    boxContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        flexWrap: 'wrap',
    },
    box: {
        width: '20%',
        height: 100,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 10,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1, // Colocar las cajas debajo de los cubos
    },
    counter: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        padding: 10,
        borderRadius: 50,
    },
    cubeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
    },
    cube: {
        width: 60,
        height: 60,
        margin: 5,
        borderWidth: 1,
        borderColor: '#999',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2, // Colocar los cubos encima de las cajas
    },
    cubeText: {
        color: 'white',
        fontWeight: 'bold',
    },
    balanceContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        width: 2,
        backgroundColor: '#000',
        justifyContent: 'flex-end',
    },
    balance: {
        position: 'absolute',
        left: -5,
        right: -5,
        height: 2,
        backgroundColor: '#000',
    },
    balancePivot: {
        height: 20,
        width: 20,
        backgroundColor: '#FFD700',
        borderRadius: 10,
        alignSelf: 'center',
    },
    textareaContainer: {
        flex: 1,
        padding: 10,
        borderColor: '#355DA8',
        borderWidth: 1,
        marginBottom: 10,
    },
    textarea: {
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontSize: 16,
        padding: 5,
        borderColor: '#355DA8',
        borderWidth: 1,
        minHeight: 100, // Altura mínima del área de texto
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
    },
    texto: {
        margin: 5,
        height: 40,
        width: '85%',
        borderStyle: 'solid',
        borderColor: '#355DA8',
        borderWidth: 1,
        fontSize: 16,
    },
    btnEnviar: {
        backgroundColor: '#355DA8',
        marginTop: 20, // Aumentando la separación desde la parte superior
        height: 40,
        paddingTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Alineación horizontal al centro
        alignItems: 'flex-start', // Alineación vertical al inicio
        width: '70%',
        paddingHorizontal: 20,
        marginTop: 0, // Modifica este valor según lo necesites
    },
    button: {
        backgroundColor: '#FFD700', // Color amarillo para el botón "Adivinar pesos"
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5, // Margen horizontal entre botones
    },
    button1: {
        backgroundColor: 'blue', // Color azul para el botón "Colocar cubos"
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5, // Margen horizontal entre botones
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center', // Alineación centrada del texto del botón
    },
});
