import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('Sign in Failed: ' + error.message);
    } finally {
      setLoading(false);
    }

  }

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      alert('Check your Email')
    } catch (error) {
      alert('Sign Up Failed: ' + error.message);
    } finally {
      setLoading(false);
    }

  }
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding'>
        <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize='none' onChangeText={(text) =>setEmail(text)}></TextInput>
        <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize='none' onChangeText={(text) =>setPassword(text)}></TextInput>
        {loading ? <ActivityIndicator size="large" color="#0000ff" />
        : <>
        <Button title="Login" onPress={() => signIn()}></Button>
        <Button title="Create account" onPress={signUp}></Button>
        </>
        }
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  }
});
