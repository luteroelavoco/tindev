import React, { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-community/async-storage";
import { SafeAreaView, Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import api from "../services/api";


export default function Main({ navigation }) {

    const user = navigation.getParam('user');

    const [users, setUsers] = useState([]);

    async function handleLoggout(){
        await AsyncStorage.clear();
        navigation.navigate('Login');
    }

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user
                }
            })
            setUsers(response.data);
        };
        loadUsers();

    }, [user])

    async function handleLike() {
        const [{_id} , ...rest] = users;
        await api.post(`/devs/${_id}/likes`, null, {
            headers: {
                user
            }
        })
        setUsers(rest);
    }

    async function handleDislike() {
        const [{_id} , ...rest] = users;
        await api.post(`/devs/${_id}/dislikes`, null, {
            headers: {
                user
            }
        })
        setUsers(rest);
    }


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLoggout}>
                  <Image source={logo} />
            </TouchableOpacity>
          
            {
                users.length > 0 ? <>
                    <View style={styles.cardsContainer}>
                        {users.map((user, index) => (
                            <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                                <Image style={styles.avatar} source={{ uri: user.avatar }} />
                                <View style={styles.footer}>
                                    <Text style={styles.name}>{user.name}</Text>
                                    <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleDislike}>
                            <Image source={dislike} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleLike}>
                            <Image source={like} />
                        </TouchableOpacity>
                    </View>
                </> : <Text style={styles.empty}> Acabou :) </Text>
            }
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        marginTop: 30,
        justifyContent: 'space-between'
    },
    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },
    empty: {
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        height: 300
    },
    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    avatar: {
        flex: 1,
        height: 300,
    },
    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color: '#999',
        lineHeight: 20,
        marginTop: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        }

    }
})