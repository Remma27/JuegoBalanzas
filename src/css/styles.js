import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        
        flex: 1,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
      
        color:'black',
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
        padding: 20, // Aumenta el espacio alrededor del Textarea
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    textarea: {
        backgroundColor: '#F9F9F9', // Cambia el color de fondo
        color: '#333333',
        fontSize: 16,
        padding: 15,
        borderWidth: 1,
        borderColor: '#DADADA', // Cambia el color del borde
        minHeight: 200,
        fontFamily: 'SFMono-Regular',
        borderRadius: 8,
       textAlignVertical: 'top',
    },
    sectionHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    balanceInfo: {
        marginBottom: 15,
    },
    mineralInfo: {
        marginBottom: 5,
    },
    clueInfo: {
        color: '#4CAF50', // Verde
        fontStyle: 'italic',
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
        marginTop: 90, // Modifica este valor según lo necesites
        padding:50,
    },
    button: {
        width: 170,
        height: 45,
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
        textAlign: 'center', // Alinear texto al centro
      },
      button1: {
        width: 170,
        height: 45,
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
        textAlign: 'center', // Alinear texto al centro
      },
      
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center', // Alineación centrada del texto del botón
    },
});
