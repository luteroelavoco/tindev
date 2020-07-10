import React, { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-community/async-storage";
import { SafeAreaView, Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import ImageLoad from 'react-native-image-placeholder';
import io from "socket.io-client";
import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import itsmatch from "../assets/match.png";
import api, { url } from "../services/api";


export default function Main({ navigation }) {

    const user = navigation.getParam('user');

    const [users, setUsers] = useState([]);
    const [matchDev, setMachDev] = useState(null);

    async function handleLoggout() {
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


    useEffect(() => {
        const socket = io(url, {
            query: { user }
        });

        socket.on('match', dev => {
            setMachDev(dev)
        })

    }, [user])

    async function handleLike() {
        const [{ _id }, ...rest] = users;
        await api.post(`/devs/${_id}/likes`, null, {
            headers: {
                user
            }
        })
        setUsers(rest);
    }

    async function handleDislike() {
        const [{ _id }, ...rest] = users;
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
                                <ImageLoad
                                    style={styles.avatar}
                                    loadingStyle={{ size: 'large', color: '#DF4723' }}
                                    source={{ uri: user.avatar }}
                                />
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

            {matchDev && (
                <View style={styles.matchContainer}>
                    <Image style={styles.itsmatch} source={itsmatch} />
                    <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
                    <Text style={styles.matchName}> {matchDev.name}</Text>
                    <Text style={styles.matchBio}> {matchDev.bio}</Text>
                    <TouchableOpacity onPress={() => setMachDev(null)}>
                        <Text style={styles.closeMatch}> Fechar </Text>
                    </TouchableOpacity>
                </View>
            )}
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
        marginBottom: 30,
        zIndex: 10
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

    },
    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0 , 0 , 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999
    },
    itsmatch: {
        height: 30,
        resizeMode: 'contain'
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },
    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    matchBio: {
        margin: 10,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    closeMatch: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'
    }

})