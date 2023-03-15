import {StatusBar} from 'expo-status-bar';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import {useEffect, useState} from 'react';
import {LocationAccuracy} from 'expo-location';
import MapView, {Marker} from 'react-native-maps';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState({});

  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const checkLastKnownLocation = async () => {
    setLoading(true);
    console.log('Checking');
    let location = await Location.getLastKnownPositionAsync({
      accuracy: LocationAccuracy.High,
    });
    console.log('Checked');
    setLocation(location);
    setLoading(false);
    console.log('Region: ', region);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: region?.latitudeDelta ?? 0.0922,
      longitudeDelta: region?.longitudeDelta ?? 0.0421,
    });
  };

  const checkLocation = async () => {
    setLoading(true);
    console.log('Checking');
    let location = await Location.getCurrentPositionAsync({
      accuracy: LocationAccuracy.High,
    });
    console.log('Checked');
    setLocation(location);
    setLoading(false);
    console.log('Region: ', region);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: region?.latitudeDelta ?? 0.0922,
      longitudeDelta: region?.longitudeDelta ?? 0.0421,
    });
  };

  const checkLocationLowAcc = async () => {
    setLoading(true);
    console.log('Checking');
    let location = await Location.getCurrentPositionAsync({
      accuracy: LocationAccuracy.Lowest,
    });
    console.log('Checked');
    setLocation(location);
    setLoading(false);
    console.log('Region: ', region);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: region?.latitudeDelta ?? 0.0922,
      longitudeDelta: region?.longitudeDelta ?? 0.0421,
    });
  };

  const onRegionChange = (region, details) => {
    if (details.isGesture) {
      setRegion(region);
    }
  };

  // console.log(location);
  // console.log('Region: ', region);

  return (
    <View style={styles.container}>
      {/*<Text>{JSON.stringify(location)}</Text>*/}
      <Text>Latitude: {location?.coords?.latitude}</Text>
      <Text>Longitude: {location?.coords?.longitude}</Text>
      <TouchableOpacity
        style={{
          width: 200,
          height: 30,
          backgroundColor: 'yellow',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 4,
        }}
        onPress={() => checkLastKnownLocation()}>
        <Text>Reload Last Known</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 200,
          height: 30,
          backgroundColor: 'green',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => checkLocation()}>
        <Text>Reload Location High Acc</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 200,
          height: 30,
          backgroundColor: 'blue',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 4,
        }}
        onPress={() => checkLocationLowAcc()}>
        <Text>Reload Location Low Acc</Text>
      </TouchableOpacity>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 52.425035,
          longitude: 16.9482355,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={region}
        onRegionChangeComplete={(region, details) =>
          onRegionChange(region, details)
        }>
        {location?.coords !== undefined && (
          <Marker
            draggable
            coordinate={{
              latitude: location?.coords?.latitude,
              longitude: location?.coords?.longitude,
            }}
          />
        )}
      </MapView>
      <StatusBar style="auto" />
      {loading && <ActivityIndicator size={30} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  map: {
    width: '60%',
    aspectRatio: 1,
  },
});
