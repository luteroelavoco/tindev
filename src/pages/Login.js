import React, {useState, useEffect} from 'react';
import { KeyboardAvoidingView,Platform, StyleSheet, Image, TextInput, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";


import logo from "../assets/logo.png";
import api from "../services/api";
export default function Login({navigation}) {

    const [user, setUser] = useState();


    useEffect(()=>{
        AsyncStorage.getItem('user').then(user => {
            if(user)
                navigation.navigate('Main', {user})
        })

    },[])

    async function handleLogin(){
        const response = await api.post('/devs',{
            username: user 
        });
        
        const { _id } = response.data;

        await AsyncStorage.setItem('user', _id);
        
        navigation.navigate('Main', {user: _id });
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
    }
})
