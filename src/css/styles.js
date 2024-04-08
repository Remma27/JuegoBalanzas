/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */

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
        cursor: 'grab',
    },
    cubeText: {
        color: 'white',
        fontWeight: 'bold',
    },
});