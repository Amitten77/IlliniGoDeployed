import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios';

const Popup = ({ route }) => {
  const { item, foundItems, pictureIds } = route.params;
  const [character, setCharacter] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://illinigodeployed.onrender.com/api/characters');
        const data = response.data;
        const foundCharacter = data.find(character => character._id === item._id);
        const characterIndex = foundItems.findIndex(item => item === foundCharacter._id);
        setImageUrl(pictureIds[characterIndex]);
        console.log(pictureIds[characterIndex], pictureIds, foundItems)
        setCharacter(foundCharacter);
      } catch (error) {
        console.error('Error fetching character:', error);
      }
    };

    fetchData();
  }, [item._id]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: character.image }} style={styles.image} />
      <Text style={styles.text}>{character ? character.name : 'Unknown Character'}</Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{character ? character.description : 'No description available'}</Text>
      </View>
      <View style={styles.snapsContainer}>
        <View style={styles.snapsBox}>
          <Text style={styles.snapsTitle}>My Snaps:</Text>
            <Image source={{ uri: imageUrl }} style={styles.snapsImage} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F4C279',
    paddingTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  descriptionContainer: {
    backgroundColor: '#65b8f7',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  description: {
    color: 'black',
    fontSize: 16,
  },
  snapsContainer: {
    alignItems: 'center',
    width: '100%',
  },
  snapsBox: {
    backgroundColor: '#65b8f7',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  snapsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  snapsImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});

export default Popup;
