import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, 
  KeyboardAvoidingView, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import * as Font from 'expo-font'
import * as ImagePicker from 'expo-image-picker';
import {
  FIREBASE_URL
} from '@env';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [create, setCreate] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicUri, setProfilePicUri] = useState(null);
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

  const uploadImage = async (imageUri) => {
    const fileName = `uploads/${new Date().toISOString()}_${imageUri.split('/').pop()}`;
    console.log(fileName)
    // http://localhost:3000
    const response = await fetch(`https://illinigodeployed-1.onrender.com/generate-signed-url?fileName=${fileName}`);
    const { url } = await response.json();
  
    const blob = await fetch(imageUri).then(res => res.blob());
  
    const uploadResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: blob,
    });
  
    if (uploadResponse.ok) {
      console.log('Upload successful');
      return "https://storage.googleapis.com/illinigo/" + fileName;
    } else {
      console.error('Upload failed');
    }
  };

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'ProzaLibre-Regular': require('../../assets/fonts/Proza_Libre/ProzaLibre-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, [])

  const signUp = async () => {
    setLoading(true);
    if (password != confirmPassword) {
      alert("Passwords do not match.")
      return;
    }
    if (username === "") {
      alert("Username is required.")
    }
    try {
      let pfpUrl = "";
      if (profilePicUri != null) {
        pfpUrl = await uploadImage(profilePicUri); // Upload image and get the URL
      }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userData = {
      id: userCredential.user.uid,
      username: username,
      pictures: [],
      found: [],
      pfp: pfpUrl,
    };
    const response = await fetch(`https://illinigodeployed-1.onrender.com/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    console.log(response, "HEY")
    } catch (error) {
      alert('Sign Up Failed: ' + error.message);
    } finally {
      setLoading(false);
    }

  }

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });
    console.log(_image)
    if (!_image.canceled) {
      setProfilePicUri(_image.assets[0].uri);
    }
  }


  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />; 
  }
  return (
    <View style={styles.container}>
      { create ? <View>
              <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={createStyles.container}
          >
            <Text style={createStyles.title}>Create Account</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
              style={createStyles.input}
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              style={createStyles.input}
              autoCapitalize='none'
            />
            <TextInput
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              style={createStyles.input}
              autoCapitalize='none'
            />
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              style={createStyles.input}
              autoCapitalize='none'
            />
            <TouchableOpacity
              style={createStyles.profilePicUploader}
              onPress={addImage}
            >
              {profilePicUri ? (
                <Image source={{ uri: profilePicUri }} style={createStyles.profilePic} />
              ) : (
                <Text style={createStyles.uploadText}>Upload Profile Picture</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={signUp}
              style={createStyles.createAccountButton}
            >
              <Text style={createStyles.createAccountButtonText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCreate(false)} style={styles.createAccountButton}>
        <Text style={styles.createAccountText}>Back</Text>
        </TouchableOpacity>
          </KeyboardAvoidingView>
      </View> :
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <Image source={require('../../assets/IlliniGoLogo.png')} style={styles.image}></Image>
        <Text style={{ fontFamily: 'ProzaLibre-Regular', fontSize: 24, textAlign: 'center'}}>Login to IlliniGo</Text>
        <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
        style={styles.input}
        autoCapitalize='none'
        keyboardType='email-address'
      />
      <View style={styles.passwordContainer}>
        <TextInput
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          style={[styles.input, styles.passwordInput]}
          autoCapitalize='none'
        />
      </View>
        {loading ? <ActivityIndicator size="large" color="#0000ff" />
        : <>
        <TouchableOpacity style={styles.button} onPress={signIn}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        <TouchableOpacity onPress={() => setCreate(true)} style={styles.createAccountButton}>
        <Text style={styles.createAccountText}>Create account</Text>
        </TouchableOpacity>
        </>
        }
      </KeyboardAvoidingView>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'ProzaLibre-Regular',
    marginHorizontal: 20,
  },
  image: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
  input: {
    marginTop: 15,
    height: 50,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 25,
    padding: 10,
    paddingLeft: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    width: 350
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  passwordInput: {
    flex: 1,
  },
  showPasswordButton: {
    marginRight: 10,
  },
  showPasswordText: {
    color: 'green',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#e76011',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    width: 150
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'ProzaLibre-Regular'
  },
  createAccountButton: {
    marginTop: 20,
  },
  createAccountText: {
    color: 'black',
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'ProzaLibre-Regular'
  }
});

const createStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: 350
  },
  title: {
    fontSize: 24,
    fontFamily: 'ProzaLibre-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  profilePicUploader: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 20,
  },
  profilePic: {
    height: '100%',
    width: '100%',
  },
  uploadText: {
    color: 'black',
    textAlign: 'center',
  },
  createAccountButton: {
    height: 50,
    width: '100%',
    borderRadius: 25,
    backgroundColor: '#e76011',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  createAccountButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'ProzaLibre-Regular'
  },
});