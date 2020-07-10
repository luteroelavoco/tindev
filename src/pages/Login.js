import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Image, TextInput, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import load from "../assets/load.gif";


import logo from "../assets/logo.png";
import api from "../services/api";
export default function Login({ navigation }) {

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();


    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user)
                navigation.navigate('Main', { user })
        })
    }, [])

    async function handleLogin() {

        setLoading(true);
        await api.post('/devs', {
            username: user
        }).then(response => {
            const { _id } = response.data;

            (async function logar() { await AsyncStorage.setItem('user', _id) })();

            navigation.navigate('Main', { user: _id });

        }).catch(error => {
            if (error) {
                if (error.response.status === 404)
                    setError('Usuario não existe');
                else if (error.response.status === 406)
                    setError('Este usuário do github contem informações invalidas');
                else
                    setError('Aconteceu um erro no servidor, tenta mais tarde');
                return;
            }
            setError('Aconteceu um erro no servidor, tenta mais tarde');
        }).finally(resp => {
            (() => {
                setLoading(false)
            })();
        })


    }



    return (
        <KeyboardAvoidingView
            behavior="padding"
            enabled={Platform.OS === 'ios'}
            style={styles.container}
        >
            <Image source={logo} />

            <TextInput style={styles.input}
                autoCapitalize='none'
                autoCorrect={false}
                placeholder="Digite seu usuario do github"
                placeholderTextColor="#999"
                value={user}
                onChangeText={setUser}
            />

            {loading && <Image style={styles.loading} source={require('../assets/load.gif')} />}

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15,
    },
    loading: {
        height: 60,
        resizeMode: 'contain'
    },
    error: {
        marginVertical: 8,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center'
    },
    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

})
